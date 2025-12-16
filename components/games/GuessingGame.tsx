"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useComfort } from '@/contexts/ComfortContext';

interface GuessingGameProps {
    onClose: () => void;
}

type Category = 'food' | 'animal' | 'movie' | 'place';

export default function GuessingGame({ onClose }: GuessingGameProps) {
    const [gameState, setGameState] = useState<'category' | 'playing' | 'won' | 'lost'>('category');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
    const [questionsLeft, setQuestionsLeft] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const { addCoins } = useCurrency();
    const { selectedCharacter } = useComfort();

    const categories: Array<{ id: Category; name: string; icon: string }> = [
        { id: 'food', name: 'Food & Drinks', icon: '🍕' },
        { id: 'animal', name: 'Animals', icon: '🐶' },
        { id: 'movie', name: 'Movies & Shows', icon: '🎬' },
        { id: 'place', name: 'Places', icon: '🗺️' },
    ];

    const startGame = async (category: Category) => {
        setSelectedCategory(category);
        setIsLoading(true);

        try {
            const response = await fetch('/api/games/guessing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'start', category }),
            });

            const data = await response.json();

            if (data.message) {
                setConversation([{ role: 'assistant', content: data.message }]);
                setGameState('playing');
            }
        } catch (error) {
            console.error('Error starting game:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const askQuestion = async () => {
        if (!userInput.trim() || isLoading || questionsLeft <= 0) return;

        const question = userInput.trim();
        setUserInput('');
        setConversation(prev => [...prev, { role: 'user', content: question }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/games/guessing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'ask',
                    question,
                    category: selectedCategory,
                }),
            });

            const data = await response.json();

            if (data.response) {
                setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
                setQuestionsLeft(prev => prev - 1);
            }
        } catch (error) {
            console.error('Error asking question:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const makeGuess = async (guess: string) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/games/guessing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'guess',
                    guess,
                    category: selectedCategory,
                }),
            });

            const data = await response.json();

            if (data.correct) {
                const coinsEarned = Math.floor(50 + questionsLeft * 5);
                addCoins(coinsEarned);
                setConversation(prev => [...prev, {
                    role: 'assistant',
                    content: `🎉 Yes! You guessed it! You earned ${coinsEarned} coins!`
                }]);
                setGameState('won');
            } else {
                setConversation(prev => [...prev, {
                    role: 'assistant',
                    content: data.message || 'Nope! Keep trying!'
                }]);
                if (questionsLeft <= 0) {
                    setGameState('lost');
                }
            }
        } catch (error) {
            console.error('Error making guess:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (gameState === 'category') {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        20 Questions
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        I'll think of something, and you try to guess it by asking yes/no questions!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.id}
                                onClick={() => startGame(cat.id)}
                                disabled={isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-br from-comfort-pink-100 to-comfort-lavender-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                <div className="text-5xl mb-3">{cat.icon}</div>
                                <div className="font-bold text-gray-800">{cat.name}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Guessing Game
                    </h2>
                    <div className="text-lg font-semibold text-gray-700">
                        Questions Left: {questionsLeft}
                    </div>
                </div>

                {/* Conversation */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 h-96 overflow-y-auto">
                    {conversation.map((msg, idx) => (
                        <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white text-gray-800 shadow-md'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="text-left">
                            <div className="inline-block bg-white p-3 rounded-2xl shadow-md">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                {gameState === 'playing' && questionsLeft > 0 && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                                placeholder="Ask a yes/no question..."
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={askQuestion}
                                disabled={isLoading || !userInput.trim()}
                                className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50"
                            >
                                Ask
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                const guess = prompt('What is your final guess?');
                                if (guess) makeGuess(guess);
                            }}
                            className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                        >
                            Make Final Guess
                        </button>
                    </div>
                )}

                {/* Game Over */}
                {(gameState === 'won' || gameState === 'lost') && (
                    <div className="text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            Back to Games
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
