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
    const { prompt, businessName } = await req.json();

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `
            You are a local business marketing assistant for a business named "${businessName}". The user wants to create a new campaign:
            "${prompt}"
            
            Generate a comprehensive campaign outline.
            Return ONLY valid JSON matching this schema.
          `,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "A catchy title for the campaign",
                },
                summary: {
                  type: Type.STRING,
                  description: "A 1-2 sentence summary of what this campaign will achieve",
                },
                channels: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                  },
                  description: "Recommended channels (e.g. Instagram, WhatsApp)",
                },
                samplePost: {
                  type: Type.STRING,
                  description: "A sample social media post to launch the campaign",
                }
              },
              required: ["title", "summary", "channels", "samplePost"]
            }
          }
        });
        break; // Success
      } catch (err: any) {
        if (err?.status === "UNAVAILABLE" || err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("demand")) {
          retries--;
          if (retries === 0) throw err;
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
    console.error("Campaign generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate campaign plan" }, { status: 500 });
  }
}
