"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useComfort } from '@/contexts/ComfortContext';
import Image from 'next/image';

export default function VirtualCarePackage() {
    const { selectedCharacter } = useComfort();
    const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Handle client-side mounting for portal
    useState(() => {
        setMounted(true);
    });

    const triggerAnimation = (type: string) => {
        setActiveAnimation(type);
        setTimeout(() => setActiveAnimation(null), 3000);
    };

    const animations = {
        hug: {
            emoji: '🫂',
            message: 'Sending you the warmest virtual hug 💕',
            color: 'from-comfort-pink-300 to-comfort-pink-500'
        },
        kiss: {
            emoji: '😘',
            message: 'A gentle forehead kiss for you 💋',
            color: 'from-comfort-red-200 to-comfort-pink-400'
        },
        rub: {
            emoji: '🤗',
            message: 'Soothing tummy rub coming your way 🌸',
            color: 'from-comfort-lavender-300 to-comfort-pink-400'
        }
    };

    const AnimationOverlay = ({ type }: { type: string }) => {
        const config = animations[type as keyof typeof animations];
        const [mediaError, setMediaError] = useState(false);

        // Check if GIF exists, then try video, finally fallback to emoji
        const getMediaPath = () => {
            if (type === 'hug') return `/assets/characters/${selectedCharacter}/hug-animation.gif`;
            if (type === 'kiss') return `/assets/characters/${selectedCharacter}/forehead-animation.gif`;
            if (type === 'rub') return `/assets/characters/${selectedCharacter}/tummy-rub-animation.gif`;
            return null;
        };

        const getVideoPath = () => {
            if (type === 'hug') return `/assets/characters/${selectedCharacter}/hug-animation.mp4`;
            if (type === 'kiss') return `/assets/characters/${selectedCharacter}/forehead-animation.mp4`;
            if (type === 'rub') return `/assets/characters/${selectedCharacter}/tummy-rub-animation.mp4`;
            return null;
        };

        const mediaPath = getMediaPath();
        const videoPath = getVideoPath();

        return createPortal(
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                onClick={() => setActiveAnimation(null)}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`bg-gradient-to-br ${config.color} rounded-3xl p-8 flex flex-col items-center justify-center animate-warm-glow max-w-lg`}
                >
                    {/* Try to show GIF/Video animation, fallback to emoji */}
                    {!mediaError && mediaPath ? (
                        <div className="w-80 h-80 mb-4 relative">
                            <Image
                                src={mediaPath}
                                alt={config.message}
                                width={320}
                                height={320}
                                className="object-contain w-full h-full"
                                unoptimized // Important for GIFs to animate
                                onError={() => {
                                    // Try video if GIF fails
                                    setMediaError(true);
                                }}
                            />
                        </div>
                    ) : !mediaError && videoPath ? (
                        <div className="w-80 h-80 mb-4 relative">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-contain"
                                onError={() => setMediaError(true)}
                            >
                                <source src={videoPath} type="video/mp4" />
                            </video>
                        </div>
                    ) : (
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="text-8xl mb-4"
                        >
                            {config.emoji}
                        </motion.div>
                    )}
                    <p className="text-white text-xl font-medium text-center px-6">
                        {config.message}
                    </p>
                </motion.div>

                {/* Floating hearts */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: window.innerHeight + 50,
                            scale: 0
                        }}
                        animate={{
                            y: -100,
                            scale: 1
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.1,
                            ease: "easeOut"
                        }}
                        className="absolute text-4xl"
                    >
                        💕
                    </motion.div>
                ))}
            </motion.div>,
            document.body
        );
    };

    return (
        <div className="bg-gradient-to-br from-comfort-pink-100 to-comfort-lavender-100 rounded-3xl comfort-shadow p-6">
            {/* Header */}
            <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Virtual Care Package
            </h2>

            <p className="text-center text-gray-600 mb-6">
                Choose your comfort (tap or click)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                    onClick={() => triggerAnimation('hug')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl p-6 comfort-shadow hover:comfort-shadow-lg transition-all"
                >
                    <div className="w-20 h-20 mx-auto mb-2 relative">
                        <Image
                            src={`/assets/characters/${selectedCharacter}/hug.png`}
                            alt="Virtual Hug"
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                            onError={(e) => {
                                // Fallback to emoji if image not found
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    parent.innerHTML = '<div class="text-5xl">🫂</div>';
                                }
                            }}
                        />
                    </div>
                    <div className="font-medium text-gray-700">Virtual Hug</div>
                </motion.button>

                <motion.button
                    onClick={() => triggerAnimation('kiss')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl p-6 comfort-shadow hover:comfort-shadow-lg transition-all"
                >
                    <div className="w-20 h-20 mx-auto mb-2 relative">
                        <Image
                            src={`/assets/characters/${selectedCharacter}/forehead.png`}
                            alt="Forehead Kiss"
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                            onError={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    parent.innerHTML = '<div class="text-5xl">😘</div>';
                                }
                            }}
                        />
                    </div>
                    <div className="font-medium text-gray-700">Forehead Kiss</div>
                </motion.button>

                <motion.button
                    onClick={() => triggerAnimation('rub')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl p-6 comfort-shadow hover:comfort-shadow-lg transition-all"
                >
                    <div className="w-20 h-20 mx-auto mb-2 relative">
                        <Image
                            src={`/assets/characters/${selectedCharacter}/tummy-rub.png`}
                            alt="Tummy Rub"
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                            onError={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    parent.innerHTML = '<div class="text-5xl">🤗</div>';
                                }
                            }}
                        />
                    </div>
                    <div className="font-medium text-gray-700">Tummy Rub</div>
                </motion.button>
            </div>

            {/* Animation Overlay */}
            {mounted && activeAnimation && (
                <AnimationOverlay type={activeAnimation} />
            )}
        </div>
    );
}
