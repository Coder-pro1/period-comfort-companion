"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const couples = [
    {
        id: 1,
        name: 'Couple 1',
        description: 'Classic Romance',
        // Images will be at: /assets/avatars/couple1/girl-*.png and boy-*.png
    },
    {
        id: 2,
        name: 'Couple 2',
        description: 'Modern Love',
        // Images will be at: /assets/avatars/couple2/girl-*.png and boy-*.png
    },
    {
        id: 3,
        name: 'Couple 3',
        description: 'Adorable Pair',
        // Images will be at: /assets/avatars/couple3/girl-*.png and boy-*.png
    },
];

interface CoupleSelectionProps {
    onSelectCouple: (coupleId: number) => void;
    selectedCouple: number;
}

export default function CoupleSelection({ onSelectCouple, selectedCouple }: CoupleSelectionProps) {
    return (
        <div className="bg-white rounded-2xl p-4 comfort-shadow mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                Choose Your Avatars
            </h3>
            <div className="flex gap-3 justify-center">
                {couples.map((couple) => (
                    <motion.button
                        key={couple.id}
                        onClick={() => onSelectCouple(couple.id)}
                        className={`
                            px-4 py-2 rounded-lg transition-all
                            ${selectedCouple === couple.id
                                ? 'bg-gradient-to-br from-pink-400 to-purple-400 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="text-xs font-medium">{couple.name}</div>
                        <div className="text-xs opacity-75">{couple.description}</div>
                    </motion.button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                Upload couple images to /public/assets/avatars/couple{selectedCouple}/
            </p>
        </div>
    );
}
