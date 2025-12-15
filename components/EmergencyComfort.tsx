"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function EmergencyComfort() {
    const [showSOS, setShowSOS] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [mounted, setMounted] = useState(false);

    useState(() => {
        setMounted(true);
    });

    const groundingTechniques = [
        "🖐️ Name 5 things you can see around you right now",
        "👂 Name 4 things you can hear",
        "🤚 Name 3 things you can touch",
        "👃 Name 2 things you can smell",
        "👅 Name 1 thing you can taste"
    ];

    const reassurances = [
        "This will pass. It always does. You've survived 100% of your worst days. 💕",
        "You are stronger than this pain. Your body is working hard, and you're doing amazing. 🌸",
        "It's okay to not be okay right now. Feel what you need to feel. We're here with you. 🫂",
        "This is temporary. This moment will not last forever. Breathe through it. ✨",
        "You don't have to be strong every second. Rest. Let yourself be held by comfort. 💝"
    ];

    const startBreathingExercise = () => {
        const cycle = () => {
            setBreathingPhase('inhale');
            setTimeout(() => {
                setBreathingPhase('hold');
                setTimeout(() => {
                    setBreathingPhase('exhale');
                    setTimeout(cycle, 4000);
                }, 4000);
            }, 4000);
        };
        cycle();
    };

    const SOSModal = () => {
        useState(startBreathingExercise);

        return createPortal(
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-comfort-cream-50 overflow-y-auto"
            >
                <div className="min-h-screen p-6 md:p-12">
                    {/* Close Button */}
                    <motion.button
                        onClick={() => setShowSOS(false)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="fixed top-6 right-6 w-12 h-12 bg-comfort-pink-400 text-white rounded-full flex items-center justify-center text-2xl comfort-shadow-lg z-10"
                    >
                        ✕
                    </motion.button>

                    {/* Content */}
                    <div className="max-w-3xl mx-auto space-y-8">
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl font-bold text-comfort-pink-500 text-center mb-8"
                        >
                            You're Going to Be Okay 💕
                        </motion.h1>

                        {/* Breathing Exercise */}
                        <div className="bg-white rounded-3xl comfort-shadow-lg p-8 text-center">
                            <h2 className="text-2xl font-bold text-comfort-lavender-500 mb-6">
                                Breathe With Me 🌸
                            </h2>

                            <div className="flex flex-col items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'hold' ? 1.5 : 1,
                                        opacity: breathingPhase === 'hold' ? 0.7 : 1
                                    }}
                                    transition={{ duration: 4, ease: "easeInOut" }}
                                    className="w-32 h-32 rounded-full bg-gradient-to-br from-comfort-lavender-300 to-comfort-pink-300 mb-6"
                                />

                                <motion.p
                                    key={breathingPhase}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-2xl font-medium text-comfort-cream-800"
                                >
                                    {breathingPhase === 'inhale' && '💨 Breathe In (4 seconds)'}
                                    {breathingPhase === 'hold' && '⏸️ Hold (4 seconds)'}
                                    {breathingPhase === 'exhale' && '💨 Breathe Out (4 seconds)'}
                                </motion.p>
                            </div>
                        </div>

                        {/* Grounding Techniques */}
                        <div className="bg-gradient-to-br from-comfort-pink-50 to-comfort-lavender-50 rounded-3xl comfort-shadow p-6">
                            <h2 className="text-2xl font-bold text-comfort-pink-500 mb-4 text-center">
                                Grounding Technique (5-4-3-2-1)
                            </h2>
                            <div className="space-y-3">
                                {groundingTechniques.map((technique, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl p-4 text-comfort-cream-800"
                                    >
                                        {technique}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Reassurances */}
                        <div className="bg-white rounded-3xl comfort-shadow p-6">
                            <h2 className="text-2xl font-bold text-comfort-pink-500 mb-4 text-center">
                                Remember This 💝
                            </h2>
                            <div className="space-y-4">
                                {reassurances.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.15 }}
                                        className="text-center text-lg text-comfort-cream-800 leading-relaxed p-4 bg-comfort-cream-50 rounded-xl"
                                    >
                                        {message}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>,
            document.body
        );
    };

    return (
        <>
            <motion.button
                onClick={() => setShowSOS(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full font-bold text-sm comfort-shadow-lg hover:shadow-2xl transition-all flex items-center justify-center"
                title="Emergency SOS"
            >
                🆘
            </motion.button>

            <AnimatePresence>
                {mounted && showSOS && <SOSModal />}
            </AnimatePresence>
        </>
    );
}
