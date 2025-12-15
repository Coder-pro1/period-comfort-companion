# 🎨 Character-Based Theming System

## Overview
Your Period Comfort Companion now uses a **character-based theming system**. When you select a character (like Judy), everything changes - background, mood images, and chat avatars!

---

## 📁 Folder Structure

```
public/
  assets/
    characters/
      judy/                          ← Default character
        - background.jpg             ← Background when Judy is selected
        - preview.png                ← Character preview icon (optional)
        - avatar-happy.png           ← Judy happy (user avatar)
        - avatar-sad.png             ← Judy sad (user avatar)  
        - avatar-angry.png           ← Judy angry (user avatar)
        - avatar-tired.png           ← Judy tired (user avatar)
        - bf-happy.png               ← Judy's boyfriend happy
        - bf-sad.png                 ← Judy's boyfriend sad
        - bf-angry.png               ← Judy's boyfriend angry
        moods/
          - happy.png                ← Judy happy mood icon
          - sad.png                  ← Judy sad mood icon
          - angry.png                ← Judy angry mood icon
          - tired.png                ← Judy tired mood icon
      
      emma/                          ← Second character
        (same structure as judy)
      
      sarah/                         ← Third character
        (same structure as judy)
```

---

## 🎭 How It Works

### 1. Character Selection
- At the top of the page, users choose their character (Judy, Emma, or Sarah)
- This choice drives ALL theming

### 2. Dynamic Background
- **Path:** `/assets/characters/{character}/background.jpg`
- **Example:** When "Judy" is selected → shows `judy/background.jpg`
- **Effect:** Background smoothly transitions when character changes

### 3. Mood Images (Left Sidebar)
- **Path:** `/assets/characters/{character}/moods/{mood}.png`
- **Example:** Judy's happy mood → `judy/moods/happy.png`
- **Moods:** happy, sad, angry, tired

### 4. Chat Avatars

#### User Avatar (You)
- Shows the selected character in their current mood
- **Path:** `/assets/characters/{character}/avatar-{mood}.png`
- **Example:** If Judy is selected and mood is "sad" → shows `judy/avatar-sad.png`

#### Assistant Avatar (Boyfriend)
- Shows the character's boyfriend
- **Mood Detection:** AI analyzes the response and changes avatar mood
- **Path:** `/assets/characters/{character}/bf-{mood}.png`
- **Example:** 
  - If response is comforting → `judy/bf-happy.png`
  - If response acknowledges pain → `judy/bf-sad.png`
  - If response is protective → `judy/bf-angry.png`

---

## 🖼️ Image Specifications

### Background Images
- **Filename:** `background.jpg`
- **Size:** 1920x1080px (or larger, 16:9 ratio)
- **Format:** JPG or PNG
- **Style:** Character-themed room, cozy space, or aesthetic background
- **Location:** `/public/assets/characters/{character}/background.jpg`

### Avatar Images  
- **Filenames:** 
  - User: `avatar-happy.png`, `avatar-sad.png`, `avatar-angry.png`, `avatar-tired.png`
  - Boyfriend: `bf-happy.png`, `bf-sad.png`, `bf-angry.png`
- **Size:** 200x200px (square)
- **Format:** PNG with transparent background preferred
- **Style:** Character portrait/face showing emotion
- **Location:** `/public/assets/characters/{character}/`

### Mood Icons
- **Filenames:** `happy.png`, `sad.png`, `angry.png`, `tired.png`
- **Size:** 64x64px (square)
- **Format:** PNG
- **Style:** Simple emoji-style or character expression icons
- **Location:** `/public/assets/characters/{character}/moods/`

### Preview Icon (Optional)
- **Filename:** `preview.png`
- **Size:** 64x64px (square)
- **Format:** PNG
- **Use:** Shows in character selection buttons
- **Location:** `/public/assets/characters/{character}/preview.png`

---

## 🚀 Quick Start Guide

### Step 1: Create Your First Character (Judy)

1. **Background:**
   ```
   Add: public/assets/characters/judy/background.jpg
   ```

