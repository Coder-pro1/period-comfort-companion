"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string; // base64 or URL
    category: 'image' | 'voice' | 'combo';
    audioSrc?: string;
}

export default function ShopAdmin() {
    const [items, setItems] = useState<ShopItem[]>([]);
    const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 100,
        category: 'image' as 'image' | 'voice' | 'combo',
        image: '',
        audioSrc: '',
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const saved = localStorage.getItem('custom-shop-items');
        if (saved) {
            setItems(JSON.parse(saved));
        }
    };

    const saveItems = (newItems: ShopItem[]) => {
        localStorage.setItem('custom-shop-items', JSON.stringify(newItems));
        setItems(newItems);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, audioSrc: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            // Update existing item
            const updatedItems = items.map(item =>
                item.id === editingItem.id
                    ? { ...formData, id: editingItem.id }
                    : item
            );
            saveItems(updatedItems);
        } else {
            // Add new item
            const newItem: ShopItem = {
                ...formData,
                id: `custom-${Date.now()}`,
            };
            saveItems([...items, newItem]);
        }

        resetForm();
    };

    const handleEdit = (item: ShopItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            audioSrc: item.audioSrc || '',
        });
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const updatedItems = items.filter(item => item.id !== id);
            saveItems(updatedItems);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 100,
            category: 'image',
            image: '',
            audioSrc: '',
        });
        setEditingItem(null);
        setShowForm(false);
    };

    const exportItems = () => {
        const dataStr = JSON.stringify(items, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'shop-items.json';
        link.click();
    };

    const importItems = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target?.result as string);
                    saveItems(imported);
                    alert('Items imported successfully!');
                } catch (error) {
                    alert('Error importing items. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            🛍️ Shop Admin
                        </h1>
                        <Link href="/games" className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600">
                            Back to Games
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                            {showForm ? 'Hide Form' : '+ Add New Item'}
                        </button>
                        <button
                            onClick={exportItems}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                        >
                            📥 Export Items
                        </button>
                        <label className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all cursor-pointer">
                            📤 Import Items
                            <input
                                type="file"
                                accept=".json"
                                onChange={importItems}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price (coins)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="image">Image</option>
                                    <option value="voice">Voice</option>
                                    <option value="combo">Combo/Bundle</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                />
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl" />
                                )}
                            </div>

                            {formData.category === 'voice' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload Audio (optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={handleAudioUpload}
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                                >
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Items List */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Custom Items ({items.length})
                    </h2>

                    {items.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No custom items yet. Add your first item!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <div key={item.id} className="border-2 border-gray-200 rounded-2xl p-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-40 object-cover rounded-xl mb-3"
                                    />
                                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-yellow-600 font-bold">💰 {item.price}</span>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="flex-1 px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
