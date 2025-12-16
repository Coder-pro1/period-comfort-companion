"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ReactionGameProps {
    onClose: () => void;
}

export default function ReactionGame({ onClose }: ReactionGameProps) {
    const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'clicked' | 'too-early'>('idle');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const [round, setRound] = useState(0);
    const [totalCoins, setTotalCoins] = useState(0);
    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const { addCoins } = useCurrency();

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const startRound = () => {
        setGameState('waiting');
        setReactionTime(null);

        // Random delay between 1-4 seconds
        const delay = 1000 + Math.random() * 3000;

        timeoutRef.current = setTimeout(() => {
            startTimeRef.current = Date.now();
            setGameState('ready');
        }, delay);
    };

    const handleClick = () => {
        if (gameState === 'waiting') {
            // Clicked too early!
            setGameState('too-early');
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return;
        }

        if (gameState === 'ready') {
            const time = Date.now() - startTimeRef.current;
            setReactionTime(time);
            setGameState('clicked');
            setRound(prev => prev + 1);

            // Update best time
            if (!bestTime || time < bestTime) {
                setBestTime(time);
            }

            // Calculate coins
            let coins = 0;
            if (time < 250) coins = 15;
            else if (time < 350) coins = 12;
            else if (time < 450) coins = 8;
            else coins = 5;

            setTotalCoins(prev => prev + coins);
        }
    };

    const finishGame = () => {
        addCoins(totalCoins);
        onClose();
    };

    const getColorForTime = (time: number) => {
        if (time < 250) return 'text-green-600';
        if (time < 350) return 'text-blue-600';
        if (time < 450) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getMessageForTime = (time: number) => {
        if (time < 250) return 'Lightning fast! ⚡';
        if (time < 350) return 'Great reflexes! 👍';
        if (time < 450) return 'Not bad! 🙂';
        return 'You can do better! 💪';
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
                {/* Header */}
                <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Quick Tap
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Click as fast as you can when the screen turns green!
                </p>

                {/* Stats */}
                <div className="flex justify-around mb-8 text-center">
                    <div>
                        <div className="text-2xl font-bold text-purple-600">{round}</div>
                        <div className="text-sm text-gray-600">Rounds</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">{totalCoins}</div>
                        <div className="text-sm text-gray-600">Coins Earned</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {bestTime ? `${bestTime}ms` : '-'}
                        </div>
                        <div className="text-sm text-gray-600">Best Time</div>
                    </div>
                </div>

                {/* Game Area */}
                <motion.button
                    onClick={handleClick}
                    whileHover={{ scale: gameState === 'idle' ? 1.02 : 1 }}
                    className={`w-full h-96 rounded-3xl flex flex-col items-center justify-center text-white font-bold text-2xl transition-all ${gameState === 'idle' ? 'bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer hover:shadow-xl'
                        : gameState === 'waiting' ? 'bg-red-500 cursor-wait'
                            : gameState === 'ready' ? 'bg-green-500 cursor-pointer animate-pulse'
                                : gameState === 'too-early' ? 'bg-orange-500 cursor-not-allowed'
                                    : 'bg-blue-500 cursor-pointer'
                        }`}
                >
                    {gameState === 'idle' && (
                        <div className="text-center">
                            <div className="text-6xl mb-4">👆</div>
                            <div>Click to Start</div>
                        </div>
                    )}

                    {gameState === 'waiting' && (
                        <div className="text-center">
                            <div className="text-6xl mb-4">⏳</div>
                            <div>Wait for green...</div>
                        </div>
                    )}

                    {gameState === 'ready' && (
                        <div className="text-center animate-bounce">
                            <div className="text-6xl mb-4">👉</div>
                            <div>CLICK NOW!</div>
                        </div>
                    )}

                    {gameState === 'too-early' && (
                        <div className="text-center">
                            <div className="text-6xl mb-4">⏸️</div>
                            <div>Too Early!</div>
                            <div className="text-lg mt-2">Wait for green</div>
                        </div>
                    )}

                    {gameState === 'clicked' && reactionTime && (
                        <div className="text-center">
                            <div className="text-6xl mb-4">⚡</div>
                            <div className={`text-4xl mb-2 ${getColorForTime(reactionTime)}`}>
                                {reactionTime}ms
                            </div>
                            <div className="text-lg">{getMessageForTime(reactionTime)}</div>
                        </div>
                    )}
                </motion.button>

                {/* Controls */}
                <div className="mt-8 flex gap-3 justify-center">
                    {(gameState === 'idle' || gameState === 'clicked' || gameState === 'too-early') && (
                        <button
                            onClick={startRound}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                        >
                            {gameState === 'idle' ? 'Start' : 'Next Round'}
                        </button>
                    )}

                    {round > 0 && gameState !== 'waiting' && gameState !== 'ready' && (
                        <button
                            onClick={finishGame}
                            className="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
                        >
                            Finish & Collect {totalCoins} Coins
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
}
