
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to the Silent Sky',
    text:
      'Join me on a celestial journey where each star tells a story. We’ll explore the night sky like never before.',
    button: 'Next',
  },
  {
    title: 'Your Telescope Guide',
    text:
      'I’ll share what to watch, when to look, and how to spot planets, stars, and constellations with your telescope.',
    button: 'Got it',
  },
  {
    title: 'Earn Achievements',
    text:
      'Read articles, observe the sky, and track your discoveries — every step brings you closer to becoming a true skywatcher.',
    button: 'Begin',
  },
];

export default function Onboarding() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const handlePress = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require('../assets/splash_background.webp')}
        style={styles.background}
      >
        {/* HERO */}
        <View style={styles.heroWrapper}>
          <Image
            source={require('../assets/hero.webp')}
            style={styles.hero}
            resizeMode="contain"
          />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.text}>{slide.text}</Text>

          {/* индикатор */}
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          {/* бренд */}
          <Image source={require('../assets/skv.webp')} style={styles.skv} />
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handlePress}>
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[styles.btnCorner, styles.btnCornerTL]}
            resizeMode="contain"
            pointerEvents="none"
          />
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[styles.btnCorner, styles.btnCornerBR, { transform: [{ rotate: '180deg' }] }]}
            resizeMode="contain"
            pointerEvents="none"
          />
          <Text style={styles.buttonText}>{slide.button}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const NAVY   = '#0C0F1E'; // основной фон карточки
const PURPLE = '#6B3FA0'; // акцент
const GOLD   = '#F1C40F'; // выделение
const WHITE  = '#FFFFFF';

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width,
    height,
    alignItems: 'center',
  },

  /* HERO */
  heroWrapper: {
    flex: 1.05,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 40,
  },
  hero: {
    width: width * 0.78,
    height: height * 0.64,
    marginBottom: -120,
  },

  /* CARD */
  card: {
    width: width * 0.9,
    backgroundColor: NAVY,
    borderWidth: 2,
    borderColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: 18,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    color: GOLD,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  text: {
    color: WHITE,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  skv: {
    position: 'absolute',
    right: 14,
    bottom: 10,
    width: 54,
    height: 24,
    tintColor:PURPLE,
  },

  /* dots */
  dots: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#342b47',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: PURPLE,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  /* BUTTON */
  button: {
    width: width * 0.72,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: PURPLE,
    borderRadius: 12,
    marginBottom: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NAVY,
    overflow: 'visible',
  },
  buttonText: {
    color: GOLD,
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    zIndex: 1,
  },

  /* ornament inside button */
  btnCorner: {
    position: 'absolute',
    width: 120,
    height: 50,
    zIndex: 2,
    tintColor: GOLD,
  },
  btnCornerTL: { top: -7, left: -19 },
  btnCornerBR: { bottom: -9, right: -19 },
}); 