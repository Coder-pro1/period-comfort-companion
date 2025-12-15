"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EasterEggs() {
    const [chocolateClicks, setChocolateClicks] = useState(0);
    const [showChocolateRain, setShowChocolateRain] = useState(false);
    const [chocolates, setChocolates] = useState<number[]>([]);

    const handleChocolateClick = () => {
        setChocolateClicks(prev => prev + 1);

        if (chocolateClicks + 1 === 5) {
            setShowChocolateRain(true);
            setChocolates(Array.from({ length: 30 }, (_, i) => i));
            setTimeout(() => {
                setShowChocolateRain(false);
                setChocolateClicks(0);
            }, 4000);
        }
    };

    return (
        <>
            {/* Chocolate Icon (Easter Egg Trigger) */}
            <motion.button
                onClick={handleChocolateClick}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 w-16 h-16 bg-comfort-cream-400 rounded-full flex items-center justify-center text-3xl comfort-shadow-lg z-20"
                title="Click me 5 times... 😉"
            >
                🍫
            </motion.button>

            {/* Chocolate Rain Animation */}
            <AnimatePresence>
                {showChocolateRain && (
                    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                        {chocolates.map((id) => (
                            <motion.div
                                key={id}
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: -50,
                                    rotate: 0,
                                    opacity: 1
                                }}
                                animate={{
                                    y: window.innerHeight + 50,
                                    rotate: 360,
                                    opacity: 0
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    delay: Math.random() * 0.5,
                                    ease: "linear"
                                }}
                                className="absolute text-4xl"
                                style={{
                                    left: Math.random() * 100 + '%'
                                }}
                            >
                                🍫
                            </motion.div>
                        ))}

                        {/* Message */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="bg-comfort-cream-400 text-white px-8 py-6 rounded-3xl comfort-shadow-lg text-center">
                                <p className="text-3xl font-bold mb-2">🍫 CHOCOLATE RAIN! 🍫</p>
                                <p className="text-xl">You found the secret! You deserve ALL the chocolate! 💕</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Click Counter Hint */}
            {chocolateClicks > 0 && chocolateClicks < 5 && !showChocolateRain && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="fixed bottom-24 right-6 bg-comfort-pink-400 text-white px-4 py-2 rounded-full text-sm z-20"
                >
                    {chocolateClicks}/5 clicks... keep going! ✨
                </motion.div>
            )}
        </>
    );
}
