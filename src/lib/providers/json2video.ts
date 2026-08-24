async function pollMovieStatus(projectId: string, apiKey: string): Promise<string> {
  const maxAttempts = 60; // Up to 5 minutes (5s interval)
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    const res = await fetch(`https://api.json2video.com/v2/movies?project=${projectId}`, {
      headers: {
        "x-api-key": apiKey
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to check JSON2Video project status: ${res.statusText}`);
    }

    const data = await res.json();
    const movie = data.movie;

    if (!movie) {
      throw new Error("Invalid response from JSON2Video status API");
    }

    if (movie.status === "done") {
      return movie.url;
    }

    if (movie.status === "error" || movie.status === "timeout") {
      throw new Error(movie.message || `JSON2Video render failed with status: ${movie.status}`);
    }
  }

  throw new Error("JSON2Video render timed out after 5 minutes");
}

export async function generateVoiceover(text: string) {
  const apiKey = process.env.JSON2VIDEO_API_KEY;

  if (!apiKey) {
    console.warn("No JSON2VIDEO_API_KEY found, using mock audio URL");
    return "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg";
  }

  try {
    const res = await fetch("https://api.json2video.com/v2/movies", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resolution: "square",
        scenes: [
          {
            elements: [
              {
                type: "voice",
                text: text,
                voice: "id-ID-ArdiNeural",
                model: "azure"
              }
            ]
          }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`JSON2Video create movie failed: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.success || !data.project) {
      throw new Error(data.message || "Failed to initiate JSON2Video voiceover project");
    }

    return await pollMovieStatus(data.project, apiKey);
  } catch (error) {
    console.error("Error in generateVoiceover:", error);
    throw error;
  }
}

export async function assembleVideo(clipUrls: string[], voiceUrl: string, subtitleText: string) {
  const apiKey = process.env.JSON2VIDEO_API_KEY;

  if (!apiKey) {
    console.warn("No JSON2VIDEO_API_KEY found, using mock video URL");
    return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  }

  try {
    const scenes = clipUrls.map((url) => ({
      duration: 5,
      transition: {
        style: "fade",
        duration: 0.5
      },
      elements: [
        {
          type: "video",
          src: url
        }
      ]
    }));

    const elements: any[] = [];

    if (voiceUrl) {
      elements.push({
        type: "audio",
        src: voiceUrl
      });
    }

    elements.push({
      type: "subtitles",
      language: "id",
      settings: {
        style: "boxed-word",
        "font-family": "Oswald Bold",
        "font-size": 80,
        "word-color": "#FFFF00",
        "line-color": "#FFFFFF",
        "box-color": "#000000",
        position: "bottom-center"
      }
    });

    const res = await fetch("https://api.json2video.com/v2/movies", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resolution: "vertical",
        scenes: scenes,
        elements: elements
      })
    });

    if (!res.ok) {
      throw new Error(`JSON2Video assemble failed: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.success || !data.project) {
      throw new Error(data.message || "Failed to initiate JSON2Video assemble project");
    }

    return await pollMovieStatus(data.project, apiKey);
  } catch (error) {
    console.error("Error in assembleVideo:", error);
    throw error;
  }
}
