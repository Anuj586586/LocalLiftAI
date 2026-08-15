import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { reviewText, tone, brandName } = await req.json();

    if (!reviewText) {
      return NextResponse.json({ error: 'Review text is required' }, { status: 400 });
    }

    const prompt = `
You are an expert PR and customer service manager. 
A customer has left the following review for a business${brandName ? ` named "${brandName}"` : ''}.
Review: "${reviewText}"

Please draft 3 distinct, ready-to-publish response options in a "${tone}" tone.
Respond ONLY with a JSON object in the following format:
{
  "options": [
    "Response option 1...",
    "Response option 2...",
    "Response option 3..."
  ],
  "explanation": "A brief 2-3 sentence explanation of why these responses are effective and how they address the customer's sentiment."
}
Make sure the JSON is valid and contains exactly 3 options. No markdown formatting outside the JSON object.
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
      options: result.options,
      explanation: result.explanation
    });

  } catch (error: any) {
    console.error('Review Responder Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
