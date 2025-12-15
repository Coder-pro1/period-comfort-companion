"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useComfort } from '@/contexts/ComfortContext';
import Image from 'next/image';

const funTasks = [
    "Rate your current pain level 1-10, but explain it using only food metaphors 🍕",
    "If your uterus could talk, what would it be saying right now? 😤",
    "Describe your ideal 'period day' in exactly 5 words ✨",
    "What's the weirdest thing you've cried about today? (No judgment!) 😭",
    "List 3 things you're grateful for RIGHT NOW (even tiny things!) 💕",
    "If you could tell one person how you really feel today, what would you say? 🗣️",
    "Draw your pain as a doodle (stick figures count!) 🎨",
    "What's your period craving telling you about life? 🍫",
    "Complete: 'Today I give myself permission to...' ✍️",
    "What would make you 5% more comfortable right now? Just 5%! 🌸"
];

export default function RantJournal() {
    const { selectedCharacter } = useComfort();
    const [entry, setEntry] = useState('');
    const [savedEntries, setSavedEntries] = useState<string[]>([]);
    const [currentTask, setCurrentTask] = useState('');

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('period-journal');
        if (saved) {
            setSavedEntries(JSON.parse(saved));
        }
    }, []);

    const saveEntry = () => {
        if (!entry.trim()) return;

        const newEntries = [entry, ...savedEntries];
        setSavedEntries(newEntries);
        localStorage.setItem('period-journal', JSON.stringify(newEntries));
        setEntry('');
    };

    const generateTask = () => {
        const randomTask = funTasks[Math.floor(Math.random() * funTasks.length)];
        setCurrentTask(randomTask);
    };

    const deleteEntry = (index: number) => {
        const newEntries = savedEntries.filter((_, i) => i !== index);
        setSavedEntries(newEntries);
        localStorage.setItem('period-journal', JSON.stringify(newEntries));
    };

    return (
        <div className="bg-gradient-to-br from-comfort-cream-100 to-comfort-pink-50 rounded-3xl comfort-shadow p-6">
            {/* Header with Character Avatar */}
            <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-pink-300 shadow-md">
                    <Image
                        src={`/assets/characters/${selectedCharacter}/bf-encouraging.png`}
                        alt={selectedCharacter}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            // Fallback to happy avatar if encouraging is not available
                            e.currentTarget.src = `/assets/characters/${selectedCharacter}/bf-happy.png`;
                        }}
                    />
                </div>
                <h2 className="text-2xl font-bold text-comfort-pink-500 handwriting">
                    My Rant Journal
                </h2>
            </div>
            <p className="text-center text-gray-600 mb-6 text-sm">
                No filter zone. Write it all out. 📝
            </p>

            {/* Fun Task Generator */}
            <div className="mb-6">
                <motion.button
                    onClick={generateTask}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-comfort-lavender-400 text-white rounded-2xl font-medium comfort-shadow hover:bg-comfort-lavender-500 transition-colors mb-3"
                >
                    Give Me a Fun Task! ✨
                </motion.button>

                {currentTask && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 comfort-shadow handwriting text-lg text-gray-800"
                    >
                        {currentTask}
                    </motion.div>
                )}
            </div>

            {/* Journal Entry */}
            <div className="bg-white rounded-2xl p-4 comfort-shadow mb-4">
                <textarea
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Dear Journal... pour your heart out here 💕"
                    className="w-full h-32 p-3 border-2 border-comfort-pink-200 rounded-xl focus:border-comfort-pink-400 focus:outline-none resize-none handwriting text-lg"
                />
                <motion.button
                    onClick={saveEntry}
                    disabled={!entry.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 w-full px-4 py-2 bg-comfort-pink-400 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save Entry 💾
                </motion.button>
            </div>

            {/* Saved Entries */}
            {savedEntries.length > 0 && (
                <div>
                    <h3 className="font-medium text-gray-700 mb-3">Previous Rants:</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {savedEntries.map((savedEntry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl p-4 comfort-shadow relative group"
                            >
                                <p className="handwriting text-gray-800 pr-8">
                                    {savedEntry}
                                </p>
                                <button
                                    onClick={() => deleteEntry(index)}
                                    className="absolute top-2 right-2 text-comfort-red-400 hover:text-comfort-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    🗑️
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
