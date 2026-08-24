import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateScriptAndCaption(productName: string, productPrice: string, highlights: string) {
  const prompt = `Buatkan script video promosi afiliasi TikTok/Shopee yang menarik dan engaging.
Produk: ${productName}
Harga: ${productPrice}
Keunggulan: ${highlights}

Format output harus JSON seperti ini:
{
  "hook": "Kalimat pembuka yang bikin orang berhenti scroll (max 5 detik).",
  "body": "Penjelasan fitur dan masalah yang diselesaikan.",
  "cta": "Ajakan bertindak untuk klik keranjang kuning atau link di bio.",
  "caption": "Caption untuk diposting di TikTok/Shopee beserta hashtag yang relevan."
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || '{}');
}
