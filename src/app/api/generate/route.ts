import { createClient } from "@/lib/insforge/server"
import { NextResponse } from "next/server"
import { CREDIT_COSTS, deductCredits } from "@/lib/credits"

// Initial cost to start the process (e.g., 3 photos)
// Actual cost might vary during process, but we check and deduct an estimate or the exact amount upfront/per step.
// For simplicity in MVP, we can deduct the full estimated amount upfront, and if a step fails, 
// we leave it as is (as per PRD: no automatic refund for MVP).

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productName, productPrice, highlights, imageUrls, aiModel } = body

    if (!productName || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Determine extra cost if using Pro models
    const isPro = aiModel?.includes('pro')
    const videoCostPerImage = isPro ? CREDIT_COSTS.VIDEO_CLIP_PER_IMAGE * 2 : CREDIT_COSTS.VIDEO_CLIP_PER_IMAGE

    // Calculate initial estimated cost
    const estimatedCost = CREDIT_COSTS.SCRIPT + 
                          (imageUrls.length * videoCostPerImage) + 
                          CREDIT_COSTS.VOICEOVER + 
                          CREDIT_COSTS.ASSEMBLY

    // Create the generation record first to get an ID
    const { data: genRecord, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        status: 'queued',
        input_product_name: productName,
        input_product_price: productPrice || '',
        input_product_highlights: highlights || '',
        input_image_urls: imageUrls,
        credit_cost: estimatedCost,
        ai_model: aiModel || 'fal-ai/kling-video/v1/standard/image-to-video'
      })
      .select()
      .single()

    if (genError || !genRecord) {
      console.error("Error creating generation record:", genError)
      return NextResponse.json({ error: "Failed to create generation task" }, { status: 500 })
    }

    // Deduct credits
    try {
      await deductCredits(user.id, estimatedCost, genRecord.id, "Initial deduction for video generation")
    } catch (error) {
      // If deduction fails, update status to failed
      await supabase
        .from('generations')
        .update({ status: 'failed', error_message: 'Insufficient credits or deduction failed' })
        .eq('id', genRecord.id)
        
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Trigger background processing via internal API call (fire and forget)
    // Note: In production Vercel, consider using edge functions or specialized queues (Inngest, Upstash)
    fetch(new URL('/api/cron/process', request.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generationId: genRecord.id })
    }).catch(console.error)

    return NextResponse.json({ 
      success: true, 
      generationId: genRecord.id,
      message: "Generation queued successfully" 
    })

  } catch (error) {
    console.error("Error in generate API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
