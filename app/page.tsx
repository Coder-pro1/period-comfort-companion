"use client";

import CharacterSelection from '@/components/CharacterSelection';
import MobileCharacterSelection from '@/components/MobileCharacterSelection';
import PeriodPalChat from '@/components/PeriodPalChat';
import VirtualCarePackage from '@/components/VirtualCarePackage';
import CalmCorner from '@/components/CalmCorner';
import RantJournal from '@/components/RantJournal';
import EasterEggs from '@/components/EasterEggs';
import JokeEngine from '@/components/JokeEngine';

export default function Home() {
    return (
        <main
            className="min-h-screen relative py-8 px-4"
            style={{
                backgroundImage: 'linear-gradient(rgba(168, 74, 126, 0.7), rgba(245, 156, 211, 0.85)), url(/assets/backgrounds/main-bg.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="max-w-7xl mx-auto relative lg:pl-24">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                        Period Comfort Companion
                    </h1>
                    <p className="text-lg md:text-xl text-pink-200 font-medium italic drop-shadow">
                        Your safe space for comfort, care, and understanding 💕
                    </p>
                </header>


                {/* Mobile Character Selection (visible on small screens) */}
                <MobileCharacterSelection />

                {/* Character Selection */}
                <CharacterSelection />

                {/* Games - Fixed Position at Bottom Right */}
                <div className="fixed bottom-6 right-6 z-50">
                    <a
                        href="/games"
                        className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 text-3xl"
                    >
                        🎮
                    </a>
                </div>





                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 mb-8">
                    {/* Left Column - 4/9 of width */}
                    <div className="lg:col-span-4 space-y-6">
                        <JokeEngine />
                        <RantJournal />
                    </div>

                    {/* Right Column - 5/9 of width (wider) */}
                    <div className="lg:col-span-5 space-y-6">
                        <PeriodPalChat />
                        <VirtualCarePackage />
                    </div>
                </div>

                {/* Full Width Section */}
                <div className="mb-8">
                    <CalmCorner />
                </div>

                {/* Footer */}
                <footer className="text-center text-white/90 py-8">
                    <p className="text-lg mb-2">
                        You're doing amazing. We're here for you. 💝
                    </p>
                    <p className="text-sm">
                        Remember: This is temporary. You are strong. You are loved. 🌸
                    </p>
                </footer>

                {/* Easter Eggs */}
                <EasterEggs />
            </div>
        </main>
    );
}
