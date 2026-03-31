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
| Total Iterations | 1 |
| Total Weight (kg) | 5 |
| Total Time (min) | 3 |
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
