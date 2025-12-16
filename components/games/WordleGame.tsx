"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';

interface WordleGameProps {
    onClose: () => void;
}

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

interface Letter {
    char: string;
    state: LetterState;
}

export default function WordleGame({ onClose }: WordleGameProps) {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState<Letter[][]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'won' | 'lost'>('loading');
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 6;
    const { addCoins } = useCurrency();

    useEffect(() => {
        startNewGame();
    }, []);

    // Add physical keyboard support
    useEffect(() => {
        const handlePhysicalKeyboard = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;

            if (e.key === 'Enter') {
                handleKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                handleKeyPress('BACK');
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                handleKeyPress(e.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handlePhysicalKeyboard);
        return () => window.removeEventListener('keydown', handlePhysicalKeyboard);
    }, [gameState, currentGuess, targetWord, guesses, attempts]); // Dependencies for handleKeyPress


    const startNewGame = async () => {
        setGameState('loading');
        try {
            const response = await fetch('/api/games/wordle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'new' }),
            });
            const data = await response.json();
            if (data.word) {
                setTargetWord(data.word.toUpperCase());
                setGuesses([]);
                setCurrentGuess('');
                setAttempts(0);
                setGameState('playing');
            }
        } catch (error) {
            console.error('Error starting wordle:', error);
        }
    };

    const checkGuess = () => {
        if (currentGuess.length !== 5) return;

        const guess = currentGuess.toUpperCase();
        const target = targetWord.toUpperCase();
        const result: Letter[] = [];
        const targetChars = target.split('');
        const guessChars = guess.split('');

        // First pass: mark correct positions
        guessChars.forEach((char, i) => {
            if (char === targetChars[i]) {
                result[i] = { char, state: 'correct' };
                targetChars[i] = '';
            }
        });

        // Second pass: mark present and absent
        guessChars.forEach((char, i) => {
            if (result[i]) return; // Already marked as correct

            const index = targetChars.indexOf(char);
            if (index !== -1) {
                result[i] = { char, state: 'present' };
                targetChars[index] = '';
            } else {
                result[i] = { char, state: 'absent' };
            }
        });

        const newGuesses = [...guesses, result];
        setGuesses(newGuesses);
        setAttempts(attempts + 1);

        // Check win condition
        if (guess === target) {
            const coinsEarned = 75 + (6 - (attempts + 1)) * 25; // More coins for fewer attempts
            addCoins(coinsEarned);
            setTimeout(() => setGameState('won'), 500);
        } else if (attempts + 1 >= maxAttempts) {
            addCoins(10); // Participation reward for trying
            setTimeout(() => setGameState('lost'), 500);
        }

        setCurrentGuess('');
    };

    const handleKeyPress = (key: string) => {
        if (gameState !== 'playing') return;

        if (key === 'ENTER') {
            checkGuess();
        } else if (key === 'BACK') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
            setCurrentGuess(prev => prev + key);
        }
    };

    const getLetterColor = (state: LetterState) => {
        switch (state) {
            case 'correct': return 'bg-green-500 text-white border-green-500';
            case 'present': return 'bg-yellow-500 text-white border-yellow-500';
            case 'absent': return 'bg-gray-400 text-white border-gray-400';
            default: return 'bg-white border-gray-300';
        }
    };

    const keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
    ];

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-xl">
                {/* Header */}
                <h2 className="text-xl md:text-3xl font-bold text-center mb-3 md:mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Wordle
                </h2>

                {gameState === 'loading' && (
                    <div className="text-center py-20 text-gray-600">
                        Loading word...
                    </div>
                )}

                {gameState !== 'loading' && (
                    <>
                        {/* Game Grid */}
                        <div className="mb-4 md:mb-8">
                            {[...Array(maxAttempts)].map((_, rowIndex) => (
                                <div key={rowIndex} className="flex gap-1 md:gap-2 justify-center mb-1 md:mb-2">
                                    {[...Array(5)].map((_, colIndex) => {
                                        const letter = guesses[rowIndex]?.[colIndex];
                                        const isCurrentRow = rowIndex === attempts && gameState === 'playing';
                                        const currentChar = isCurrentRow ? currentGuess[colIndex] : '';

                                        return (
                                            <motion.div
                                                key={colIndex}
                                                initial={letter ? { rotateX: 0 } : {}}
                                                animate={letter ? { rotateX: 360 } : {}}
                                                transition={{ duration: 0.6, delay: colIndex * 0.1 }}
                                                className={`w-10 h-10 md:w-14 md:h-14 border-2 rounded-lg flex items-center justify-center text-lg md:text-2xl font-bold ${letter ? getLetterColor(letter.state) : currentChar ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
                                                    }`}
                                            >
                                                {letter?.char || currentChar}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>


                        {/* Virtual Keyboard - Hidden on mobile, visible on desktop */}
                        {gameState === 'playing' && (
                            <>
                                {/* Mobile instruction */}
                                <div className="md:hidden text-center text-sm text-gray-600 mb-4">
                                    Use your phone keyboard to type
                                </div>

                                {/* Virtual Keyboard - Hidden on mobile */}
                                <div className="hidden md:block space-y-2">
                                    {keyboard.map((row, i) => (
                                        <div key={i} className="flex gap-1 justify-center">
                                            {row.map((key) => (
                                                <button
                                                    key={key}
                                                    onClick={() => handleKeyPress(key)}
                                                    className={`${key.length > 1 ? 'px-2 md:px-4' : 'px-2 md:px-3'
                                                        } py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm bg-gray-200 hover:bg-gray-300 transition-colors`}
                                                >
                                                    {key === 'BACK' ? '⌫' : key}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Game Over Messages */}
                        {gameState === 'won' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-center mt-6 space-y-4"
                            >
                                <div className="text-4xl">🎉</div>
                                <div className="text-2xl font-bold text-green-600">You Won!</div>
                                <div className="text-lg text-gray-600">
                                    You earned {75 + (6 - attempts) * 25} coins!
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={startNewGame}
                                        className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        Play Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                                    >
                                        Back to Games
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'lost' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-center mt-6 space-y-4"
                            >
                                <div className="text-4xl">😔</div>
                                <div className="text-2xl font-bold text-red-600">Game Over!</div>
                                <div className="text-lg text-gray-600">
                                    The word was: <span className="font-bold">{targetWord}</span>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={startNewGame}
                                        className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                                    >
                                        Back to Games
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
