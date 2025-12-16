"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useComfort } from '@/contexts/ComfortContext';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'image' | 'voice' | 'combo';
    audioSrc?: string;
}

export default function Gallery() {
    const { purchasedItems, favoriteItems, toggleFavorite } = useCurrency();
    const { selectedCharacter } = useComfort();
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

    // This should match the items in Shop.tsx
    const shopItems: ShopItem[] = [
        // Photos
        { id: 'photo-cartoon', name: 'Cute Cartoon', description: 'A heartwarming photo just for you', price: 100, image: '/assets/shop/photos/first-image.png', category: 'image' },
        { id: 'photo-love', name: 'Love & Support', description: 'Showing love and care', price: 200, image: '/assets/shop/photos/love-support.png', category: 'image' },
        // Voice
        { id: 'voice-morning', name: 'Morning Message', description: 'Sweet good morning', price: 180, image: '/assets/shop/audio-preview.png', category: 'voice', audioSrc: '/assets/shop/audio/morning.mp3' },
        { id: 'voice-comfort', name: 'Comfort Voice', description: 'Soothing words', price: 250, image: '/assets/shop/audio-preview.png', category: 'voice', audioSrc: '/assets/shop/audio/comfort.mp3' },
        { id: 'voice-encouragement', name: 'You Got This!', description: 'Encouraging message', price: 180, image: '/assets/shop/audio-preview.png', category: 'voice', audioSrc: '/assets/shop/audio/encouragement.mp3' },
        { id: 'voice-goodnight', name: 'Goodnight', description: 'Sweet dreams', price: 200, image: '/assets/shop/audio-preview.png', category: 'voice', audioSrc: '/assets/shop/audio/goodnight.mp3' },
        // Bundles
        { id: 'bundle-daily', name: 'Daily Care Bundle', description: 'Photos + voice messages', price: 500, image: '/assets/shop/bundle-daily.png', category: 'combo' },
        { id: 'bundle-premium', name: 'Premium Collection', description: 'All exclusive content', price: 800, image: '/assets/shop/bundle-premium.png', category: 'combo' },
    ];

    const myItems = shopItems.filter(item => purchasedItems.includes(item.id));
    const favorites = myItems.filter(item => favoriteItems.includes(item.id));
    const regularItems = myItems.filter(item => !favoriteItems.includes(item.id));

    const renderBadge = (item: ShopItem) => {
        const isFavorite = favoriteItems.includes(item.id);

        return (
            <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItem(item)}
                className="relative cursor-pointer"
            >
                {/* Badge */}
                <div className={`aspect-square rounded-xl overflow-hidden border-2 ${isFavorite ? 'border-yellow-400' : 'border-green-500'} ${item.category === 'image' ? '' : 'bg-gradient-to-br ' + (isFavorite ? 'from-yellow-100 to-orange-100' : 'from-green-100 to-emerald-100')} flex items-center justify-center`}>
                    {item.category === 'image' ? (
                        // Show actual image preview for image items
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Ctext x="50%%" y="50%%" font-size="60" text-anchor="middle" dy=".3em"%3E📸%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    ) : (
                        // Keep emojis for voice and bundle items
                        <div className="text-3xl">
                            {item.category === 'voice' ? '🎙️' : '🎁'}
                        </div>
                    )}
                </div>
                {/* Favorite/Status Badge */}
                <div className={`absolute -top-1 -right-1 w-5 h-5 ${isFavorite ? 'bg-yellow-500' : 'bg-green-500'} rounded-full flex items-center justify-center text-white text-xs`}>
                    {isFavorite ? '⭐' : '✓'}
                </div>
                {/* Name */}
                <div className="text-xs text-center mt-1 font-semibold text-gray-800 truncate">
                    {item.name}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            {/* Header with Avatar */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 shadow-lg flex-shrink-0">
                    <Image
                        src={`/assets/characters/${selectedCharacter}/preview.png`}
                        alt={selectedCharacter}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Ctext x="50%" y="50%" font-size="32" text-anchor="middle" dy=".3em"%3E🖼️%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        🖼️ My Collection
                    </h2>
                    <p className="text-sm text-gray-600">{myItems.length} items collected</p>
                </div>
            </div>

            {myItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-3">🎁</div>
                    <p className="font-semibold">No items yet!</p>
                    <p className="text-sm">Buy some from the shop →</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Favorites Section */}
                    {favorites.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-yellow-600 mb-3 flex items-center gap-2">
                                <span>⭐</span> Favorites ({favorites.length})
                            </h3>
                            <div className="grid grid-cols-5 gap-3">
                                {favorites.map(renderBadge)}
                            </div>
                        </div>
                    )}

                    {/* Regular Items */}
                    {regularItems.length > 0 && (
                        <div>
                            {favorites.length > 0 && (
                                <h3 className="text-sm font-bold text-gray-600 mb-3">
                                    All Items ({regularItems.length})
                                </h3>
                            )}
                            <div className="grid grid-cols-5 gap-3">
                                {regularItems.map(renderBadge)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal for viewing/playing */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-6 max-w-md w-full"
                        >
                            {/* Image Display */}
                            {selectedItem.category === 'image' && (
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        width={400}
                                        height={400}
                                        className="object-cover w-full h-full"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Ctext x="50%%" y="50%%" font-size="100" text-anchor="middle" dy=".3em"%3E📸%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Audio Player */}
                            {selectedItem.category === 'voice' && (
                                <div className="mb-4">
                                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <div className="text-9xl">🎙️</div>
                                    </div>
                                    {selectedItem.audioSrc && (
                                        <audio controls className="w-full">
                                            <source src={selectedItem.audioSrc} type="audio/mpeg" />
                                            Your browser does not support audio playback.
                                        </audio>
                                    )}
                                </div>
                            )}

                            {/* Bundle Display */}
                            {selectedItem.category === 'combo' && (
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                                    <div className="text-9xl">🎁</div>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedItem.name}</h3>
                            <p className="text-gray-600 mb-4">{selectedItem.description}</p>

                            {/* Favorite Button */}
                            <button
                                onClick={() => toggleFavorite(selectedItem.id)}
                                className={`w-full py-3 rounded-xl font-semibold mb-3 transition-colors ${favoriteItems.includes(selectedItem.id)
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {favoriteItems.includes(selectedItem.id) ? '⭐ Remove from Favorites' : '⭐ Add to Favorites'}
                            </button>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
