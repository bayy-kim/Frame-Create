import { fal } from "@fal-ai/client";

// Ensure fal is configured to use the proxy in production to hide the API key
// For MVP/Server actions, we can call it directly since server actions run on the server

export async function generateImageToVideo(imageUrl: string, aiModel: string = "fal-ai/kling-video/v1/standard/image-to-video", prompt: string = "A slow cinematic pan, product showcase, high quality, 4k") {
  try {
    const result: any = await fal.subscribe(aiModel, {
      input: {
        image_url: imageUrl,
        prompt: prompt,
        duration: "5"
      } as any,
      logs: true,
      onQueueUpdate: (update: any) => {
        console.log("Fal.ai Queue Update:", update);
      },
    });

    // Handle standard kling output format
    if (result && result.video && result.video.url) {
      return result.video.url;
    }
    throw new Error("Failed to generate video: No video URL in response");
  } catch (error) {
    console.error("Error in generateImageToVideo:", error);
    throw error;
  }
}


