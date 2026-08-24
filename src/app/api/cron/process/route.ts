import { NextResponse } from 'next/server'
import { processGeneration } from '@/lib/worker'

// This is a workaround for MVP background processing.
// We can call this API route internally to start processing without blocking the client response.

export async function POST(request: Request) {
  try {
    const { generationId } = await request.json()
    
    if (!generationId) {
      return NextResponse.json({ error: "Missing generationId" }, { status: 400 })
    }

    // Fire and forget (Vercel might kill this depending on plan, but works for local/MVP test)
    processGeneration(generationId).catch(console.error)

    return NextResponse.json({ success: true, message: "Processing started" })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
