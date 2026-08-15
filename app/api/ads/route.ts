import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { productDetails, platform, targetAudience } = await req.json();

    if (!productDetails) {
      return NextResponse.json({ error: 'Product details are required' }, { status: 400 });
    }

    const platformGuidelines = {
      facebook: "Keep primary text conversational but compelling. Include emojis. Headlines should be catchy and stop the scroll.",
      instagram: "Highly visual and engaging. Short punchy text. Include relevant hashtags.",
      google: "Focus on search intent. Clear value proposition. Very concise headlines and description lines."
    }[platform as 'facebook' | 'instagram' | 'google'] || '';

    const prompt = `
You are an expert digital marketing copywriter.
Generate 3 distinct ad copy variations for the following product/offer.

Platform: ${platform}
Product/Offer Details: "${productDetails}"
Target Audience: ${targetAudience || 'General public'}

Platform Guidelines: ${platformGuidelines}

Respond ONLY with a JSON object in the following format:
{
  "variations": [
    {
      "headline": "Short, catchy headline (max 40 chars)",
      "primaryText": "The main ad body copy. Use emojis if appropriate for the platform.",
      "description": "Optional short sub-description (max 30 chars, good for Google/FB link descriptions)",
      "callToAction": "e.g. Learn More, Shop Now, Get Offer"
    }
  ]
}
Ensure exactly 3 variations are returned in valid JSON format.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini API');

    const result = JSON.parse(text);

    return NextResponse.json({
      variations: result.variations
    });

  } catch (error: any) {
    console.error('Ad Copy Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
