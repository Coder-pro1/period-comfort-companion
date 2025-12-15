"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Character types available in the app
export type CharacterType = 'judy' | 'emma' | 'sarah';

// Context interface - only manages character selection
interface ComfortContextType {
    selectedCharacter: CharacterType;
    setSelectedCharacter: (character: CharacterType) => void;
}

// Create the context
const ComfortContext = createContext<ComfortContextType | undefined>(undefined);

// Provider component
export function ComfortProvider({ children }: { children: ReactNode }) {
    const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>('judy');

    return (
        <ComfortContext.Provider value={{ selectedCharacter, setSelectedCharacter }}>
            {children}
        </ComfortContext.Provider>
    );
}

// Custom hook to use the context
export function useComfort() {
    const context = useContext(ComfortContext);
    if (context === undefined) {
        throw new Error('useComfort must be used within a ComfortProvider');
    }
    return context;
}
