import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `You are a deeply empathetic, patient, and supportive companion for someone experiencing their period. They may be in physical pain, dealing with hormonal changes, feeling emotional, or experiencing cravings and discomfort.

CRITICAL RULES:
1. Keep ALL responses SHORT (1-3 sentences maximum). No long lectures or essays.
2. Be warm, validating, and understanding - never dismissive.
3. Offer gentle suggestions, not medical advice.
4. Use comforting emojis sparingly (🌸💕🫂).
5. Match your tone to their mood - if they're angry, validate that anger. If they're sad, be extra gentle.
6. Never make them feel guilty for feeling unwell or needing rest.

Example responses:
- If they say "I have cramps": "That sounds really painful 💕 Have you tried a heating pad or hot water bottle? Sometimes gentle movement helps too, but rest is totally okay."
- If they say "I'm so emotional": "It's completely okay to feel everything right now 🌸 Your feelings are valid. Want to talk about it or need a distraction?"
- If they say "I want chocolate": "You deserve all the chocolate! 🍫 No guilt, just comfort. What kind sounds good?"`;

export async function POST(request: Request) {
    try {
        const { message, mood } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        // Add mood context to the message
        const contextualMessage = mood && mood !== 'neutral'
            ? `[Current state: ${mood}] ${message}`
            : message;

        const result = await model.generateContent(contextualMessage);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return NextResponse.json(
            { error: 'Failed to get response. Make sure your GEMINI_API_KEY is set.' },
            { status: 500 }
        );
    }
}
