"use client";

import { useState, useRef, useEffect } from 'react';
import { useComfort } from '@/contexts/ComfortContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Detect caring/sympathetic mood from AI response with 5 different expressions
function detectAssistantMood(message: string): 'happy' | 'sad' | 'concerned' | 'loving' | 'encouraging' {
    const lowerMsg = message.toLowerCase();

    // Concerned - worried, protective, caring about pain/problems
    if (lowerMsg.includes('are you okay') || lowerMsg.includes('worried') ||
        lowerMsg.includes('take care') || lowerMsg.includes('please') ||
        lowerMsg.includes('should you') || lowerMsg.includes('make sure') ||
        lowerMsg.includes('be careful') || lowerMsg.includes('rest') ||
        lowerMsg.includes('don\'t push yourself')) {
        return 'concerned';
    }

    // Sad/empathetic - deeply understanding, compassionate
    if (lowerMsg.includes('sorry') || lowerMsg.includes('understand') ||
        lowerMsg.includes('tough') || lowerMsg.includes('hard') ||
        lowerMsg.includes('difficult') || lowerMsg.includes('pain') ||
        lowerMsg.includes('struggle') || lowerMsg.includes('rough') ||
        lowerMsg.includes('overwhelm') || lowerMsg.includes('here for you') ||
        lowerMsg.includes('i hear you') || lowerMsg.includes('that sounds')) {
        return 'sad';
    }

    // Loving - affectionate, sweet, romantic
    if (lowerMsg.includes('love') || lowerMsg.includes('care about') ||
        lowerMsg.includes('special') || lowerMsg.includes('amazing') ||
        lowerMsg.includes('beautiful') || lowerMsg.includes('appreciate') ||
        lowerMsg.includes('mean everything') || lowerMsg.includes('treasure') ||
        lowerMsg.includes('adore') || lowerMsg.includes('my heart')) {
        return 'loving';
    }

    // Encouraging - motivating, uplifting, confident
    if (lowerMsg.includes('you can') || lowerMsg.includes('you\'re strong') ||
        lowerMsg.includes('keep going') || lowerMsg.includes('you got this') ||
        lowerMsg.includes('believe in') || lowerMsg.includes('proud') ||
        lowerMsg.includes('doing great') || lowerMsg.includes('awesome') ||
        lowerMsg.includes('you\'re capable') || lowerMsg.includes('champion')) {
        return 'encouraging';
    }

    // Happy - default supportive, cheerful, positive
    return 'happy';
}

// Detect user message sentiment to show appropriate avatar
function detectUserMessageMood(message: string): 'happy' | 'sad' | 'angry' | 'tired' {
    const lowerMsg = message.toLowerCase();

    // Check for sad/depressed indicators
    if (lowerMsg.includes('sad') || lowerMsg.includes('cry') ||
        lowerMsg.includes('depressed') || lowerMsg.includes('hurt') ||
        lowerMsg.includes('lonely') || lowerMsg.includes('miss') ||
        lowerMsg.includes('heartbroken') || lowerMsg.includes('down') ||
        lowerMsg.includes('upset') || lowerMsg.includes('miserable')) {
        return 'sad';
    }

    // Check for angry indicators
    if (lowerMsg.includes('angry') || lowerMsg.includes('mad') ||
        lowerMsg.includes('furious') || lowerMsg.includes('annoyed') ||
        lowerMsg.includes('frustrated') || lowerMsg.includes('irritated') ||
        lowerMsg.includes('hate') || lowerMsg.includes('pissed')) {
        return 'angry';
    }

    // Check for tired indicators
    if (lowerMsg.includes('tired') || lowerMsg.includes('exhausted') ||
        lowerMsg.includes('sleepy') || lowerMsg.includes('fatigue') ||
        lowerMsg.includes('drained') || lowerMsg.includes('worn out') ||
        lowerMsg.includes('can\'t sleep') || lowerMsg.includes('insomnia')) {
        return 'tired';
    }

    // Default to happy for neutral or positive messages
    return 'happy';
}

// Get mood-specific initial greeting message
function getInitialGreeting(mood: 'happy' | 'sad' | 'angry' | 'tired' | 'cramps' | 'emotional'): string {
    const greetings = {
        happy: 'Hey love! 💕 I\'m so glad you\'re here! How can I brighten your day even more?',
        sad: 'Hey sweetheart 💙 I can see you\'re feeling down. I\'m here for you, and we\'ll get through this together. Want to talk about it?',
        angry: 'Hey babe 💗 I can sense you\'re feeling frustrated. That\'s totally valid! Let it all out - I\'m here to listen and support you.',
        tired: 'Hey love 😴 You sound exhausted... Let\'s take it easy together. How about we find some ways to help you rest and recharge?',
        cramps: 'Oh sweetheart 🤕 Cramps are the worst! I\'m here to help you feel better. Want some comfort tips or just want to vent?',
        emotional: 'Hey beautiful 💕 Feeling all the feels today? That\'s completely okay. I\'m right here with you through every emotion.'
    };
    return greetings[mood];
}

