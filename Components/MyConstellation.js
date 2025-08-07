// Components/MyConstellation.js
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar,
  Dimensions, Animated, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

/* ---- PALETTE ---- */
const PURPLE_DARK = '#2C1A3F';
const GOLD_DARK   = '#A57C00';
const WHITE       = '#FFFFFF';
const BLACK       = '#000000';

/* ---- ASSETS ---- */
const BG          = require('../assets/splash_background.webp');
const ICON_BACK   = require('../assets/ic_back.webp');
const ICON_CROWN  = require('../assets/logo.webp');      // корона/логотип
const STAR_IMG    = require('../assets/star.webp');    // звезда для “попа”

/* ---- GAME CONFIG ---- */
const ROUND_TIME = 30;        // сек
const SPAWN_EVERY_MS = 650;   // как часто спавним
const STAR_TTL_MS = 1200;     // сколько живёт звезда
const STAR_SIZE = 44;         // размер звезды (картинки)
const FRAME_PAD = 16;

let SID = 1;

export default function MyConstellation() {
  const nav = useNavigation();

  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]); // {id,x,y,scale,op}

  const timers = useRef({ tick: null, spawn: null });

  // реальные размеры поля, чтобы не залезать за рамку
  const [fieldSize, setFieldSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    return () => stopGame(); // cleanup
  }, []);

  function startGame() {
    stopGame();
    setScore(0);
    setStars([]);
    setTimeLeft(ROUND_TIME);
    setRunning(true);

    timers.current.tick = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    timers.current.spawn = setInterval(() => {
      spawnStar();
    }, SPAWN_EVERY_MS);
  }

  function stopGame() {
    setRunning(false);
    clearInterval(timers.current.tick);
    clearInterval(timers.current.spawn);
    timers.current.tick = null;
    timers.current.spawn = null;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function spawnStar() {
    if (!fieldSize.w || !fieldSize.h) return;

    const margin = Math.ceil(STAR_SIZE / 2) + 8; // чтобы не касаться рамки
    const x = margin + Math.random() * (fieldSize.w - margin * 2);
    const y = margin + Math.random() * (fieldSize.h - margin * 2);

    const id = SID++;
    const scale = new Animated.Value(0.6);
    const op = new Animated.Value(0);

    const star = {
      id,
      x: clamp(x, margin, fieldSize.w - margin),
      y: clamp(y, margin, fieldSize.h - margin),
      scale,
      op,
    };

    setStars(prev => [...prev, star]);

    // появление → автоугасание
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
        Animated.timing(op, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]),
      Animated.delay(Math.max(200, STAR_TTL_MS - 240)),
      Animated.parallel([
        Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        Animated.timing(op, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setStars(prev => prev.filter(s => s.id !== id));
    });
  }

  function onStarPress(id) {
    setScore(s => s + 100);
    setStars(prev => {
      const s = prev.find(st => st.id === id);
      if (s) {
        Animated.parallel([
          Animated.timing(s.scale, { toValue: 1.25, duration: 90, useNativeDriver: true }),
          Animated.timing(s.op, { toValue: 0, duration: 110, useNativeDriver: true }),
        ]).start();
      }
      return prev.filter(st => st.id !== id);
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={BG} style={styles.background} resizeMode="cover">
        {/* ---------- TOP BAR: всё по одной линии ---------- */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => { stopGame(); nav.goBack(); }}
            style={styles.backBtn}
            activeOpacity={0.85}
          >
            <Image source={ICON_BACK} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>

          <Image source={ICON_CROWN} style={styles.crown} resizeMode="contain" />

          <View style={styles.hudRight}>
            <View style={styles.hudPill}>
              <Text style={styles.hudLabel}>SCORE</Text>
              <Text style={styles.hudValue}>{score}</Text>
            </View>
            <View style={[styles.hudPill, { marginLeft: 8 }]}>
              <Text style={styles.hudLabel}>TIME</Text>
              <Text style={styles.hudValue}>{timeLeft}s</Text>
            </View>
          </View>
        </View>

        {/* ---------- FIELD ---------- */}
        <View
          style={styles.field}
          onLayout={e => {
            const { width: w, height: h } = e.nativeEvent.layout;
            setFieldSize({ w, h });
          }}
        >
          {/* звёзды */}
          {stars.map(s => (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.9}
              onPress={() => onStarPress(s.id)}
              style={{
                position: 'absolute',
                left: s.x - STAR_SIZE / 2,
                top: s.y - STAR_SIZE / 2,
              }}
            >
              <Animated.View
                style={[
                  styles.starWrap,
                  {
                    transform: [{ scale: s.scale }],
                    opacity: s.op,
                    width: STAR_SIZE,
                    height: STAR_SIZE,
                  },
                ]}
              >
                {/* обводка-подложка для читаемости */}
                <View style={styles.starStroke} />
                <Image
                  source={STAR_IMG}
                  style={styles.starImg}
                  resizeMode="contain"
                />
              </Animated.View>
            </TouchableOpacity>
          ))}

          {/* overlay старт/финиш */}
          {!running && (
            <View style={styles.overlay}>
              <Text style={styles.title}>{timeLeft === 0 ? 'Time Up!' : 'Star Pop'}</Text>
              {timeLeft === 0 && (
                <Text style={styles.subtitle}>Your score: {score}</Text>
              )}
              <TouchableOpacity style={styles.primaryBtn} onPress={startGame}>
                <Text style={styles.primaryBtnText}>{timeLeft === 0 ? 'PLAY AGAIN' : 'START'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

/* ---- STYLES ---- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PURPLE_DARK },
  background: { flex: 1, width, height, paddingTop: (StatusBar.currentHeight || 30) + 8 },

  /* top line */
  topBar: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 30) + 6,
    left: FRAME_PAD,
    right: FRAME_PAD,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',             // ← одна линия по вертикали
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2, borderColor: WHITE,
  },
  backIcon: { width: 50, height: 50,  },

  crown: {
    width: 78, height: 78,             // корона по центру
   
  },

  hudRight: { flexDirection: 'row', alignItems: 'center' },
  hudPill: {
    backgroundColor: PURPLE_DARK,
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  hudLabel: { color: WHITE, fontSize: 12, opacity: 0.9, letterSpacing: 1 },
  hudValue: {
    color: WHITE, fontSize: 18, fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  field: {
    position: 'absolute',
    left: FRAME_PAD, right: FRAME_PAD,
    top: (StatusBar.currentHeight || 30) + 60 + 48 + 10, // топ-бар + высота короны + отступ
    bottom: FRAME_PAD,
    borderWidth: 2,
    borderColor: GOLD_DARK,
    borderRadius: 14,
    backgroundColor: 'rgba(44,26,63,0.75)',
    overflow: 'hidden', // ← чтобы визуально ничего не вылезало
  },

  /* звезда */
  starWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BLACK,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  starStroke: {
    position: 'absolute',
    left: -2, right: -2, top: -2, bottom: -2,
    borderWidth: 2, borderColor: GOLD_DARK, borderRadius: 10, opacity: 0.75,
  },
  starImg: {
    width: '100%', height: '100%',
   
  },

  /* overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 24,
  },
  title: {
    color: WHITE, fontSize: 28, fontWeight: '900', letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.95)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
    textAlign: 'center',
  },
  subtitle: { color: WHITE, fontSize: 16, opacity: 0.95, marginTop: 8, marginBottom: 14 },
  primaryBtn: {
    backgroundColor: '#FFD36B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: WHITE,
    borderWidth: 3,
    marginTop: 8,
  },
  primaryBtnText: { color: BLACK, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
