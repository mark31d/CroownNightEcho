// Components/SettingsContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

const STORAGE_KEY = '@user_settings_v1';

// сразу разрешаем воспроизводить в фоне (iOS)
Sound.setCategory('Playback');

export const SettingsContext = createContext({
  musicOn:   true,
  vibrationOn: true,
  toggleMusic:   () => {},
  toggleVibration: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [musicOn, setMusicOn]       = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);
  const [player, setPlayer]         = useState(null);

  // 1) загрузим настройки
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const { musicOn: m, vibrationOn: v } = JSON.parse(raw);
          setMusicOn(m);
          setVibrationOn(v);
        }
      } catch (e) {
        console.warn('Settings load failed', e);
      }

      // 2) создаём плеер на «bundle» файл
      const snd = new Sound(
        'bg_music.mp3',
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) {
            console.warn('failed to load sound', error);
            return;
          }
          // сразу запустим или нет
          if (musicOn) snd.play();
        }
      );
      // сделаем бесконечным
      snd.setNumberOfLoops(-1);
      setPlayer(snd);
    })();

    // при анмаунте выгружаем
    return () => {
      if (player) {
        player.stop(() => player.release());
      }
    };
  }, []);

  // 3) переключатель музыки
  useEffect(() => {
    if (!player) return;
    musicOn ? player.play() : player.pause();
    persist({ musicOn });
  }, [musicOn, player]);

  // 4) вибрация
  const toggleVibration = () => {
    Vibration.vibrate(50);
    setVibrationOn((prev) => {
      const next = !prev;
      persist({ vibrationOn: next });
      return next;
    });
  };

  const toggleMusic = () => setMusicOn((prev) => !prev);

  // сохраняем оба значения
  const persist = async (override = {}) => {
    const m = override.musicOn   ?? musicOn;
    const v = override.vibrationOn ?? vibrationOn;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ musicOn: m, vibrationOn: v }));
    } catch (e) {
      console.warn('Settings save failed', e);
    }
  };

  return (
    <SettingsContext.Provider
      value={{ musicOn, vibrationOn, toggleMusic, toggleVibration }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
