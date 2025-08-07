// Components/SettingsScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingsContext } from './SettingsContext';

const { width, height } = Dimensions.get('window');

/* ---- PALETTE ---- */
const PURPLE_DARK = '#2C1A3F';
const GOLD_DARK   = '#A57C00';
const WHITE       = '#FFFFFF';
const BLACK       = '#000000';

/* ---- ASSETS ---- */
const BG            = require('../assets/splash_background.webp');
const ICON_BACK     = require('../assets/ic_back.webp');
const ICON_CROWN    = require('../assets/logo.webp');
const STAR_FILLED   = require('../assets/star_filled.webp');
const STAR_OUTLINE  = require('../assets/star_outline.webp');

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { musicOn, vibrationOn, toggleMusic, toggleVibration } = useContext(SettingsContext);
  const [rating, setRating] = useState(0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Explore the night sky with me! 🌌 Download “Under the Silent Sky” app now.',
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground source={BG} style={styles.background} resizeMode="cover">
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.85}>
            <Image source={ICON_BACK} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>

          <Image source={ICON_CROWN} style={styles.crown} resizeMode="contain" />

          {/* Заглушка для выравнивания */}
          <View style={styles.backBtn} />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.btn, musicOn ? styles.btnOn : styles.btnOff]}
            activeOpacity={0.8}
            onPress={toggleMusic}
          >
            <Text style={styles.btnText}>{`Music ${musicOn ? 'ON' : 'OFF'}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, vibrationOn ? styles.btnOn : styles.btnOff]}
            activeOpacity={0.8}
            onPress={toggleVibration}
          >
            <Text style={styles.btnText}>{`Vibration ${vibrationOn ? 'ON' : 'OFF'}`}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnOn]} activeOpacity={0.85} onPress={handleShare}>
            <Text style={styles.btnText}>Share App</Text>
          </TouchableOpacity>

          {/* RATING */}
          <View style={styles.ratingWrap}>
            <Text style={styles.ratingLabel}>Rate the App</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                  <Image
                    source={i <= rating ? STAR_FILLED : STAR_OUTLINE}
                    style={[styles.star, { tintColor: i <= rating ? GOLD_DARK : WHITE }]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PURPLE_DARK },
  background: {
    flex: 1,
    width,
    height,
    paddingTop: (StatusBar.currentHeight || 30) + 6,
  },

  /* TOP BAR */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 6,
  },
  
  backIcon: { width: 50, height: 50,  },
  crown: { width: 100, height: 100, left:-25,},

  /* CONTENT */
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  btn: {
    width: '88%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: WHITE,
    marginVertical: 8,
  },
  btnOn: { backgroundColor: GOLD_DARK },
  btnOff: { backgroundColor: BLACK },
  btnText: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
  },

  /* RATING */
  ratingWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  ratingLabel: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    width: 32,
    height: 32,
    marginHorizontal: 4,
  },
});
