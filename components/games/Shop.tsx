"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useComfort } from '@/contexts/ComfortContext';
import Link from 'next/link';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'image' | 'voice' | 'combo';
    audioSrc?: string;
}

export default function Shop() {
    const { coins, spendCoins, purchasedItems, purchaseItem } = useCurrency();
    const { selectedCharacter } = useComfort();
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

    // Shop Items - Add your items here!
    // To add a new item:
    // 1. Upload your image to /public/assets/shop/photos/ or /public/assets/shop/ folder
    // 2. Add a new object to this array following the pattern below
    const shopItems: ShopItem[] = [
        // Photos
        { id: 'photo-cartoon', name: 'Cute Cartoon', description: 'A heartwarming photo just for you', price: 100, image: '/assets/shop/photos/first-image.png', category: 'image' },

        // Voice Messages
        { id: 'voice-korean', name: 'Korean Song', description: 'Soothing Korean melody to relax', price: 300, image: '/assets/shop/audio-preview.png', category: 'voice', audioSrc: '/assets/shop/audio/Korean-song.mp3' },


        // Bundles
        { id: 'bundle-zootopia', name: 'Zootopia Bundle', description: 'Zootopia image + Try Everything song', price: 350, image: '/assets/shop/zootopia.jpg', category: 'combo', audioSrc: '/assets/shop/audio/tryeverything.mp3' },
    ];

    const handlePurchase = (item: ShopItem) => {
        if (purchasedItems.includes(item.id)) {
            alert('You already own this!');
            return;
        }
        if (coins < item.price) {
            alert('Not enough coins!');
            return;
        }
        if (spendCoins(item.price) && purchaseItem(item.id)) {
            alert(`✨ Purchased ${item.name}!\n\nCheck your collection to view it! →`);
            setSelectedItem(null); // Close the modal
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            {/* Header with Avatar */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 shadow-lg flex-shrink-0">
                    <Image
                        src={`/assets/characters/${selectedCharacter}/bf-shop.png`}
                        alt={selectedCharacter}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Ctext x="50%%" y="50%%" font-size="32" text-anchor="middle" dy=".3em"%3E🛍️%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        🛍️ Shop
                    </h2>
                    <p className="text-sm text-gray-600">{shopItems.filter((item: ShopItem) => !purchasedItems.includes(item.id)).length} items available</p>
                </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-5 gap-3">
                {shopItems
                    .filter((item: ShopItem) => !purchasedItems.includes(item.id)) // Only show items not yet purchased
                    .map((item: ShopItem) => {
                        const canAfford = coins >= item.price;

                        return (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedItem(item)}
                                className="relative cursor-pointer"
                            >
                                {/* Locked Badge with Blur Effect */}
                                <div className={`aspect-square rounded-xl overflow-hidden border-2 ${canAfford ? 'border-purple-300' : 'border-gray-300'
                                    } bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative`}>
                                    {/* Lock Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-4xl">🔒</div>
                                    </div>
                                    {/* Blurred Preview */}
                                    <div className="text-3xl opacity-30 blur-sm">
                                        {item.category === 'image' ? '📸' : item.category === 'voice' ? '🎙️' : '🎁'}
                                    </div>
                                </div>

                                {/* Name & Price */}
                                <div className="text-center mt-1">
                                    <div className="text-xs font-semibold text-gray-800 truncate">{item.name}</div>
                                    <div className={`text-xs font-bold ${canAfford ? 'text-yellow-600' : 'text-red-500'}`}>
                                        💰{item.price}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
            </div>

            {/* Empty State when all items are purchased */}
            {shopItems.filter((item: ShopItem) => !purchasedItems.includes(item.id)).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-5xl mb-3">🎉</div>
                    <p className="font-semibold">You own everything!</p>
                    <p className="text-sm">Check your collection →</p>
                </div>
            )}

            {/* Modal */}
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
                            {/* Locked Preview for Images */}
                            {selectedItem.category === 'image' && (
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                                    {/* Blurred Background Image */}
                                    <Image
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        width={400}
                                        height={400}
                                        className="object-cover w-full h-full blur-lg scale-110 opacity-50"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Ctext x="50%%" y="50%%" font-size="100" text-anchor="middle" dy=".3em"%3E📸%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                    {/* Lock Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-6 shadow-2xl">
                                            <div className="text-6xl">🔒</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Locked Preview for Voice */}
                            {selectedItem.category === 'voice' && (
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                                    <div className="text-9xl opacity-30 blur-sm">🎙️</div>
                                    {/* Lock Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-6 shadow-2xl">
                                            <div className="text-6xl">🔒</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Locked Preview for Bundles */}
                            {selectedItem.category === 'combo' && (
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                                    <div className="text-9xl opacity-30 blur-sm">🎁</div>
                                    {/* Lock Icon Overlay */}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="bg-white/90 rounded-full p-6 shadow-2xl">
                                            <div className="text-6xl">🔒</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedItem.name}</h3>
                            <p className="text-gray-600 mb-4">{selectedItem.description}</p>

                            {purchasedItems.includes(selectedItem.id) ? (
                                <div className="bg-green-100 text-green-700 text-center py-3 rounded-xl font-semibold mb-3">
                                    ✓ Already Owned
                                </div>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(selectedItem)}
                                    disabled={coins < selectedItem.price}
                                    className={`w-full py-3 rounded-xl font-semibold mb-3 ${coins >= selectedItem.price
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    💰 Buy for {selectedItem.price} Coins
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
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
