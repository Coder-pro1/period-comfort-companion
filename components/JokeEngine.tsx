"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComfort } from '@/contexts/ComfortContext';
import Image from 'next/image';

interface ContentItem {
    type: 'joke' | 'affirmation' | 'tip' | 'quote';
    content: string;
    emoji: string;
}

const jokes = [
    { setup: "Why don't periods ever get invited to parties?", punchline: "Because they're always so heavy! 😅", emoji: "🎉" },
    { setup: "What do you call a period that's always on time?", punchline: "A punctual-ation! 📅", emoji: "⏰" },
    { setup: "Why did the tampon go to school?", punchline: "To get more absorb-ucated! 🎓", emoji: "📚" },
    { setup: "What's a period's favorite music?", punchline: "Heavy flow! 🎵", emoji: "🎸" },
    { setup: "Why are periods like pizza?", punchline: "Even when they're bad, they still come monthly! 🍕", emoji: "🍕" },
    { setup: "What do you call a period cramp doing yoga?", punchline: "A twist and shout! 🧘‍♀️", emoji: "🧘" },
    { setup: "Why don't periods ever win at poker?", punchline: "They always show their hand too early! 🃏", emoji: "🎴" },
    { setup: "What's a uterus's favorite exercise?", punchline: "Crunch time! 💪", emoji: "🏋️" }
];

const affirmations = [
    { content: "You are strong, capable, and getting through this like the warrior you are! 💪", emoji: "✨" },
    { content: "Your body is doing amazing things, even when it doesn't feel like it. You're incredible! 🌟", emoji: "💖" },
    { content: "It's okay to rest. It's okay to say no. It's okay to put yourself first. You deserve it! 🛀", emoji: "🌸" },
    { content: "This discomfort is temporary, but your strength is permanent! 💕", emoji: "🦋" },
    { content: "You've survived 100% of your periods so far. You've got this! 🎯", emoji: "🌈" },
    { content: "Be kind to yourself today. You're doing better than you think! 🌺", emoji: "💝" },
    { content: "Your feelings are valid. Your pain is real. And you're handling it beautifully! 🌷", emoji: "🌻" }
];

const tips = [
    { content: "Try a heating pad on your lower back - sometimes that's where the pain hits hardest! 🔥", emoji: "🔥" },
    { content: "Dark chocolate isn't just delicious - it's packed with magnesium that can help with cramps! 🍫", emoji: "🍫" },
    { content: "Gentle stretching or cat-cow yoga poses can help relieve tension and cramps! 🐱", emoji: "🧘‍♀️" },
    { content: "Stay hydrated! Water can help reduce bloating and ease headaches. 💧", emoji: "💧" },
    { content: "A warm bath with Epsom salt can work wonders for muscle relaxation! 🛁", emoji: "🛀" },
    { content: "Peppermint or ginger tea can help with nausea and digestive discomfort! ☕", emoji: "🍵" },
    { content: "Light exercise like a walk can release endorphins - nature's painkillers! 🚶‍♀️", emoji: "🌿" }
];

const quotes = [
    { content: "\"You are braver than you believe, stronger than you seem, and loved more than you know.\" 🐻", emoji: "💫" },
    { content: "\"Tough times don't last, but tough women do!\" 💪", emoji: "👑" },
    { content: "\"She believed she could, so she did - even on her period!\" ✨", emoji: "⭐" },
    { content: "\"A strong woman looks a challenge in the eye and gives it a wink!\" 😉", emoji: "💅" },
    { content: "\"Your vibe attracts your tribe - even when you're crampy!\" 🌈", emoji: "🦄" },
    { content: "\"Be yourself; everyone else is already taken - cramps and all!\" 💕", emoji: "🌺" }
];

export default function JokeEngine() {
    const { selectedCharacter } = useComfort();
    const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
    const [showPunchline, setShowPunchline] = useState(false);
    const [currentJoke, setCurrentJoke] = useState<{ setup: string; punchline: string; emoji: string } | null>(null);

    const getRandomJoke = () => {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setCurrentJoke(randomJoke);
        setCurrentContent(null);
        setShowPunchline(false);
    };

    const revealPunchline = () => {
        setShowPunchline(true);
    };

    const surpriseMe = () => {
        const contentTypes = [
            { type: 'affirmation', items: affirmations },
            { type: 'tip', items: tips },
            { type: 'quote', items: quotes }
        ];

        const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        const randomItem = randomType.items[Math.floor(Math.random() * randomType.items.length)];

        setCurrentContent({
            type: randomType.type as 'affirmation' | 'tip' | 'quote',
            content: randomItem.content,
            emoji: randomItem.emoji
        });
        setCurrentJoke(null);
        setShowPunchline(false);
    };

    const getContentTitle = (type: string) => {
        switch (type) {
            case 'affirmation': return '💖 Affirmation';
            case 'tip': return '💡 Period Tip';
            case 'quote': return '✨ Inspiring Quote';
            default: return '💕 Surprise';
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl comfort-shadow-lg p-6">
            {/* Header with Character Avatar */}
            <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-pink-300 shadow-md">
                    <Image
                        src={`/assets/characters/${selectedCharacter}/avatar-happy.png`}
                        alt={selectedCharacter}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Mood Lifters 🎭
                </h2>
            </div>
            <p className="text-sm text-gray-600 text-center mb-6">
                Need a laugh or some inspiration? We've got you covered! 💕
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6 flex-wrap justify-center">
                <motion.button
                    onClick={getRandomJoke}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                    😂 Tell Me a Joke
                </motion.button>
                <motion.button
                    onClick={surpriseMe}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                    🎁 Surprise Me!
                </motion.button>
            </div>

            {/* Content Display Area */}
            <AnimatePresence mode="wait">
                {currentJoke && (
                    <motion.div
                        key="joke"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200"
                    >
                        <div className="text-center mb-4">
                            <span className="text-4xl mb-3 block">{currentJoke.emoji}</span>
                            <p className="text-lg font-medium text-gray-800 mb-4">
                                {currentJoke.setup}
                            </p>
                        </div>

                        <AnimatePresence>
                            {!showPunchline ? (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={revealPunchline}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                                >
                                    Show Punchline 👀
                                </motion.button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center bg-white rounded-xl p-4 border-2 border-orange-300"
                                >
                                    <p className="text-lg font-bold text-orange-600">
                                        {currentJoke.punchline}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {currentContent && (
                    <motion.div
                        key={currentContent.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`rounded-2xl p-6 border-2 ${currentContent.type === 'affirmation'
                            ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200'
                            : currentContent.type === 'tip'
                                ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
                                : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
                            }`}
                    >
                        <div className="text-center">
                            <span className="text-4xl mb-3 block">{currentContent.emoji}</span>
                            <h3 className="text-lg font-bold mb-3 text-gray-800">
                                {getContentTitle(currentContent.type)}
                            </h3>
                            <p className="text-md text-gray-700 leading-relaxed">
                                {currentContent.content}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {!currentJoke && !currentContent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 px-4"
                >
                    <span className="text-6xl mb-4 block">🎭</span>
                    <p className="text-gray-500 text-sm">
                        Click a button above to brighten your day! ✨
                    </p>
                </motion.div>
            )}
        </div>
    );
}
