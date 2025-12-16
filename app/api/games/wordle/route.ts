import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { action } = await request.json();

        if (action === 'new') {
            // Generate a random 5-letter word
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
            });

            const prompt = `Generate ONE random common 5-letter English word that would be good for a Wordle game. Respond with ONLY the word in UPPERCASE, nothing else. Make it a real word that most people would know. Examples: HOUSE, BREAD, STONE, PLANET, MUSIC`;

            const result = await model.generateContent(prompt);
            const word = result.response.text().trim().toUpperCase();

            // Validate it's 5 letters
            if (word.length !== 5 || !/^[A-Z]+$/.test(word)) {
                // Fallback words if API fails
                const fallbackWords = ['BREAD', 'HOUSE', 'PLANT', 'STONE', 'MUSIC', 'CLOUD', 'HEART', 'SMILE'];
                const randomWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
                return NextResponse.json({ word: randomWord });
            }

            return NextResponse.json({ word });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Wordle error:', error);
        // Return fallback word on error
        const fallbackWords = ['BREAD', 'HOUSE', 'PLANT', 'STONE', 'MUSIC'];
        const randomWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
        return NextResponse.json({ word: randomWord });
    }
}
