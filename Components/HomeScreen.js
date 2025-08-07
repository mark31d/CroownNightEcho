// Components/HomeScreen.js
import React from 'react'
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  Text,
  Dimensions,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')

// Тёмные тона
const PURPLE_DARK = '#2C1A3F'  // глубокий фиолетовый
const GOLD_DARK   = '#A57C00'  // приглушённое золото
const WHITE       = '#FFFFFF'
const BLACK       = '#000000'

const MENU = [
  { label: 'Celestial\nObjects',      route: 'Objects' },
  { label: 'Celestial\nAchievements', route: 'Achievements' },
  { label: 'StarPop',       route: 'Constellation' },
  { label: 'Settings',                route: 'Settings' },
]

/**
 * Обводка текста (8 копий + главный слой)
 */
const OutlineText = ({ style, children, outlineColor = GOLD_DARK, outlineWidth = 1 }) => {
  const offsets = [
    { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
    { x:  0, y: -1 },                { x:  0, y: 1 },
    { x:  1, y: -1 }, { x:  1, y: 0 }, { x:  1, y: 1 },
  ]

  return (
    <View style={{ position: 'relative' }}>
      {offsets.map((o, i) => (
        <Text
          key={i}
          style={[
            style,
            {
              position: 'absolute',
              color: outlineColor,
              left:  o.x * outlineWidth,
              top:   o.y * outlineWidth,
            },
          ]}
        >
          {children}
        </Text>
      ))}
      <Text style={style}>{children}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require('../assets/splash_background.webp')}
        style={styles.background}
      >
        {/* Логотип */}
        <Image
          source={require('../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.menu}>
          {MENU.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => navigation.navigate(item.route)}
            >
              {/* Орнаменты */}
              <Image
                source={require('../assets/ornament_corner.webp')}
                style={[styles.corner, styles.cornerTL]}
                resizeMode="contain"
                pointerEvents="none"
              />
              <Image
                source={require('../assets/ornament_corner.webp')}
                style={[styles.corner, styles.cornerBR, { transform: [{ rotate: '180deg' }] }]}
                resizeMode="contain"
                pointerEvents="none"
              />

              {/* Текст с приглушённой золотой обводкой */}
              <OutlineText style={styles.buttonText} outlineWidth={2}>
                {item.label}
              </OutlineText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Watermark */}
        <Image
          source={require('../assets/skv.webp')}
          style={styles.brandImage}
          resizeMode="contain"
        />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE_DARK,
  },
  background: {
    flex: 1,
    width,
    paddingTop: (StatusBar.currentHeight || 30) + 10,
    alignItems: 'center',
  },

  logo: {
    width: width * 0.6,
    height: 190,
    marginTop: -40,
    marginBottom: -60,
  },

  menu: {
    flex: 1,
    width,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  button: {
    alignSelf: 'center',
    width: width * 0.88,
    minHeight: 88,
    backgroundColor: PURPLE_DARK,
    borderWidth: 2,
    borderColor: GOLD_DARK,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  buttonText: {
    color: WHITE,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    fontWeight: '600',
  },

  corner: {
    position: 'absolute',
    width: 94,
    height: 104,
    tintColor: GOLD_DARK,
  },
  cornerTL: { left: -6, top: -35 },
  cornerBR: { right: -6, bottom: -35 },

  brandImage: {
    position: 'absolute',
    right: -15,
    bottom: 22,
    width: 80,
    height: 24,
    tintColor: GOLD_DARK,
  },
})