export default function PeriodPalChat() {
    const { selectedCharacter } = useComfort();
    const [currentMood, setCurrentMood] = useState<'happy' | 'sad' | 'angry' | 'tired' | 'cramps' | 'emotional'>('happy');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: getInitialGreeting('happy') }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Removed auto-scroll - users can manually scroll if needed

    // Update initial message when mood changes
    useEffect(() => {
        setMessages([
            { role: 'assistant', content: getInitialGreeting(currentMood) }
        ]);
    }, [currentMood]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        console.log('=== Sending message ===');
        console.log('Current mood:', currentMood);
        console.log('User message:', userMessage);

        // Special check for "I love u" (case-insensitive)
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('i love you') || lowerMsg.includes('i love u') || lowerMsg.includes('luv u')) {
            // Simulate typing delay for natural feel
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'I love you moree! 💕'
                }]);
                setIsLoading(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, mood: currentMood }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.error) {
                console.error('API Error:', data.error);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `I'm having trouble responding right now. But I'm still here for you! (Error: ${data.error})`
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection hiccup! Want to try again?'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl comfort-shadow-lg p-6 h-[600px] flex flex-col">
            <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Chat with Your Companion 💕
            </h2>

            {/* Integrated Mood Selector */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs text-gray-600 mb-2 text-center">How are you feeling?</p>
                <div className="flex gap-2 flex-wrap justify-center">
                    {[
                        { id: 'happy', emoji: '😊', label: 'Happy' },
                        { id: 'sad', emoji: '😢', label: 'Sad' },
                        { id: 'angry', emoji: '😤', label: 'Angry' },
                        { id: 'tired', emoji: '😴', label: 'Tired' },
                        { id: 'cramps', emoji: '🤕', label: 'Cramps' },
                        { id: 'emotional', emoji: '💗', label: 'Emotional' },
                    ].map((mood) => (
                        <motion.button
                            key={mood.id}
                            onClick={() => setCurrentMood(mood.id as any)}
                            className={`
                                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${currentMood === mood.id
                                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="mr-1">{mood.emoji}</span>
                            {mood.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
                <AnimatePresence>
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === 'user';

                        // User avatar: Use message sentiment for dynamic expression
                        // If user message contains sad words, show sad avatar regardless of mood setting
                        let userMood: 'happy' | 'sad' | 'angry' | 'tired';

                        if (isUser) {
                            // Detect mood from user's message content
                            userMood = detectUserMessageMood(msg.content);
                        } else {
                            // For initial messages, use current mood
                            if (currentMood === 'happy') userMood = 'happy';
                            else if (currentMood === 'sad' || currentMood === 'emotional') userMood = 'sad';
                            else if (currentMood === 'angry' || currentMood === 'cramps') userMood = 'angry';
                            else if (currentMood === 'tired') userMood = 'tired';
                            else userMood = 'happy';
                        }

                        const userAvatarPath = `/assets/characters/${selectedCharacter}/avatar-${userMood}.png`;

                        // Assistant avatar: caring companion with detected mood from message
                        const assistantMood = detectAssistantMood(msg.content);
                        const assistantAvatarPath = `/assets/characters/${selectedCharacter}/bf-${assistantMood}.png`;

                        const avatarPath = isUser ? userAvatarPath : assistantAvatarPath;

                        // Debug logging
                        if (idx === messages.length - 1) {
                            console.log('=== Avatar Debug ===');
                            console.log(`Role: ${isUser ? 'User' : 'Assistant'}`);
                            console.log(`Message: "${msg.content.substring(0, 50)}..."`);
                            console.log(`Detected Mood: ${isUser ? userMood : assistantMood}`);
                            console.log(`Avatar Path: ${avatarPath}`);
                            console.log('==================');
                        }

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex gap-3 ${isUser ? 'justify-end flex-row-reverse' : 'justify-start'}`}
                            >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-3 shadow-md ${isUser ? 'border-pink-300' : 'border-blue-300'
                                    }`}>
                                    <Image
                                        src={avatarPath}
                                        alt={isUser ? selectedCharacter : `${selectedCharacter}'s boyfriend`}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full relative z-10"
                                        onError={(e) => {
                                            console.log('Image failed to load:', avatarPath);
                                            // Hide the image and show placeholder
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
                                    {/* Emoji fallback - hidden by default, shown only on error */}
                                    <div className="emoji-placeholder absolute inset-0 hidden items-center justify-center text-2xl bg-gradient-to-br from-pink-200 to-purple-200">
                                        {isUser ? '👧' : '👦'}
                                    </div>
                                </div>

                                {/* Speech Bubble */}
                                <div className="relative max-w-[70%]">
                                    {/* Bubble tail */}
                                    <div
                                        className={`absolute top-3 ${isUser ? 'right-[-8px]' : 'left-[-8px]'
                                            } w-0 h-0`}
                                        style={{
                                            borderTop: `10px solid transparent`,
                                            borderBottom: `10px solid transparent`,
                                            [isUser ? 'borderLeft' : 'borderRight']: `10px solid ${isUser ? '#fbcfe8' : '#dbeafe'
                                                }`
                                        }}
                                    />

                                    <div
                                        className={`
                                            px-5 py-3 rounded-2xl shadow-md
                                            ${isUser
                                                ? 'bg-pink-200 text-gray-900'
                                                : 'bg-blue-100 text-gray-900'
                                            }
                                        `}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3 justify-start"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-blue-300 shadow-md">
                            <Image
                                src={`/assets/characters/${selectedCharacter}/bf-happy.png`}
                                alt="Boyfriend typing"
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="bg-blue-100 px-5 py-3 rounded-2xl shadow-md">
                            <span className="animate-pulse text-sm">Typing...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tell me what's on your mind..."
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-sm bg-white"
                    disabled={isLoading}
                />
                <motion.button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Send 💕
                </motion.button>
            </div>
        </div>
    );
}
