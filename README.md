# The Period Comfort Companion 🌸

A specialized Next.js web app designed to provide comfort, distraction, and care during your period. Built with empathy, warmth, and lots of interactive features!

## ✨ Features

### 🤖 Period Pal Chat Assistant
- AI-powered chat using Google Gemini
- Deeply empathetic and supportive responses
- Mood-aware messaging (knows when you're in pain, emotional, etc.)
- SHORT, comforting replies (no long lectures!)

### 💕 Mood & Symptom Tracking
- Specific period states: Cramps, Emotional, Cravings, Angry, Tired
- Dynamic avatar that changes based on your mood
- Beautiful, comforting UI with smooth transitions

### 🎁 Interactive Comfort Features
- **Make Feel Better Generator**: Validating messages and fun facts
- **Joke Engine**: Mood-appropriate jokes (sarcastic for angry, wholesome for sad)
- **Virtual Care Package**: Full-screen animations (hugs, kisses, tummy rubs with floating hearts!)
- **Calm Corner**: YouTube embeds (Lo-fi, rain sounds, brown noise)
- **Rant Journal**: Wimpy Kid-style diary with handwritten font
- **Emergency SOS**: Breathing exercises, grounding techniques, reassurance

### 🎉 Easter Eggs
- Click the chocolate icon 5 times for a surprise! 🍫

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Periodapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and add your Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom comfort-themed palette)
- **Animations**: Framer Motion
- **AI**: Google Gemini API (`@google/generative-ai`)
- **State**: React Context API
- **Storage**: localStorage (for journal entries)

## 📦 Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Period Comfort Companion"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
   - Add Environment Variable:
     - Key: `GEMINI_API_KEY`
     - Value: Your Gemini API key
   - Click "Deploy"

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add environment variable**:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Enter your Gemini API key when prompted.

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## 🎯 Usage Tips

1. **Start by selecting your mood** - this helps personalize your experience
2. **Try the Emergency SOS** if you're overwhelmed - it has breathing exercises and grounding techniques
3. **Chat with Period Pal** - the AI is trained to be SHORT and comforting
4. **Write in the Rant Journal** - it's private and saved locally
5. **Click the floating chocolate icon 5 times** for a fun surprise! 🍫

## 🌈 Color Palette

The app uses a warm, cozy color scheme:
- **Comfort Pink**: Soft, supportive pinks (#fef1f7 to #8b1135)
- **Comfort Cream**: Warm, welcoming creams (#fefdfb to #c75a26)
- **Comfort Red**: Gentle, validating reds (#fef2f2 to #7f1d1d)
- **Comfort Lavender**: Calming, soothing purples (#faf5ff to #581c87)

## 📝 Project Structure

```
Periodapp/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Gemini API endpoint
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── components/
│   ├── CalmCorner.tsx           # Music player
│   ├── DynamicAvatar.tsx        # Mood-based avatar
│   ├── EasterEggs.tsx           # Hidden interactions
│   ├── EmergencyComfort.tsx     # SOS section
│   ├── JokeEngine.tsx           # Mood-aware jokes
│   ├── MakeFeelBetter.tsx       # Validating messages
│   ├── MoodSelector.tsx         # Mood/symptom selector
│   ├── PeriodPalChat.tsx        # AI chat interface
│   ├── RantJournal.tsx          # Diary component
│   └── VirtualCarePackage.tsx   # Animated comfort
├── contexts/
│   └── ComfortContext.tsx       # Global state
├── public/                      # Static assets
├── .env.example                 # Environment template
├── package.json
├── tailwind.config.ts
└── README.md
```

## 🤝 Contributing

This is a specialized comfort app. If you'd like to add features:
- Keep the empathetic, warm tone
- Maintain SHORT, comforting messaging
- Use soft animations and rounded designs
- Test on both desktop and mobile

## 💝 Support

Remember: You're doing amazing. This app is here to support you through the tough days. Be gentle with yourself. 🌸

---

Made with 💕 for everyone who needs a little extra comfort during their period.
