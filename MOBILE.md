# 📱 MOBILE.md — NAIM Evolution Log

> This file is your autoresearch log. Every iteration gets documented here.
> No log = no lift. No lift = no weight.

---

## 🧬 Identity

**NAIM Name:** `Jumple`  
**Crew:** `Solo Dev`  
**App Concept:** `An AI-powered Doodle Jump clone where a chat interface edits the game rules in real time.`  
**Starting Tool:** `Antigravity`

---

## 📊 Scoreboard

| Metric | Value |
|--------|-------|
| Total Iterations | 4 |
| Total Weight (kg) | 60 |
| Total Time (min) | 25 |
| Failed Attempts | 0 |

---

## 🔁 Iterations

---

### 🏋️ Iteration 1

| Field | Value |
|-------|-------|
| Feature | `Basic UI screen` |
| Weight | `5 kg` |
| Tool Used | `Antigravity` |
| Time | `3 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
Build the basic UI structure for a Doodle Jump clone in React Native using Expo. Create the Main Menu, Game Screen, and Game Over screens. Include a Play and Retry button. Keep everything in App.js.
```

**What happened:**
- Successfully created the core screens, rendering a jumping character and basic platforms. The navigation between Menu, Game, and GameOver happens smoothly through state updates.

**Screenshot:** 

**Commit:** 

[NAIM: Jumple] Arayüz ve oyun alanı tasarlandı - 5kg

### 🏋️ Iteration 2

| Field | Value |
|-------|-------|
| Feature | `Text input/output` |
| Weight | `10 kg` |
| Tool Used | `Antigravity` |
| Time | `5 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
Add a text input bar at the bottom of the game screen so users can write commands. When a command is sent, parse the text to output visual feedback like changing the background color or character emojis in the game.
```

**What happened:**
- Added a KeyboardAvoidingView with a TextInput at the bottom. Implemented a function that reads the text input and outputs direct style updates to the game state instantly.

**Screenshot:** 

**Commit:** 

[NAIM: Jumple] Metin girişi ve çıktı entegrasyonu - 10kg


### 🏋️ Iteration 3

| Field | Value |
|-------|-------|
| Feature | `Local storage / cache` |
| Weight | `20 kg` |
| Tool Used | `Antigravity` |
| Time | `5 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
Use AsyncStorage to save the High Score locally. Every time the game is over, check if the current score is higher than the saved score, and if so, cache it so it persists when the app restarts.
```

**What happened:**
- Connected Expo's AsyncStorage. Score comparisons work perfectly and high score data fetches successfully whenever the application starts.

**Screenshot:** 

**Commit:** 

[NAIM: Jumple] Yerel depolama ve önbellek entegrasyonu - 20kg

### 🏋️ Iteration 4

| Field | Value |
|-------|-------|
| Feature | `AI feature (chat, summary, etc.)` |
| Weight | `25 kg` |
| Tool Used | `Antigravity` |
| Time | `12 min` |
| Attempts | `2` |
| Status | ✅ Success |

**Prompt given to AI:**
```
Establish a Model Context Protocol (MCP) server bridge via a Local Node.js backend. Connect the React Native game's chat input directly to the Google Gemini AI. The AI should generate a strict JSON payload mapping to visual and physical aspects. Ensure the game state automatically updates configurations (colors, physical jump force, gravity) the moment a user submits commands in natural language.
```

**What happened:**
- Setup a dedicated Node.js Stitch MCP backend utilizing the @google/genai module. The system perfectly parses natural language game modifications (like color, jump force, platform extensions) and pushes live JSON configurations back to the in-game state via React Native's hooks.

**Screenshot:** 

**Commit:** 

[NAIM: Jumple] Yapay zeka tasarımı algılayıcı sunucusu entegre edildi - 25kg

## 🧠 Reflection (fill at the end)

**Hardest part:**
> Ensuring the Game Loop integrates well with the React State system.

**What AI did well:**
> Seamlessly isolated the features into their respective categories and smoothly managed AsyncStorage logic.

**Where AI failed:**
> Native accelerometer support for Web required adding custom keyboard fallback logic manually.

**If I started over, I would:**
> Use React Native Reanimated to run the game physics loop outside the main thread for uncompromised FPS performance.

**Best feature I built:**
> The dynamic text input parsing that modifies game styles and object themes instantly!

**Biggest surprise:**
> Device APIs and Local Storage integrated really quickly within a single file architecture without breaking modularity.
