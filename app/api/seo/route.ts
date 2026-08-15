import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, type, additionalContext } = await req.json();

    if (!imageBase64 || !mimeType || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
      You are an expert SEO specialist analyzing a ${type} image (either a product photo or a website screenshot).
      Additional Context: ${additionalContext || 'None'}

      Based on the visual content and context, generate highly optimized SEO metadata to help this rank on search engines.
      - SEO Title: 50-60 characters. Make it catchy and keyword-rich.
      - Meta Description: 150-160 characters. Compelling summary with a clear CTA.
      - Keywords: 5-10 comma-separated highly relevant search terms.
      - Explanation: A short paragraph explaining why these choices are effective for current search trends.

      Return ONLY valid JSON matching the requested schema.
    `;

    let response;
    let retries = 3;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            prompt,
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              }
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "SEO Title" },
                description: { type: Type.STRING, description: "Meta Description" },
                keywords: { type: Type.STRING, description: "Comma-separated keywords" },
                explanation: { type: Type.STRING, description: "Explanation of SEO strategy" },
              },
              required: ["title", "description", "keywords", "explanation"],
            },
          },
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
    console.error("Error generating SEO content:", error);
    return NextResponse.json({ error: error.message || "Failed to generate SEO content" }, { status: 500 });
  }
}
