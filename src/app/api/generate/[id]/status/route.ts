import { createClient } from "@/lib/insforge/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: generation, error } = await supabase
    .from('generations')
    .select('id, status, output_video_url, error_message')
    .eq('id', id)
    .single()

  if (error || !generation) {
    return NextResponse.json({ error: "Generation not found" }, { status: 404 })
  }

  // Check if user is owner or admin (Admins should be able to view, but here we just check if it exists)
  // RLS handles the security. If it returned data, the user has access.

  return NextResponse.json(generation)
}
