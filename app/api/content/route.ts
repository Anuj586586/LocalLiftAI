import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { location, goal, platforms, tone, language } = await req.json();

    const prompt = `
      You are an expert local business marketer analyzing current online trends for high-conversion content.
      Business/Location: ${location}
      Campaign Goal: ${goal}
      Platforms: ${platforms.join(', ')}
      Tone of Voice: ${tone}
      Language: ${language}

      Generate highly engaging, hyper-localized content. 
      - Instagram: Include relevant emojis, trending-style hashtags, and a strong visual hook.
      - Google Business: Make it SEO-friendly, direct, with a clear Call-to-Action (CTA).
      - WhatsApp: Keep it conversational, short, with clear spacing and a direct offer link or next step.
      - Other platforms: Adapt optimally to their standard best practices.
      
      Keep the text concise and punchy to minimize generation time.
      Only return a valid JSON object matching the requested schema.
    `;

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: {
                    type: Type.STRING,
                    description: "The name of the platform (e.g., 'Instagram', 'WhatsApp').",
                  },
                  content: {
                    type: Type.STRING,
                    description: "The generated marketing copy or script.",
                  },
                },
                required: ["platform", "content"],
              },
            },
          },
        });
        break; // Success
      } catch (err: any) {
        if (err?.status === "UNAVAILABLE" || err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("demand")) {
          retries--;
          if (retries === 0) throw err;
          // Wait before retrying (exponential backoff)
          await new Promise(res => setTimeout(res, (4 - retries) * 1500));
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw new Error("Failed to get response after retries");
    }

    const jsonStr = response.text?.trim() || "{}";
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Content generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
