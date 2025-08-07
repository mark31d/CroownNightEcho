// Components/achievementsStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ACH_KEY = '@achievements_v1';
export const ACH_COUNTERS = '@ach_counters_v1'; // { viewed, observed, rated, quizzes, completion }

export const ACH_IDS = {
  FULL_MOON:       'full_moon',        // first observed
  SHOOTING_STAR:   'shooting_star',    // viewed >= 5
  FIRST_READ:      'first_read',       // first detail open
  FIRST_RATING:    'first_rating',     // first rating > 0
  TELESCOPE:       'telescope',        // observed >= 15
  TROPHY:          'trophy',           // completion 100%
  RATING_MASTER:   'rating_master',    // rated >= 10
  QUIZ_WHIZ:       'quiz_whiz',        // first quiz passed
  ALL_QUIZZES:     'all_quizzes',      // all quizzes done
};

export const readAchSet = async () => {
  try { const raw = await AsyncStorage.getItem(ACH_KEY); return new Set(raw ? JSON.parse(raw) : []); }
  catch { return new Set(); }
};
export const writeAchSet = async (set) => {
  try { await AsyncStorage.setItem(ACH_KEY, JSON.stringify([...set])); } catch {}
};

/** Удобные алиасы под твои импорты в AchievementsGrid */
export const readAch = readAchSet;

/** Добавить достижение и вернуть актуальный Set */
export const addAch = async (id) => {
  const set = await readAchSet();
  if (!set.has(id)) {
    set.add(id);
    await writeAchSet(set);
  }
  return set;
};

/** Универсальная разблокировка; вернёт id, если прямо сейчас что-то открылось */
export const unlockIf = async (id) => {
  const set = await readAchSet();
  if (!set.has(id)) {
    set.add(id);
    await writeAchSet(set);
    return id;
  }
  return null;
};

export const readCounters = async () => {
  try {
    const raw = await AsyncStorage.getItem(ACH_COUNTERS);
    return raw ? JSON.parse(raw) : { viewed: 0, observed: 0, rated: 0, quizzes: 0, completion: 0 };
  } catch {
    return { viewed: 0, observed: 0, rated: 0, quizzes: 0, completion: 0 };
  }
};
export const writeCounters = async (c) => {
  try { await AsyncStorage.setItem(ACH_COUNTERS, JSON.stringify(c)); } catch {}
};

/** Утилита: инкремент счётчика и вернуть новый объект counters */
export const bumpCounter = async (key, delta = 1) => {
  const c = await readCounters();
  c[key] = (c[key] || 0) + delta;
  await writeCounters(c);
  return c;
};
