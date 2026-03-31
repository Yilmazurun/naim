import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accelerometer } from 'expo-sensors';

const { width: W, height: H } = Dimensions.get('window');

const PLATFORM_W = 70;
const PLATFORM_H = 15;

const DEFAULT_CONFIG = {
  backgroundColor: '#1E1E2E',
  platformColor: '#A6E3A1',
  characterEmoji: '👽',
  platformSpeed: 0,
  platformWidth: 70, // Added dynamic platform width
  jumpForce: -13,
  gravity: 0.6,
  playerSize: 40,
};

export default function App() {
  const [screen, setScreen] = useState('MENU');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [chatInput, setChatInput] = useState('');
  const [renderTicks, setRenderTicks] = useState(0);
  const [funFact, setFunFact] = useState('Loading tip of the day...');

  const physicsRef = useRef({
    player: { x: W / 2 - DEFAULT_CONFIG.playerSize / 2, y: H / 2, vx: 0, vy: 0 },
    platforms: [],
    cameraY: 0,
    score: 0,
    isGameOver: false,
  });

  const frameRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem('highscore').then(v => {
      if (v) setHighScore(parseInt(v));
    });

    // API Call (fetch) feature - 15kg
    fetch('https://dummyjson.com/quotes/random')
      .then(res => res.json())
      .then(data => setFunFact(`"${data.quote}"\n— ${data.author}`))
      .catch(err => setFunFact("Keep jumping to reach the stars!"));
  }, []);

  // Accelerometer (Tilt) input or Keyboard (Web)
  useEffect(() => {
    let subscription;
    if (screen === 'GAME') {
      if (Platform.OS !== 'web') {
        Accelerometer.setUpdateInterval(16);
        subscription = Accelerometer.addListener(data => {
          if (Math.abs(data.x) > 0.1) {
            physicsRef.current.player.vx = data.x * 30; // Sensitive mapping
          }
        });
      } else {
        const handleKeyDown = (e) => {
          if (e.key === 'ArrowLeft') physicsRef.current.player.vx = -10;
          if (e.key === 'ArrowRight') physicsRef.current.player.vx = 10;
        };
        const handleKeyUp = (e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') physicsRef.current.player.vx = 0;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        subscription = {
          remove: () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
          }
        };
      }
    }
    return () => subscription && subscription.remove();
  }, [screen]);

  const generateInitialPlatforms = () => {
    let platforms = [];
    for (let i = 0; i < 15; i++) {
      platforms.push({
        id: Math.random(),
        x: Math.random() * (W - config.platformWidth),
        y: H - i * (H / 10),
        w: config.platformWidth,
        h: PLATFORM_H,
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }
    // ensure one directly under player initially
    platforms[0].x = W / 2 - config.platformWidth / 2;
    platforms[0].y = H / 2 + 100;
    return platforms;
  };

  const startGame = () => {
    physicsRef.current = {
      player: { x: W / 2 - config.playerSize / 2, y: H / 2, vx: 0, vy: 0 },
      platforms: generateInitialPlatforms(),
      cameraY: 0,
      score: 0,
      isGameOver: false,
    };
    setScore(0);
    setScreen('GAME');
  };

  useEffect(() => {
    if (physicsRef.current.platforms) {
      for (let p of physicsRef.current.platforms) {
        p.w = config.platformWidth;
      }
    }
  }, [config.platformWidth]);

  const gameOver = async (finalScore) => {
    finalScore = Math.floor(finalScore);
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      await AsyncStorage.setItem('highscore', finalScore.toString());
    }
    setScreen('OVER');
  };

  useEffect(() => {
    if (screen !== 'GAME') {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const updateGame = () => {
      const state = physicsRef.current;
      if (state.isGameOver) return;

      // Gravity
      state.player.vy += config.gravity;
      state.player.y += state.player.vy;
      state.player.x += state.player.vx;

      // Wrap horizontally
      if (state.player.x > W) state.player.x = -config.playerSize;
      if (state.player.x < -config.playerSize) state.player.x = W;

      // Moving platforms logic
      if (config.platformSpeed > 0) {
        for (let p of state.platforms) {
          p.x += config.platformSpeed * p.dir;
          if (p.x <= 0) p.dir = 1;
          if (p.x + p.w >= W) p.dir = -1;
        }
      }

      // Collisions with platforms (only when falling)
      if (state.player.vy > 0) {
        const footY = state.player.y + config.playerSize;
        const footYPrev = footY - state.player.vy;

        for (let p of state.platforms) {
          if (footY >= p.y && footYPrev <= p.y + p.h) {
            if (state.player.x + config.playerSize > p.x && state.player.x < p.x + p.w) {
              state.player.vy = config.jumpForce; // bounce
              break; 
            }
          }
        }
      }

      // Camera Scrolling
      if (state.player.y < H / 2) {
        const diff = H / 2 - state.player.y;
        state.player.y = H / 2;
        state.cameraY += diff;
        state.score += diff / 10;

        for (let p of state.platforms) {
          p.y += diff;
        }
      }

      // Remove off-screen platforms
      state.platforms = state.platforms.filter(p => p.y < H + 100);

      // Generate new platforms
      let highestY = state.platforms.reduce((min, p) => p.y < min ? p.y : min, H);
      while (highestY > -H / 2) {
        const newY = highestY - (Math.random() * 60 + 50);
        state.platforms.push({
          id: Math.random(),
          x: Math.random() * (W - config.platformWidth),
          y: newY,
          w: config.platformWidth,
          h: PLATFORM_H,
          dir: Math.random() > 0.5 ? 1 : -1,
        });
        highestY = newY;
      }

      // Fall below screen = Game Over
      if (state.player.y > H + config.playerSize) {
        state.isGameOver = true;
      }

      setRenderTicks(t => t + 1); // trigger re-render

      if (!state.isGameOver) {
        frameRef.current = requestAnimationFrame(updateGame);
      } else {
        gameOver(state.score);
      }
    };

    frameRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(frameRef.current);
  }, [screen, config]);

  const handleAICommand = async () => {
    if (!chatInput.trim()) return;
    const txt = chatInput.toLowerCase();
    
    setChatInput('');
    Keyboard.dismiss();

    let newConf = { ...config };
    let changed = false;

    try {
      // 1. Send the command to local Stitch MCP Engine (Node.js backend)
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: txt,
          currentConfig: config
        })
      });

      if (res.ok) {
        const data = await res.json();
        // data matches exactly our json requirement thanks to Gemini
        setConfig({ ...config, ...data });
        return; // Success, done!
      } else {
        console.warn("MCP API returned error, falling back to mock logic...");
      }
    } catch (e) {
      console.warn("Connection to Stitch MCP failed (is backend running?). Falling back to mock logic...", e);
    }

    // 2. Fallback logic if server is offline or missing API key
    if (txt.includes('blue')) { newConf.backgroundColor = '#87CEEB'; changed = true; }
    if (txt.includes('red')) { newConf.backgroundColor = '#FF5555'; changed = true; }
    if (txt.includes('dark')) { newConf.backgroundColor = '#1E1E2E'; changed = true; }
    if (txt.includes('light')) { newConf.backgroundColor = '#FFFFFF'; changed = true; }
    if (txt.includes('yellow')) { newConf.backgroundColor = '#FEF08A'; changed = true; }
    if (txt.includes('purple')) { newConf.backgroundColor = '#A78BFA'; changed = true; }
    
    if (txt.includes('frog') || txt.includes('toad')) { newConf.characterEmoji = '🐸'; changed = true; }
    if (txt.includes('robot') || txt.includes('bot')) { newConf.characterEmoji = '🤖'; changed = true; }
    if (txt.includes('alien')) { newConf.characterEmoji = '👽'; changed = true; }
    if (txt.includes('rocket')) { newConf.characterEmoji = '🚀'; changed = true; }
    if (txt.includes('cat')) { newConf.characterEmoji = '🐱'; changed = true; }
    if (txt.includes('ghost')) { newConf.characterEmoji = '👻'; changed = true; }

    if (txt.includes('move') || txt.includes('fast') || txt.includes('speed')) { newConf.platformSpeed = 2.5; changed = true; }
    if (txt.includes('stop') || txt.includes('still')) { newConf.platformSpeed = 0; changed = true; }
    
    if (txt.includes('green') && txt.includes('platform')) { newConf.platformColor = '#00FF00'; changed = true; }
    if (txt.includes('white') && txt.includes('platform')) { newConf.platformColor = '#FFFFFF'; changed = true; }
    if (txt.includes('black') && txt.includes('platform')) { newConf.platformColor = '#000000'; changed = true; }

    if (!changed) {
      const emojis = ['🛸','🎃','👾','🎈','🌟','🍕'];
      newConf.characterEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    }

    setConfig(newConf);
  };

  if (screen === 'MENU') {
    return (
      <View style={[styles.menuContainer, { backgroundColor: config.backgroundColor }]}>
        <Text style={[styles.title, { color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#000' : '#FFF' }]}>
          Doodle Jump AI
        </Text>
        <Text style={[styles.subtitle, { color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#444' : '#CCC' }]}>
          High Score: {highScore}
        </Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>PLAY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {marginTop: 15, backgroundColor: '#8b5cf6'}]} onPress={() => setScreen('PROFILE')}>
          <Text style={styles.buttonText}>PROFILE</Text>
        </TouchableOpacity>
        
        <View style={{ marginTop: 40, paddingHorizontal: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
            {funFact}
          </Text>
        </View>

        <Text style={styles.instructions}>Tilt phone or tap screen edges to move</Text>
      </View>
    );
  }

  if (screen === 'PROFILE') {
    return (
      <View style={[styles.menuContainer, { backgroundColor: config.backgroundColor }]}>
        <Text style={[styles.title, { fontSize: 36, color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#000' : '#FFF' }]}>
          Player Profile
        </Text>
        <View style={{ marginVertical: 30, alignItems: 'center' }}>
          <Text style={[styles.subtitle, { marginBottom: 10, color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#444' : '#CCC' }]}>
            Highest Altitude: {highScore} km
          </Text>
          <Text style={[styles.subtitle, { marginBottom: 10, color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#444' : '#CCC' }]}>
            Current Avatar: {config.characterEmoji}
          </Text>
          <Text style={[styles.subtitle, { marginBottom: 10, color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#444' : '#CCC' }]}>
            Rank: Doodle Master
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setScreen('MENU')}>
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'OVER') {
    return (
      <View style={[styles.menuContainer, { backgroundColor: config.backgroundColor }]}>
        <Text style={[styles.title, { color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#000' : '#FFF' }]}>
          Game Over
        </Text>
        <Text style={[styles.subtitle, { color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#444' : '#CCC' }]}>
          Score: {score}
        </Text>
        <Text style={[styles.subtitle, { color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#444' : '#CCC' }]}>
          High Score: {highScore}
        </Text>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>RETRY</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { player, platforms, score: currentScore } = physicsRef.current;

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: config.backgroundColor }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.gameArea}>
        
        {/* Touch zones for moving */}
        <View style={styles.touchControls}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={{flex: 1}} 
            onPressIn={() => physicsRef.current.player.vx = -7} 
            onPressOut={() => physicsRef.current.player.vx = 0} 
          />
          <TouchableOpacity 
            activeOpacity={1} 
            style={{flex: 1}} 
            onPressIn={() => physicsRef.current.player.vx = 7} 
            onPressOut={() => physicsRef.current.player.vx = 0} 
          />
        </View>

        {/* Platforms */}
        {platforms.map(p => (
          <View key={p.id} style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.w,
            height: p.h,
            backgroundColor: config.platformColor,
            borderRadius: p.h / 2,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
          }} />
        ))}

        {/* Player */}
        <View style={{
          position: 'absolute',
          left: player.x,
          top: player.y,
          width: config.playerSize,
          height: config.playerSize,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: config.playerSize * 0.8 }}>{config.characterEmoji}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: config.backgroundColor === '#FFFFFF' || config.backgroundColor === '#87CEEB' ? '#000' : '#FFF' }]}>
            {Math.floor(currentScore)}
          </Text>
        </View>
      </View>

      {/* AI Chat Bar */}
      <View style={styles.chatBarWrapper}>
        <TextInput
          style={styles.chatInput}
          placeholder="e.g. 'make background blue'"
          placeholderTextColor="#888"
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={handleAICommand}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleAICommand}>
          <Text style={styles.sendBtnText}>MCP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  instructions: {
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    overflow: 'hidden',
  },
  touchControls: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1, // sits above background, below chat
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
  },
  scoreText: {
    fontSize: 42,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  chatBarWrapper: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 3,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  sendBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  sendBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
