"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useComfort } from '@/contexts/ComfortContext';
import GuessingGame from '@/components/games/GuessingGame';
import WordleGame from '@/components/games/WordleGame';
import MemoryMatch from '@/components/games/MemoryMatch';
import ReactionGame from '@/components/games/ReactionGame';
import Shop from '@/components/games/Shop';
import Gallery from '@/components/games/Gallery';
import Link from 'next/link';

type GameType = 'guessing' | 'wordle' | 'memory' | 'reaction' | 'shop' | 'gallery' | null;

export default function GamesPage() {
    const [activeGame, setActiveGame] = useState<GameType>(null);
    const { coins } = useCurrency();
    const { selectedCharacter } = useComfort();

    const games = [
        {
            id: 'guessing' as GameType,
            name: 'Guessing Game',
            description: 'Play 20 questions with me!',
            image: `/assets/characters/${selectedCharacter}/guessing.png`,
            reward: '50-100 coins',
        },
        {
            id: 'wordle' as GameType,
            name: 'Wordle',
            description: 'Guess the 5-letter word',
            image: `/assets/characters/${selectedCharacter}/wordle.png`,
            reward: '75-150 coins',
        },
        {
            id: 'memory' as GameType,
            name: 'Memory Match',
            description: 'Match the comfort pairs!',
            image: `/assets/characters/${selectedCharacter}/matching.png`,
            reward: '40-80 coins',
        },
        {
            id: 'reaction' as GameType,
            name: 'Quick Tap',
            description: 'Test your reaction time',
            image: `/assets/characters/${selectedCharacter}/tap.png`,
            reward: '5-15 coins',
        },
    ];

    return (
        <main
            className="min-h-screen p-4 md:p-8"
            style={{
                backgroundImage: 'linear-gradient(rgba(168, 74, 126, 0.7), rgba(245, 156, 211, 0.85)), url(/assets/backgrounds/main-bg.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4 md:mb-8">
                    <Link href="/" className="px-3 py-2 md:px-6 md:py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all text-gray-800 font-semibold text-sm md:text-base">
                        ← Back
                    </Link>

                    {/* Coin Display */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-2 md:px-6 md:py-3 rounded-full shadow-lg font-bold text-sm md:text-lg"
                    >
                        💰 {coins}
                    </motion.div>
                </div>

                {/* Page Title */}
                <div className="text-center mb-6 md:mb-12">
                    <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-4">
                        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-2xl flex-shrink-0">
                            <img
                                src={`/assets/characters/${selectedCharacter}/games.png`}
                                alt="Judy Games"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Ctext x="50%%" y="50%%" font-size="40" text-anchor="middle" dy=".3em"%3E🎮%3C/text%3E%3C/svg%3E';
                                }}
                            />
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                            Games & Rewards
                        </h1>
                    </div>
                    <p className="text-sm md:text-lg text-pink-100 drop-shadow px-4">
                        Play games, earn coins, and unlock special items!
                    </p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    {games.map((game) => (
                        <motion.button
                            key={game.id}
                            onClick={() => setActiveGame(game.id)}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-lg hover:shadow-xl transition-all text-center"
                        >
                            <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 md:mb-4 rounded-xl md:rounded-2xl overflow-hidden">
                                <img
                                    src={game.image}
                                    alt={game.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Ctext x="50%" y="50%" font-size="48" text-anchor="middle" dy=".3em"%3E🎮%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                            <h3 className="text-sm md:text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-1 md:mb-2">{game.name}</h3>
                            <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">{game.description}</p>
                            <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs md:text-sm font-semibold px-2 py-1 md:px-4 md:py-2 rounded-full">
                                {game.reward}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Shop & Gallery Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Shop */}
                    <Shop />

                    {/* Gallery */}
                    <Gallery />
                </div>
            </div>

            {/* Game Modal */}
            <AnimatePresence>
                {activeGame && activeGame !== 'shop' && activeGame !== 'gallery' && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4 overflow-y-auto"
                        onClick={() => setActiveGame(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-4xl my-4 md:my-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <div className="flex justify-end mb-2 md:mb-4">
                                <button
                                    onClick={() => setActiveGame(null)}
                                    className="px-4 py-2 md:px-6 md:py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all text-gray-800 font-semibold text-sm md:text-base"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {/* Game Container */}
                            <div
                                className="rounded-2xl md:rounded-3xl shadow-2xl p-3 md:p-6 max-h-[85vh] overflow-y-auto relative"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(168, 74, 126, 0.85), rgba(245, 156, 211, 0.9)), url(/assets/backgrounds/main-bg.jpeg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* Inner container with semi-transparent background for readability */}
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl p-2 md:p-4">
                                    {activeGame === 'guessing' && <GuessingGame onClose={() => setActiveGame(null)} />}
                                    {activeGame === 'wordle' && <WordleGame onClose={() => setActiveGame(null)} />}
                                    {activeGame === 'memory' && <MemoryMatch onClose={() => setActiveGame(null)} />}
                                    {activeGame === 'reaction' && <ReactionGame onClose={() => setActiveGame(null)} />}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
