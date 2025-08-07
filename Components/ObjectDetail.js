// Components/ObjectDetail.js
import React, { useMemo, useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Video from 'react-native-video'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ASTRO_OBJECTS, findById } from '../Components/astroContent'
import { SavedContext } from '../Components/SavedContext'

import {
  ACH_IDS,
  unlockIf,
  readCounters,
  writeCounters,
  bumpCounter,
} from '../Components/achievementsStore'

const { width, height } = Dimensions.get('window')

const GOLD = '#A57C00'
const DARK = '#2C1A3F'
const WHITE = '#FFFFFF'
const GREEN = '#1fb954'
const RED = '#d9534f'
const NOTE_SAVED_BG = '#205270'

const CARD_PADDING = 12
const BACK_SIZE = 42
const BACK_BOTTOM_SPACER = 10
const CARD_HEADER_OFFSET = BACK_SIZE + BACK_BOTTOM_SPACER

/* -------------------- ВОПРОСЫ -------------------- */
const QUESTIONS = {
  Sirius: {
    group: '⭐ STARS',
    question: 'What color is Sirius?',
    A: 'Blue-white',
    B: 'Red',
    correct: 'A',
  },
  Betelgeuse: {
    group: '⭐ STARS',
    question: 'What type of star is Betelgeuse?',
    A: 'Red supergiant',
    B: 'White dwarf',
    correct: 'A',
  },
  Vega: {
    group: '⭐ STARS',
    question: 'Which triangle is Vega part of?',
    A: 'Summer Triangle',
    B: 'Winter Triangle',
    correct: 'A',
  },
  Antares: {
    group: '⭐ STARS',
    question: 'Which planet is Antares compared to in color?',
    A: 'Mars',
    B: 'Venus',
    correct: 'A',
  },
  Polaris: {
    group: '⭐ STARS',
    question: 'What is Polaris best known for?',
    A: 'North Star',
    B: 'Closest star',
    correct: 'A',
  },
  Orion: {
    group: '✨ CONSTELLATIONS',
    question: 'How many stars make up Orion’s belt?',
    A: '3',
    B: '4',
    correct: 'A',
  },
  'Ursa Major': {
    group: '✨ CONSTELLATIONS',
    question:
      'The Big Dipper is part of which constellation?',
    A: 'Ursa Major',
    B: 'Ursa Minor',
    correct: 'A',
  },
  Cassiopeia: {
    group: '✨ CONSTELLATIONS',
    question: 'What shape is Cassiopeia known for?',
    A: 'W-shape',
    B: 'V-shape',
    correct: 'A',
  },
  Scorpius: {
    group: '✨ CONSTELLATIONS',
    question:
      'What is the name of the red star at the heart of Scorpius?',
    A: 'Antares',
    B: 'Vega',
    correct: 'A',
  },
  Lyra: {
    group: '✨ CONSTELLATIONS',
    question: 'Which star is the brightest in Lyra?',
    A: 'Vega',
    B: 'Sirius',
    correct: 'A',
  },
  Mars: {
    group: '🪐 PLANETS',
    question: 'What color is Mars often called?',
    A: 'The Red Planet',
    B: 'The Blue Planet',
    correct: 'A',
  },
  Venus: {
    group: '🪐 PLANETS',
    question: 'What time is Venus usually visible?',
    A: 'Sunrise or sunset',
    B: 'Midnight',
    correct: 'A',
  },
  Jupiter: {
    group: '🪐 PLANETS',
    question: 'What is Jupiter’s most famous feature?',
    A: 'Great Red Spot',
    B: 'Rings',
    correct: 'A',
  },
  Saturn: {
    group: '🪐 PLANETS',
    question: 'Why is Saturn visually unique?',
    A: 'It has visible rings',
    B: 'It glows green',
    correct: 'A',
  },
  Mercury: {
    group: '🪐 PLANETS',
    question: 'When can you observe Mercury?',
    A: 'Just after sunset',
    B: 'Around midnight',
    correct: 'A',
  },
}

