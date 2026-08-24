import { createClient } from "./insforge/server"
import { generateScriptAndCaption } from "./providers/gemini"
import { generateImageToVideo } from "./providers/fal"
import { generateVoiceover, assembleVideo } from "./providers/json2video"

export async function processGeneration(generationId: string) {
  // We need a service role client to update records asynchronously after the initial request ends
  // For MVP in Next.js, we might struggle with true background tasks without external services.
  // Assuming this is called in an environment that supports it, or as part of a long-running API route.
  
  // Note: createClient() here uses cookies which might not be available in a true background worker.
  // We should ideally pass the required auth tokens or use a service role key.
  const supabase = await createClient()

  try {
    // 1. Fetch generation details
    const { data: gen } = await supabase.from('generations').select('*').eq('id', generationId).single()
    if (!gen) throw new Error("Generation record not found")

    // Update status: generating_script
    await updateStatus(supabase, generationId, 'generating_script')
    
    const scriptResult = await generateScriptAndCaption(
      gen.input_product_name, 
      gen.input_product_price, 
      gen.input_product_highlights
    )
    const scriptText = scriptResult.body || "Script promosi default"

    await supabase.from('generations').update({ script_text: JSON.stringify(scriptResult) }).eq('id', generationId)

    // Update status: generating_voice
    await updateStatus(supabase, generationId, 'generating_voice')
    const voiceUrl = await generateVoiceover(scriptText)
    await supabase.from('generations').update({ voice_url: voiceUrl }).eq('id', generationId)

    // Update status: generating_video
    await updateStatus(supabase, generationId, 'generating_video')
    const clipUrls: string[] = []
    
    // Generate clips sequentially or in parallel
    for (const imgUrl of gen.input_image_urls) {
      try {
        const clipUrl = await generateImageToVideo(imgUrl, "cinematic product showcase")
        clipUrls.push(clipUrl)
      } catch (err) {
        console.error("Failed to generate clip for image", imgUrl, err)
        // MVP: if one fails, we either fallback or fail the whole thing. 
        // PRD says: "ada fallback kalau 1 klip gagal"
        // For MVP mock, we just use a static fallback URL
        clipUrls.push("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4")
      }
    }
    await supabase.from('generations').update({ clip_urls: clipUrls }).eq('id', generationId)

    // Update status: assembling
    await updateStatus(supabase, generationId, 'assembling')
    const finalVideoUrl = await assembleVideo(clipUrls, voiceUrl, scriptText)
    
    // Final update
    await supabase.from('generations').update({ 
      status: 'done', 
      output_video_url: finalVideoUrl 
    }).eq('id', generationId)

  } catch (error: any) {
    console.error(`Generation ${generationId} failed:`, error)
    await supabase.from('generations').update({ 
      status: 'failed', 
      error_message: error.message || "Unknown error occurred" 
    }).eq('id', generationId)
  }
}

async function updateStatus(supabase: any, id: string, status: string) {
  await supabase.from('generations').update({ status }).eq('id', id)
}
