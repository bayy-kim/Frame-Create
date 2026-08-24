import { createClient } from "./insforge/server"

export async function deductCredits(userId: string, amount: number, referenceId: string, description: string) {
  const supabase = await createClient()

  // 1. Check if user is admin
  const { data: user } = await supabase
    .from('users')
    .select('role, credit_balance')
    .eq('id', userId)
    .single()

  if (!user) throw new Error("User not found")
  
  if (user.role === 'admin') {
    // Admins have unlimited credits, just log the transaction as 0 cost or don't deduct
    // We still log it for tracking purposes, but amount 0
    const { error: txError } = await supabase.from('credit_transactions').insert({
      user_id: userId,
      amount: 0,
      type: 'generate_deduct',
      reference_id: referenceId
    })
    
    if (txError) console.error("Failed to log admin transaction", txError)
    return true
  }

  // 2. Check balance
  if (user.credit_balance < amount) {
    throw new Error("Insufficient credits")
  }

  // 3. Atomic deduction using RPC
  const { data: success, error: rpcError } = await supabase.rpc('deduct_credits', {
    target_user_id: userId,
    amount: amount
  })

  if (rpcError || !success) {
    throw new Error("Failed to deduct credits or insufficient balance")
  }

  // 4. Log transaction
  const { error: txError } = await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount, // Negative for deduction
    type: 'generate_deduct',
    reference_id: referenceId
  })

  if (txError) {
    console.error("Failed to log transaction, but credits were deducted", txError)
  }

  return true
}

export const CREDIT_COSTS = {
  SCRIPT: 0,
  VIDEO_CLIP_PER_IMAGE: 10,
  VOICEOVER: 3,
  ASSEMBLY: 5
}
