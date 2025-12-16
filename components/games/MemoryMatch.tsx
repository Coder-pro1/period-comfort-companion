"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';

interface MemoryMatchProps {
    onClose: () => void;
}

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function MemoryMatch({ onClose }: MemoryMatchProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
    const { addCoins } = useCurrency();

    const comfortEmojis = ['💕', '🌸', '🍫', '☕', '🛁', '💐', '🎵', '📖'];

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const pairs = comfortEmojis.map((emoji, index) => [
            { id: index * 2, emoji, isFlipped: false, isMatched: false },
            { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false },
        ]).flat();

        // Shuffle cards
        const shuffled = pairs.sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setFlippedCards([]);
        setMatches(0);
        setMistakes(0);
        setGameState('playing');
    };

    const handleCardClick = (cardId: number) => {
        if (flippedCards.length === 2) return;
        if (flippedCards.includes(cardId)) return;
        if (cards.find(c => c.id === cardId)?.isMatched) return;

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        // Flip the card
        setCards(cards.map(card =>
            card.id === cardId ? { ...card, isFlipped: true } : card
        ));

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            const firstCard = cards.find(c => c.id === first);
            const secondCard = cards.find(c => c.id === second);

            if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
                // Match found!
                setTimeout(() => {
                    setCards(cards.map(card =>
                        card.id === first || card.id === second
                            ? { ...card, isMatched: true }
                            : card
                    ));
                    setMatches(prev => prev + 1);
                    setFlippedCards([]);

                    // Check if game is won
                    if (matches + 1 === comfortEmojis.length) {
                        const coinsEarned = Math.max(40, 80 - mistakes * 10);
                        addCoins(coinsEarned);
                        setGameState('won');
                    }
                }, 600);
            } else {
                // No match
                setMistakes(prev => prev + 1);
                setTimeout(() => {
                    setCards(cards.map(card =>
                        card.id === first || card.id === second
                            ? { ...card, isFlipped: false }
                            : card
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-3 md:p-6 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 md:mb-6">
                    <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Memory Match
                    </h2>
                    <div className="text-right">
                        <div className="text-xs md:text-sm text-gray-600">Matches: {matches}/{comfortEmojis.length}</div>
                        <div className="text-xs md:text-sm text-gray-600">Mistakes: {mistakes}</div>
                    </div>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
                    {cards.map((card) => (
                        <motion.button
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                            whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                            disabled={card.isMatched}
                            className={`aspect-square rounded-xl md:rounded-2xl text-2xl md:text-4xl flex items-center justify-center transition-all ${card.isFlipped || card.isMatched
                                ? 'bg-gradient-to-br from-pink-400 to-purple-400'
                                : 'bg-gradient-to-br from-gray-200 to-gray-300'
                                } ${card.isMatched ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                                }`}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                {card.isFlipped || card.isMatched ? card.emoji : '?'}
                            </motion.div>
                        </motion.button>
                    ))}
                </div>

                {/* Game Controls */}
                {gameState === 'playing' && (
                    <div className="text-center">
                        <button
                            onClick={initializeGame}
                            className="px-4 py-2 md:px-6 md:py-3 bg-gray-500 text-white text-sm md:text-base rounded-xl hover:bg-gray-600 transition-colors"
                        >
                            Restart Game
                        </button>
                    </div>
                )}

                {/* Win State */}
                {gameState === 'won' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center space-y-3 md:space-y-4"
                    >
                        <div className="text-3xl md:text-4xl">🎉</div>
                        <div className="text-xl md:text-2xl font-bold text-green-600">Perfect Match!</div>
                        <div className="text-base md:text-lg text-gray-600">
                            You earned {Math.max(40, 80 - mistakes * 10)} coins!
                        </div>
                        <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
                            <button
                                onClick={initializeGame}
                                className="px-4 py-2 md:px-6 md:py-3 bg-purple-500 text-white text-sm md:text-base rounded-xl hover:bg-purple-600 transition-colors"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 md:px-6 md:py-3 bg-gray-500 text-white text-sm md:text-base rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                Back to Games
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
