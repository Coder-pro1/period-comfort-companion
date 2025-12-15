"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useComfort } from '@/contexts/ComfortContext';
import Image from 'next/image';

const calmTracks = [
    {
        title: 'Cozy Lo-fi Beats',
        id: 'jfKfPfyJRdk',
        description: 'Chill vibes for relaxation 🎵'
    },
    {
        title: 'Rain Sounds',
        id: 'mPZkdNFkNps',
        description: 'Gentle rain for peaceful moments 🌧️'
    },
    {
        title: 'Brown Noise',
        id: 'RqzGzwTY-6w',
        description: 'Deep sound for headache relief 🎧'
    },
    {
        title: 'Peaceful Piano',
        id: '3V3cNEtwWZ4',
        description: 'Soft melodies to soothe'
    }
];

export default function CalmCorner() {
    const { selectedCharacter } = useComfort();
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-3xl comfort-shadow p-6">
            {/* Header with Character Avatar */}
            <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-lavender-300 shadow-md">
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Calm Corner
                </h2>
            </div>

            <p className="text-center text-gray-600 mb-6">
                Soothing sounds to help you relax
            </p>

            {/* Track Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {calmTracks.map((track) => (
                    <motion.button
                        key={track.id}
                        onClick={() => setSelectedTrack(track.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
              p-4 rounded-xl transition-all text-left
              ${selectedTrack === track.id
                                ? 'bg-comfort-lavender-400 text-white ring-4 ring-comfort-lavender-300'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
            `}
                    >
                        <div className="font-medium text-sm mb-1">{track.title}</div>
                        <div className="text-xs opacity-80">{track.description}</div>
                    </motion.button>
                ))}
            </div>

            {/* YouTube Player */}
            {selectedTrack && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden comfort-shadow-lg"
                >
                    <div className="relative pb-[56.25%] h-0">
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedTrack}?autoplay=1`}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </motion.div>
            )}

            {!selectedTrack && (
                <div className="text-center text-gray-500 py-8">
                    Select a track above to start playing 🎧
                </div>
            )}
        </div>
    );
}
