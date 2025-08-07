// Components/AchievementsGrid.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { readAch, addAch } from '../Components/achievementsStore';

const { width, height } = Dimensions.get('window');

const GOLD  = '#D1AD38';
const DARK  = '#101F28';
const WHITE = '#FFFFFF';

/** ---- Данные ачивок ---- */
const ACHIEVEMENTS = [
  { id: 'full_moon',     title: 'FULL NIGHT SKY',    caption: 'You marked your first celestial object as observed. Welcome to the stars!', image: require('../assets/full_moon.webp') },
  { id: 'shooting_star', title: 'FULL NIGHT SKY',    caption: 'You’ve viewed 5 objects. The sky is opening up to you.',                     image: require('../assets/shooting_star.webp') },
  { id: 'first_read',    title: 'FIRST READ',        caption: 'You opened your first article. Knowledge is your telescope.',               image: require('../assets/first_read.webp') },
  { id: 'first_rating',  title: 'FIRST RATING',      caption: 'You rated your first object. Every opinion shapes the cosmos.',             image: require('../assets/first_rating.webp') },
  { id: 'telescope',     title: 'FULL NIGHT SKY',    caption: "You’ve observed 15+ objects. You're mapping the heavens.",                  image: require('../assets/telescope.webp') },
  { id: 'trophy',        title: 'SKY SEEKER TROPHY', caption: 'You’ve reached 100% completion in the celestial archive. A true sky seeker!',image: require('../assets/trophy.webp') },
  { id: 'rating_master', title: 'RATING MASTER',     caption: 'You’ve rated at least 10 objects. A connoisseur of the stars.',             image: require('../assets/rating_master.webp') },
  { id: 'quiz_whiz',     title: 'QUIZ WHIZ',         caption: 'You passed your first quiz. Your journey of understanding begins.',         image: require('../assets/quiz_whiz.webp') },
  { id: 'all_quizzes',   title: 'ALL QUIZZES DONE',  caption: 'You’ve completed all quizzes. You now read the sky like a story.',          image: require('../assets/all_quizzes.webp') },
];

/* размеры доски */
const BOARD_MARGIN_H = 10;
const BOARD_MARGIN_TOP = 22;
const BOARD_BORDER   = 2;
const BOARD_PAD_H    = 12;

const CELL_GAP = 16;
const NUM_COLS = 3;

const innerWidth = width - 2 * (BOARD_MARGIN_H + BOARD_BORDER + BOARD_PAD_H);
const CARD_W = (innerWidth - (NUM_COLS - 1) * CELL_GAP) / NUM_COLS;
const CARD_H = CARD_W * 1.35;

/* offset под стрелку внутри контейнера */
const BACK_SIZE = 42;
const BACK_TOP  = 10;
const BACK_LEFT = 10;
const LIST_TOP_PADDING = BACK_TOP + BACK_SIZE + 6;

export default function AchievementsGrid() {
  const navigation = useNavigation();
  const route = useRoute();
  const listRef = useRef(null);

  const [unlocked, setUnlocked]   = useState(new Set());
  const [selectedId, setSelected] = useState(null);

  const isUnlocked = (id) => unlocked.has(id);

  // Пришли с justUnlockedId — сохранить + проскроллить
  useEffect(() => {
    const justId = route.params?.justUnlockedId;
    if (!justId) return;

    (async () => {
      const stored = await addAch(justId);
      setUnlocked(stored);

      const index = ACHIEVEMENTS.findIndex(a => a.id === justId);
      if (index >= 0) {
        requestAnimationFrame(() => {
          setSelected(justId);
          listRef.current?.scrollToIndex({ index, viewPosition: 0.5, animated: true });
        });
      }
      // чистим param, чтобы не повторялось при back/forward
      navigation.setParams({ justUnlockedId: undefined, unlockedIds: undefined });
    })();
  }, [route.params?.justUnlockedId, navigation]);

  // Обновлять список при каждом фокусе (важно для входа с HomeScreen)
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const stored = await readAch();
        if (alive) setUnlocked(stored);
      })();
      return () => { alive = false; };
    }, [])
  );

  const onPressCard = (item) => {
    if (!isUnlocked(item.id)) return;
    setSelected((curr) => (curr === item.id ? null : item.id));
  };

  const renderItem = ({ item }) => {
    const opened = isUnlocked(item.id);
    const imgSource = opened ? item.image : require('../assets/back_card.webp');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPressCard(item)}
        style={styles.cell}
      >
        <View style={styles.card}>
          <Image source={imgSource} style={styles.cardImage} resizeMode="cover" />

          {!opened && (
            <View style={styles.lockWrap}>
              <Image source={require('../assets/ic_lock.webp')} style={styles.lockIcon} resizeMode="contain" />
            </View>
          )}

          {opened && selectedId === item.id && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={require('../assets/splash_background.webp')} style={styles.background}>
        {/* рамка-доска */}
        <View style={styles.board}>
          {/* Стрелка ВНУТРИ контейнера */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.85}>
            <Image source={require('../assets/ic_back.webp')} style={styles.backIcon} />
          </TouchableOpacity>

          {/* Логотип над списком */}
          <Image
            source={require('../assets/logo.webp')}
            style={styles.logo}
            resizeMode="contain"
          />

          <FlatList
            ref={listRef}
            data={ACHIEVEMENTS}
            numColumns={NUM_COLS}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            contentContainerStyle={[styles.listContent, { paddingTop: LIST_TOP_PADDING }]}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: CELL_GAP }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={9}
            getItemLayout={(_, index) => {
              const row = Math.floor(index / NUM_COLS);
              return {
                length: CARD_H + CELL_GAP,
                offset: row * (CARD_H + CELL_GAP),
                index,
              };
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

/* ---- Стили ---- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK },

  background: {
    flex: 1,
    width,
    height,
    paddingTop: (StatusBar.currentHeight || 30) + 6,
  },

  board: {
    flex: 1,
    marginTop: BOARD_MARGIN_TOP,
    marginHorizontal: BOARD_MARGIN_H,
    backgroundColor: DARK,
    borderWidth: BOARD_BORDER,
    borderColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: BOARD_PAD_H,
  },

  /* Стрелка внутри доски */
  backBtn: {
    position: 'absolute',
    top: BACK_TOP,
    left: BACK_LEFT,
    zIndex: 10,
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  backIcon: { width: 50, height: 50 },

  /* Логотип */
  logo: {
        position: 'absolute',
        top: -5,             // оставляем отступ от верха доски
        alignSelf: 'center',       // центрируем по горизонтали
        width: 120,                // задаём новую ширину
        height: 80,                // и высоту
        zIndex: 5,
        
      },

  listContent: {
    paddingBottom: 28, // запас под home-indicator
  },

  cell: {
    width: CARD_W,
    height: CARD_H,
  },

  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0b1220',
  },

  cardImage: { width: '100%', height: '100%' },

  lockWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5,10,18,0.35)',
  },
  lockIcon: { width: 68, height: 68, opacity: 0.92, tintColor: '#D9D9D9' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,18,28,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  overlayText: {
    color: WHITE,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '90%',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
