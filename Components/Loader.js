// Components/Loader.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const NAV_DELAY_MS = 5000;
const STAR = require('../assets/star.webp');
const BACKGROUND = require('../assets/splash_background.webp');
const LOGO = require('../assets/logo_text.webp');

export default function Loader() {
  const navigation = useNavigation();

  // заводим массив анимированных значений для 5 звёзд
  const anims = useRef(
    Array.from({ length: 5 }).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), NAV_DELAY_MS);

    // запускаем пульсацию для каждой звезды с разной задержкой
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => clearTimeout(timer);
  }, [navigation, anims]);

  // общая функция для стилей звезды
  const starStyle = anim => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] }) },
      { translateY: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -8, 0] }) },
    ],
  });

  // задаём размеры пяти звёзд
  const sizes = [40, 32, 24, 16, 28];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground source={BACKGROUND} style={styles.background}>
        <View style={styles.content}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />

          <View style={styles.starsRow}>
            {anims.map((anim, i) => (
              <Animated.Image
                key={i}
                source={STAR}
                style={[
                  { width: sizes[i], height: sizes[i] },
                  starStyle(anim),
                ]}
              />
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  logo: {
    width: width * 0.9,
    height: width * 0.9,
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.7,
  },
});
