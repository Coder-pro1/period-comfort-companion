"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useComfort } from '@/contexts/ComfortContext';
import Image from 'next/image';

export default function ComfortStats() {
    const { selectedCharacter } = useComfort();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const getTimeOfDayMessage = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return { text: "Good Morning! ☀️", emoji: "🌅" };
        if (hour < 17) return { text: "Good Afternoon! 🌤️", emoji: "☀️" };
        if (hour < 21) return { text: "Good Evening! 🌆", emoji: "🌙" };
        return { text: "Good Night! 🌙", emoji: "✨" };
    };

    const affirmations = [
        "You're doing great! 💕",
        "You're stronger than you think! 💪",
        "Be kind to yourself today! 🌸",
        "You deserve comfort! 💝",
        "You're amazing! ✨",
        "Rest when you need to! 🌺"
    ];

    const [dailyAffirmation] = useState(
        affirmations[Math.floor(Math.random() * affirmations.length)]
    );

    const timeMessage = getTimeOfDayMessage();

    return (
        <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4 w-20">
            {/* Time of Day Greeting */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg"
            >
                <div className="text-4xl mb-2">{timeMessage.emoji}</div>
                <div className="text-white text-[10px] font-medium leading-tight">
                    {timeMessage.text.split(' ')[0]}
                    <br />
                    {timeMessage.text.split(' ')[1]}
                </div>
            </motion.div>

            {/* Character Avatar with Daily Affirmation */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-pink-400/30 to-purple-400/30 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg relative group"
                whileHover={{ scale: 1.05 }}
            >
                <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-white/50 shadow-md mx-auto mb-2">
                    <Image
                        src={`/assets/characters/${selectedCharacter}/bf-happy.png`}
                        alt="Companion"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>

                {/* Tooltip on hover */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity w-48 pointer-events-none">
                    <p className="text-sm text-gray-800 font-medium text-center">
                        {dailyAffirmation}
                    </p>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-3 h-3 bg-white"></div>
                </div>
            </motion.div>

            {/* Quick Stats / Comfort Level */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg"
            >
                <div className="text-2xl mb-1">💝</div>
                <div className="text-white text-[10px] font-medium">
                    Self Care
                </div>
            </motion.div>

            {/* Motivation Badge */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-400/30 to-orange-400/30 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            >
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-white text-[10px] font-medium">
                    You're
                    <br />
                    Amazing
                </div>
            </motion.div>

            {/* Breathing Reminder */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-blue-400/30 to-cyan-400/30 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-2xl mb-1"
                >
                    🫁
                </motion.div>
                <div className="text-white text-[10px] font-medium">
                    Breathe
                </div>
            </motion.div>
        </div>
    );
}