const getVideoByKind = (kind) => {
  switch (kind) {
    case 'star':
      return require('../assets/video_star.mp4')
    case 'constellation':
      return require('../assets/video_constellation.mp4')
    case 'planet':
      return require('../assets/video_planet.mp4')
    default:
      return null
  }
}

// ключи для per-object хранения
const k = (id) => ({
  observed: `obs_${id}_observed`,
  rating: `obs_${id}_rating`,
  note: `obs_${id}_note`,
})

export default function ObjectDetail() {
  const navigation = useNavigation()
  const route = useRoute()
  const id = route.params?.id
  const item = useMemo(() => findById(id) || ASTRO_OBJECTS[0], [id])

  // контекст избранного
  const { savedIds, toggleSaved } = useContext(SavedContext)
  const isFav = savedIds.has(item.id)

  // локальные стейты
  const [selected, setSelected] = useState(null)
  const [observed, setObserved] = useState(false)
  const [rating, setRating] = useState(0)
  const [note, setNote] = useState('')
  const [savedOnce, setSavedOnce] = useState(false)

  const [initialObserved, setInitialObserved] = useState(false)
  const [initialRating, setInitialRating] = useState(0)

  const videoSrc = getVideoByKind(item.kind)
  const q = QUESTIONS[item.name] || null

  // загрузка сохранённых + savedOnce
  useEffect(() => {
    ;(async () => {
      try {
        const keys = k(item.id)
        const [obs, r, n] = await AsyncStorage.multiGet([
          keys.observed,
          keys.rating,
          keys.note,
        ])
        const obsBool = obs[1] === '1'
        const rateNum = parseInt(r[1] || '0', 10) || 0

        setObserved(obsBool)
        setInitialObserved(obsBool)
        setRating(rateNum)
        setInitialRating(rateNum)
        if (n[1] != null) setNote(n[1])

        if (
          obs[1] != null ||
          r[1] != null ||
          (n[1] != null && n[1] !== '')
        ) {
          setSavedOnce(true)
        }
      } catch {}
    })()
  }, [item.id])

  // первый просмотр → ачивки viewed, first_read, shooting_star
  useEffect(() => {
    ;(async () => {
      const counters = await bumpCounter('viewed', 1)
      const j1 = await unlockIf(ACH_IDS.FIRST_READ)
      if (j1) navigation.navigate('Achievements', { justUnlockedId: j1 })
      if (counters.viewed >= 5) {
        const j2 = await unlockIf(ACH_IDS.SHOOTING_STAR)
        if (j2)
          navigation.navigate('Achievements', {
            justUnlockedId: j2,
          })
      }
    })()
  }, [item.id])

  const handleSave = async () => {
    try {
      const keys = k(item.id)
      await AsyncStorage.multiSet([
        [keys.observed, observed ? '1' : '0'],
        [keys.rating, String(rating || 0)],
        [keys.note, note || ''],
      ])
      setSavedOnce(true)

      let justId = null
      const counters = await readCounters()

      if (!initialObserved && observed) {
        counters.observed = (counters.observed || 0) + 1
        const j = await unlockIf(ACH_IDS.FULL_MOON)
        if (j) justId = j
      }
      if (initialRating === 0 && rating > 0) {
        counters.rated = (counters.rated || 0) + 1
        const j = await unlockIf(ACH_IDS.FIRST_RATING)
        if (j && !justId) justId = j
      }
      if ((counters.observed || 0) >= 15) {
        const j = await unlockIf(ACH_IDS.TELESCOPE)
        if (j && !justId) justId = j
      }
      if ((counters.rated || 0) >= 10) {
        const j = await unlockIf(ACH_IDS.RATING_MASTER)
        if (j && !justId) justId = j
      }
      if ((counters.completion || 0) === 100) {
        const j = await unlockIf(ACH_IDS.TROPHY)
        if (j && !justId) justId = j
      }

      await writeCounters(counters)

      if (justId) {
        navigation.navigate('Achievements', { justUnlockedId: justId })
      } else {
        navigation.goBack()
      }
    } catch {
      navigation.goBack()
    }
  }

  const getAnswerStyle = (btn) => {
    if (!selected) return null
    return selected === (q?.correct || 'A') && btn === selected
      ? styles.answerBtnActiveGreen
      : btn === selected
      ? styles.answerBtnActiveRed
      : null
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require('../assets/splash_background.webp')}
        style={styles.background}
      >
        <View style={styles.card}>
          <Image
            source={require('../assets/ornament_corner.webp')}
            style={[
              styles.corner,
              styles.cornerTR,
              { transform: [{ scaleX: -1 }] },
            ]}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardScrollInner}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.85}
            >
              <Image
                source={require('../assets/ic_back.webp')}
                style={styles.backIcon}
              />
            </TouchableOpacity>

            {/* Логотип сразу под стрелкой */}
            <Image
              source={require('../assets/logo.webp')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Отступ под логотип */}
            <View style={{ height: CARD_HEADER_OFFSET }} />

            {/* Верхний ряд: превью + видео */}
            <View style={styles.topRow}>
              <Image
                source={item.image}
                style={styles.preview}
                resizeMode="cover"
              />
              <View style={styles.previewRight}>
                {videoSrc ? (
                  <Video
                    source={videoSrc}
                    style={styles.video}
                    resizeMode="cover"
                    muted
                    repeat
                    paused={false}
                  />
                ) : (
                  <Image
                    source={item.image}
                    style={styles.video}
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>

            {/* Название + избранное */}
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => toggleSaved(item.id)}
                style={styles.favInlineBtn}
                activeOpacity={0.85}
              >
                <Image
                  source={
                    isFav
                      ? require('../assets/star_filled.webp')
                      : require('../assets/star_outline.webp')
                  }
                  style={styles.favInlineIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Описание и факты */}
            <View style={styles.paragraph}>
              <Text style={styles.lead}>Did you know?</Text>
              <Text style={styles.body}>{item.didYouKnow}</Text>
              {!!item.visibility && (
                <Text style={[styles.body, { marginTop: 6 }]}>
                  Visibility chance: {item.visibility}
                </Text>
              )}
            </View>

            {/* Буллеты */}
            <View style={styles.bullets}>
              <View style={styles.bulletRow}>
                <Image
                  source={require('../assets/ic_clock.webp')}
                  style={styles.bulletIcon}
                />
                <Text style={styles.bulletText}>
                  {item.observe.bestTime}
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Image
                  source={require('../assets/ic_cloud.webp')}
                  style={styles.bulletIcon}
                />
                <Text style={styles.bulletText}>
                  {item.observe.conditions}
                </Text>
              </View>
              <View style={styles.bulletRow}>
                <Image
                  source={require('../assets/ic_scope.webp')}
                  style={styles.bulletIcon}
                />
                <Text style={styles.bulletText}>
                  {item.observe.telescope}
                </Text>
              </View>
            </View>

            {/* Вопрос */}
            {QUESTIONS[item.name] && (
              <>
                <Text style={styles.sectionTitle}>
                  {QUESTIONS[item.name].group}
                </Text>
                <Text style={styles.questionTitle}>
                  {QUESTIONS[item.name].question}
                </Text>

                <View style={styles.answerRow}>
                  <TouchableOpacity
                    style={[styles.answerBtn, getAnswerStyle('A')]}
                    onPress={() => setSelected('A')}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.answerText} numberOfLines={0}>
                      A) {QUESTIONS[item.name].A}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.answerBtn, getAnswerStyle('B')]}
                    onPress={() => setSelected('B')}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.answerText} numberOfLines={0}>
                      B) {QUESTIONS[item.name].B}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Observed / Rating / Note */}
            <TouchableOpacity
              style={[styles.observeBtn, observed && styles.observeOn]}
              onPress={() => setObserved((v) => !v)}
              activeOpacity={0.9}
            >
              <Text style={styles.observeText}>
                {observed ? 'Observed' : 'Mark as observed'}
              </Text>
            </TouchableOpacity>

            {observed && (
              <>
                <Text
                  style={[styles.sectionTitle, { marginTop: 18 }]}
                >
                  How clearly did you see it tonight?
                </Text>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setRating(i)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={
                          rating >= i
                            ? require('../assets/star_filled.webp')
                            : require('../assets/star_outline.webp')
                        }
                        style={styles.ratingIcon}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={[
                    styles.note,
                    savedOnce && styles.noteSavedBg,
                  ]}
                  multiline
                  placeholder="Add Your Note"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={note}
                  onChangeText={setNote}
                />
              </>
            )}

            {/* Save */}
            <TouchableOpacity
              style={[styles.saveBtn, observed && styles.saveEnabled]}
              activeOpacity={0.9}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            {/* Footer brand */}
            <Image
              source={require('../assets/skv.webp')}
              style={styles.brandImg}
              resizeMode="contain"
            />
            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK },
  background: {
    flex: 1,
    width,
    height,
    paddingTop: (StatusBar.currentHeight || 30) + 6,
  },

  card: {
    position: 'relative',
    marginHorizontal: 10,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: DARK,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 16,
    padding: CARD_PADDING,
    overflow: 'hidden',
    flex: 1,
  },

  backBtn: {
    alignSelf: 'flex-start',
    width: BACK_SIZE,
    height: BACK_SIZE,
    borderRadius: BACK_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  backIcon: { width: 50, height: 50 },

  logo: {
    width: width * 0.9,
    height: 230,
    alignSelf: 'center',
    marginTop: -80,
    marginBottom: -70,
    zIndex:-1,
  },

  cardScrollInner: { paddingBottom: 16 },

  corner: {
    position: 'absolute',
    width: 72,
    height: 32,
    opacity: 0.9,
    pointerEvents: 'none',
  },
  cornerTR: { top: 6, right: 8 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  preview: {
    width:
      (width - 2 * (10 + CARD_PADDING) - 12) /
      2,
    height: 140,
    borderRadius: 14,
  },
  previewRight: { marginLeft: 12 },
  video: {
    width:
      (width - 2 * (10 + CARD_PADDING) - 12) /
      2,
    height: 140,
    borderRadius: 14,
    backgroundColor: '#000',
  },

  titleRow: {
    marginTop: 6,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    color: WHITE,
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'left',
    marginVertical: 6,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  favInlineBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginLeft: 8,
  },
  favInlineIcon: { width: 28, height: 28, tintColor: WHITE },

  paragraph: { marginTop: 6, paddingHorizontal: 4 },
  lead: { color: WHITE, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  body: { color: WHITE, fontSize: 16, lineHeight: 22 },

  bullets: { marginTop: 12, paddingHorizontal: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  bulletIcon: { width: 34, height: 34, marginRight: 12, tintColor: WHITE },
  bulletText: { color: WHITE, fontSize: 16, lineHeight: 22, flex: 1 },

  sectionTitle: {
    color: WHITE,
    fontSize: 22,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  questionTitle: {
    color: WHITE,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },

  answerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 10,
    marginHorizontal: 4,
  },
  answerBtn: {
    flexBasis: '48%',
    maxWidth: '48%',
    flexGrow: 1,
    flexShrink: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: WHITE,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  answerBtnActiveGreen: { backgroundColor: GREEN },
  answerBtnActiveRed: { backgroundColor: RED },
  answerText: {
    color: '#0b0f14',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    flexShrink: 1,
    includeFontPadding: false,
  },

  observeBtn: {
    alignSelf: 'center',
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: WHITE,
    backgroundColor: GOLD,
  },
  observeOn: { backgroundColor: GREEN },
  observeText: {
    color: '#0b0f14',
    fontWeight: '900',
    fontSize: 18,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 6,
  },
  ratingIcon: { width: 40, height: 40, tintColor: WHITE },

  note: {
    marginTop: 8,
    borderWidth: 3,
    borderColor: WHITE,
    borderRadius: 12,
    minHeight: 130,
    color: WHITE,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  noteSavedBg: { backgroundColor: NOTE_SAVED_BG },

  saveBtn: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: WHITE,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  saveEnabled: { backgroundColor: GREEN },
  saveText: { color: WHITE, fontSize: 20, fontWeight: '800' },

  brandImg: {
    alignSelf: 'flex-end',
    marginTop: 14,
    marginRight: 16,
    width: 52,
    height: 24,
    opacity: 0.95,
  },
})