2. **User Avatars (Judy in different moods):**
   ```
   Add: public/assets/characters/judy/avatar-happy.png
   Add: public/assets/characters/judy/avatar-sad.png
   Add: public/assets/characters/judy/avatar-angry.png
   Add: public/assets/characters/judy/avatar-tired.png
   ```

3. **Boyfriend Avatars (Judy's BF in different moods):**
   ```
   Add: public/assets/characters/judy/bf-happy.png
   Add: public/assets/characters/judy/bf-sad.png
   Add: public/assets/characters/judy/bf-angry.png
   ```

4. **Mood Icons (for mood selector):**
   ```
   Add: public/assets/characters/judy/moods/happy.png
   Add: public/assets/characters/judy/moods/sad.png
   Add: public/assets/characters/judy/moods/angry.png
   Add: public/assets/characters/judy/moods/tired.png
   ```

### Step 2: Enable Images in Code

Once you've added the images, uncomment the Image components:

1. **In `CharacterSelection.tsx` (line ~46):**
   ```tsx
   // Uncomment this block
   <Image 
       src={`/assets/characters/${character.id}/preview.png`}
       alt={character.name}
       width={64}
       height={64}
   />
   ```

2. **In `MoodSelector.tsx` (line ~58):**
   ```tsx
   // Uncomment this block
   <Image 
       src={moodImagePath}
       alt={`${selectedCharacter} ${mood.label}`}
       fill
   />
   ```

3. **In `PeriodPalChat.tsx` (line ~126):**
   ```tsx
   // Uncomment this block
   <Image 
       src={avatarPath} 
       alt={isUser ? selectedCharacter : `${selectedCharacter}'s boyfriend`}
       width={48}
       height={48}
   />
   ```

### Step 3: Test!
- Select Judy character
- Change moods
- Chat and watch avatars change
- Background should show judy/background.jpg

---

## 🎨 Character Customization Tips

### For "Judy"
- **Theme:** Sweet & romantic
- **Colors:** Pinks, soft purples
- **Background:** Cozy bedroom, fairy lights, pastel aesthetic

### For "Emma"  
- **Theme:** Cheerful & energetic
- **Colors:** Bright purples, indigos
- **Background:** Fun, colorful room, posters, vibrant

### For "Sarah"
- **Theme:** Calm & serene
- **Colors:** Blues, cyans, whites
- **Background:** Minimalist, peaceful, nature-inspired

---

## 🔄 How Boyfriend Mood Detection Works

The AI assistant's avatar mood is detected from the response content:

| Response Contains | Avatar Mood |
|------------------|-------------|
| "angry", "mad", "frustrated" | `bf-angry.png` |
| "sad", "sorry", "tough", "pain" | `bf-sad.png` |
| Anything else (supportive) | `bf-happy.png` |

This makes the conversation feel more dynamic and responsive!

---

## ✅ Current Status

- ✅ Character selection component (3 characters: Judy, Emma, Sarah)
- ✅ Dynamic background per character
- ✅ Character-specific mood icons
- ✅ User avatar reflects character + current mood
- ✅ Boyfriend avatar reflects character + AI response mood
- ✅ Smooth transitions between characters
- ✅ Emoji placeholders until images are added
- ✅ All code commented with image paths

---

## 📝 Naming Convention

**Format:** `{character}/{category}-{mood}.{ext}`

**Examples:**
- `judy/background.jpg` - Judy's background
- `judy/avatar-happy.png` - Judy user avatar (happy)
- `judy/bf-sad.png` - Judy's boyfriend (sad)
- `judy/moods/angry.png` - Judy's angry mood icon
- `emma/background.jpg` - Emma's background
- `emma/moods/tired.png` - Emma's tired mood icon

---

## 🎯 Next Steps

1. ✅ Design/Choose your character images
2. ✅ Name files following the convention above
3. ✅ Place in correct folders
4. ✅ Uncomment Image components in code
5. ✅ Test character switching
6. ✅ Enjoy your personalized comfort companion! 💕

---

**Pro Tip:** Start with just Judy and get all her images working first. Then clone the folder and modify for Emma and Sarah!
