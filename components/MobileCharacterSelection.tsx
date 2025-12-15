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

export default function MobileCharacterSelection() {
    const { selectedCharacter, setSelectedCharacter } = useComfort();

    return (
        <div className="lg:hidden mb-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <p className="text-white text-sm text-center mb-3 font-medium">Choose Your Character:</p>
            <div className="flex gap-3 justify-center">
                {characters.map((character) => (
                    <motion.button
                        key={character.id}
                        onClick={() => setSelectedCharacter(character.id)}
                        className={`
                            relative w-16 h-16 rounded-xl transition-all
                            ${selectedCharacter === character.id
                                ? `bg-gradient-to-br ${character.color} shadow-xl scale-105`
                                : 'bg-white/30 backdrop-blur-sm shadow-md hover:bg-white/40 hover:scale-105'}
                        `}
                        whileHover={{ scale: selectedCharacter === character.id ? 1.05 : 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex flex-col items-center justify-center h-full p-1">
                            {/* Character preview image */}
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 mb-0.5 relative">
                                <Image
                                    src={`/assets/characters/${character.id}/preview.png`}
                                    alt={character.name}
                                    width={40}
                                    height={40}
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
                                <div className="emoji-placeholder absolute inset-0 hidden items-center justify-center text-lg bg-gradient-to-br from-pink-200 to-purple-200 rounded-full">
                                    {character.id === 'judy' && '👧'}
                                    {character.id === 'kanao' && '👩'}
                                    {character.id === 'vani' && '🧑‍🦰'}
                                </div>
                            </div>

                            {/* Character name */}
                            <span className={`text-[10px] font-bold ${selectedCharacter === character.id ? 'text-white' : 'text-white/90'
                                }`}>
                                {character.name}
                            </span>
                        </div>

                        {/* Selection indicator */}
                        {selectedCharacter === character.id && (
                            <motion.div
                                layoutId="mobileSelectedCharacterIndicator"
                                className="absolute inset-0 border-2 border-white rounded-xl"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
