"use client";

import { useComfort, CharacterType } from '@/contexts/ComfortContext';
import { motion } from 'framer-motion';
import Image from 'next/image';

const characters = [
    {
        id: 'judy' as CharacterType,
        name: 'Judy',
        color: 'from-pink-400 to-rose-400',
    },
    {
        id: 'kanao' as CharacterType,
        name: 'Kanao',
        color: 'from-purple-400 to-indigo-400',
    },
    {
        id: 'vani' as CharacterType,
        name: 'Vani',
        color: 'from-blue-400 to-cyan-400',
    },
];

export default function CharacterSelection() {
    const { selectedCharacter, setSelectedCharacter } = useComfort();

    return (
        <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
            {characters.map((character) => (
                <motion.button
                    key={character.id}
                    onClick={() => setSelectedCharacter(character.id)}
                    className={`
                        relative w-20 h-20 rounded-2xl transition-all
                        ${selectedCharacter === character.id
                            ? `bg-gradient-to-br ${character.color} shadow-2xl scale-110`
                            : 'bg-white/20 backdrop-blur-sm shadow-lg hover:bg-white/30 hover:scale-105'}
                    `}
                    whileHover={{ scale: selectedCharacter === character.id ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="flex flex-col items-center justify-center h-full p-2">
                        {/* Character preview image */}
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 mb-1 relative">
                            <Image
                                src={`/assets/characters/${character.id}/preview.png`}
                                alt={character.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full relative z-10"
                                onError={(e) => {
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        const placeholder = parent.querySelector('.emoji-placeholder');
                                        if (placeholder) {
                                            (placeholder as HTMLElement).style.display = 'flex';
                                        }
                                    }
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            {/* Emoji fallback */}
                            <div className="emoji-placeholder absolute inset-0 hidden items-center justify-center text-2xl bg-gradient-to-br from-pink-200 to-purple-200 rounded-full">
                                {character.id === 'judy' && '👧'}
                                {character.id === 'kanao' && '👩'}
                                {character.id === 'vani' && '🧑‍🦰'}
                            </div>
                        </div>

                        {/* Character name */}
                        <span className={`text-xs font-bold ${selectedCharacter === character.id ? 'text-white' : 'text-white/80'
                            }`}>
                            {character.name}
                        </span>
                    </div>

                    {/* Selection indicator */}
                    {selectedCharacter === character.id && (
                        <motion.div
                            layoutId="selectedCharacterIndicator"
                            className="absolute inset-0 border-3 border-white rounded-2xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </motion.button>
            ))}
        </div>
    );
}
