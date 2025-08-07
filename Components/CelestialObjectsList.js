// Components/CelestialObjectsList.js
import React, { useMemo, useState, useContext } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { ASTRO_OBJECTS } from '../Components/astroContent';
import { SavedContext } from '../Components/SavedContext';

const { width, height } = Dimensions.get('window');

/* ---- PALETTE (обновлено) ---- */
const GOLD  = '#A57C00';   // приглушённое золото
const DARK  = '#2C1A3F';   // глубокий фиолетовый
const WHITE = '#FFFFFF';
const BLACK = '#000000';

const FILTERS = ['All', 'Favourite', 'Stars', 'Planets', 'Constellation'];

/**
 * Контур для текста (8 копий + основной слой)
 */
const OutlineText = ({ children, style, outlineColor = BLACK, outlineWidth = 1 }) => {
  const offsets = [
    { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
    { x:  0, y: -1 },                   { x:  0, y: 1 },
    { x:  1, y: -1 }, { x:  1, y: 0 }, { x:  1, y: 1 },
  ];
  return (
    <View style={{ position: 'relative' }}>
      {offsets.map((o, i) => (
        <Text
          key={i}
          style={[
            style,
            {
              color: outlineColor,
              position: 'absolute',
              left: o.x * outlineWidth,
              top:  o.y * outlineWidth,
            },
          ]}
        >
          {children}
        </Text>
      ))}
      <Text style={style}>{children}</Text>
    </View>
  );
};

export default function CelestialObjectsList() {
  const navigation = useNavigation();
  const { savedIds, toggleSaved } = useContext(SavedContext);

  const [filter, setFilter]     = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);

  const data = useMemo(() => {
    let items = ASTRO_OBJECTS;
    if (filter === 'Favourite') {
      items = items.filter(i => savedIds.has(i.id));
    } else if (filter === 'Stars') {
      items = items.filter(i => i.kind === 'star');
    } else if (filter === 'Planets') {
      items = items.filter(i => i.kind === 'planet');
    } else if (filter === 'Constellation') {
      items = items.filter(i => i.kind === 'constellation');
    }
    return items;
  }, [filter, savedIds]);

  const renderItem = ({ item }) => {
    const isFav = savedIds.has(item.id);

    return (
      <View style={styles.card}>
        {/* Превью + два угла */}
        <View style={styles.thumbWrap}>
          <Image source={item.image} style={styles.thumb} />
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[styles.thumbCorner, styles.thumbTL]}
            resizeMode="contain"
          />
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[styles.thumbCorner, styles.thumbBR, { transform: [{ rotate: '180deg' }] }]}
            resizeMode="contain"
          />
        </View>

        {/* Заголовок */}
        <View style={styles.titleBox}>
          <View style={styles.titleRow}>
            <Image
              source={require('../assets/logo.webp')}
              style={styles.crownIcon}
              resizeMode="contain"
            />
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          </View>
          <Text style={styles.subtitle}>({item.kind})</Text>
        </View>

        {/* Действия */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleSaved(item.id)}
            activeOpacity={0.8}
          >
            <Image
              source={
                isFav
                  ? require('../assets/star_filled.webp')
                  : require('../assets/star_outline.webp')
              }
              style={styles.favIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.readBlock}>
            <TouchableOpacity
              style={styles.readBtn}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            >
              <OutlineText style={styles.readText} outlineWidth={2}>
                READ
              </OutlineText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require('../assets/splash_background.webp')}
        style={styles.background}
      >
        {/* Назад */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.85}
        >
          <Image source={require('../assets/ic_back.webp')} style={[styles.backIcon, { tintColor: WHITE }]} />
        </TouchableOpacity>

        {/* Фильтр */}
        <View style={styles.filterWrap}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.filterBtn}
            onPress={() => setMenuOpen(v => !v)}
          >
            <Text style={styles.filterText}>{filter}</Text>
            <Image source={require('../assets/ic_dropdown.webp')} style={[styles.dropIcon, { tintColor: WHITE }]} />
          </TouchableOpacity>

          {menuOpen && (
            <View style={styles.menu}>
              {FILTERS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.menuItem}
                  onPress={() => {
                    setFilter(opt);
                    setMenuOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.menuText,
                      opt === filter && styles.menuTextActive
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Список */}
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          extraData={savedIds}
          ListFooterComponent={() => (
            <Image
              source={require('../assets/skv.webp')}
              style={styles.brandImg}
              resizeMode="contain"
            />
          )}
        />
      </ImageBackground>
    </View>
  );
}

const CARD_H = 164;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK },

  background: {
    flex: 1,
    width,
    height,
    paddingTop: (StatusBar.currentHeight || 30) + 8,
  },

  backBtn: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 30) + 6,
    left: 12,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: WHITE,
  },
  backIcon: { width: 50, height: 50 },

  filterWrap: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 30) + 6,
    right: 12,
    zIndex: 10,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK,
    borderWidth: 2,
    borderColor: WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  filterText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  dropIcon: { width: 14, height: 10 },

  menu: {
    marginTop: 8,
    backgroundColor: DARK,
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 180,
  },
  menuItem: { paddingVertical: 8 },
  menuText: {
    color: WHITE,
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuTextActive: { color: GOLD },

  listContent: {
    paddingTop: 60,
    paddingHorizontal: 10,
    paddingBottom: 28,
  },

  card: {
    minHeight: CARD_H,
    backgroundColor: DARK,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbWrap: {
    width: 124,
    height: 124,
    borderRadius: 16,
    position: 'relative',
  },
  thumb: { width: '90%', height: '90%', borderRadius: 16, left: 10, top: 10 },
  thumbCorner: {
    position: 'absolute',
    width: 106,
    height: 80,
    opacity: 0.95,
    pointerEvents: 'none',
    zIndex: 2,
  },
  thumbTL: { top: -30, left: -16 },
  thumbBR: { bottom: -40, right: -30 },

  titleBox: {
    position: 'absolute',
    top: 10,
    right: 16,
    left: 150,
    alignItems: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  crownIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
    tintColor: GOLD,
  },
  title: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'right',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: WHITE,
    fontSize: 18,
    opacity: 0.9,
    textAlign: 'right',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  actions: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  favBtn: {
    marginRight: 10,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: { width: 30, height: 30, tintColor: WHITE },

  readBlock: {
    alignItems: 'center',
  },
  readBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: GOLD,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: WHITE,
  },
  readText: {
    color: WHITE,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },

  brandImg: {
    width: 52,
    height: 24,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 28,
    opacity: 0.9,
  },
});
