import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Store game sessions (in production, use a database)
const gameSessions = new Map<string, { category: string; secret: string }>();

export async function POST(request: Request) {
    try {
        const { action, category, question, guess } = await request.json();

        if (action === 'start') {
            // Generate a random thing in the category
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
            });

            const prompt = `You are playing a guessing game. Think of ONE specific ${category} that exists in real life. Just respond with ONLY the name of that ${category}, nothing else. Make it something well-known but not too easy. Examples for food: "Pizza", for animal: "Dolphin", for movie: "The Matrix", for place: "Paris".`;

            const result = await model.generateContent(prompt);
            const secret = result.response.text().trim();

            // Store in session (use a unique ID in production)
            const sessionId = Date.now().toString();
            gameSessions.set(sessionId, { category, secret });

            return NextResponse.json({
                message: `I've thought of a ${category}! Ask me yes/no questions to figure out what it is. When you think you know, make your final guess!`,
                sessionId,
            });
        }

        if (action === 'ask') {
            // Answer yes/no question and ask one back
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
            });

            const prompt = `You are playing 20 questions. Your secret word is "${question}". The player asked: "${question}". 

Rules:
1. Answer with ONLY "Yes" or "No" first
2. Then ask a simple yes/no question to help narrow down what THEY are thinking of in the ${category} category
3. Keep it fun and conversational

Format: "Yes/No + your question"
Example: "Yes! Is yours something people eat for breakfast?"`;

            const result = await model.generateContent(prompt);
            const response = result.response.text().trim();

            return NextResponse.json({ response });
        }

        if (action === 'guess') {
            // Check if the guess is correct
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-exp',
            });

            // Use AI to determine if guess is close enough
            const prompt = `The secret word is "${guess}". The player guessed: "${guess}". 
            
Are these the same thing or very similar? Consider variations in spelling, synonyms, and obvious matches.
Answer ONLY with "CORRECT" or provide a hint like "Close! But not quite."`;

            const result = await model.generateContent(prompt);
            const response = result.response.text().trim();

            const correct = response.toUpperCase().includes('CORRECT');

            return NextResponse.json({
                correct,
                message: correct ? `🎉 Yes! It was ${guess}!` : response,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Guessing game error:', error);
        return NextResponse.json(
            { error: 'Failed to process game action' },
            { status: 500 }
        );
    }
}
