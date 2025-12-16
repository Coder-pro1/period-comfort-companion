"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
    coins: number;
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    purchasedItems: string[];
    purchaseItem: (itemId: string) => boolean;
    favoriteItems: string[];
    toggleFavorite: (itemId: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [coins, setCoins] = useState(0);
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
    const [favoriteItems, setFavoriteItems] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('periopal-coins');
        const savedItems = localStorage.getItem('periopal-items');
        const savedFavorites = localStorage.getItem('periopal-favorites');
        if (saved) {
            setCoins(parseInt(saved));
        } else {
            // Start with 0 coins
            setCoins(0);
        }
        if (savedItems) setPurchasedItems(JSON.parse(savedItems));
        if (savedFavorites) setFavoriteItems(JSON.parse(savedFavorites));
    }, []);

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem('periopal-coins', coins.toString());
        localStorage.setItem('periopal-items', JSON.stringify(purchasedItems));
        localStorage.setItem('periopal-favorites', JSON.stringify(favoriteItems));
    }, [coins, purchasedItems, favoriteItems]);

    const addCoins = (amount: number) => {
        setCoins(prev => prev + amount);
    };

    const spendCoins = (amount: number): boolean => {
        if (coins >= amount) {
            setCoins(prev => prev - amount);
            return true;
        }
        return false;
    };

    const purchaseItem = (itemId: string): boolean => {
        if (!purchasedItems.includes(itemId)) {
            setPurchasedItems(prev => [...prev, itemId]);
            return true;
        }
        return false;
    };

    const toggleFavorite = (itemId: string) => {
        setFavoriteItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    return (
        <CurrencyContext.Provider value={{ coins, addCoins, spendCoins, purchasedItems, purchaseItem, favoriteItems, toggleFavorite }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
