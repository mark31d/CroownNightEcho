// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* контекст для сохранённых наблюдений и настроек */
import { SavedProvider } from './Components/SavedContext';
import { SettingsProvider } from './Components/SettingsContext';

/* ваши новые экраны */
import Loader               from './Components/Loader';
import Onboarding           from './Components/Onboarding';
import HomeScreen           from './Components/HomeScreen';            // экран с кнопками Celestial Objects / Achievements / My Constellation / Settings
import CelestialObjectsList from './Components/CelestialObjectsList'; // список звёзд/планет
import ObjectDetail         from './Components/ObjectDetail';         // детали объекта + вопрос «What color is...»

import AchievementsGrid     from './Components/AchievementsGrid';     // сетка ачивок
import MyConstellation      from './Components/MyConstellation';      // «Favourite» (моё созвездие)
import SettingsScreen       from './Components/SettingsScreen';       // переключатели Music/Vibration, Share

const Stack = createStackNavigator();

export default function App() {
  // тема с чёрным фоном и белым текстом
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#000',
      card:       '#000',
      text:       '#FFF',
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <NavigationContainer theme={theme}>
        <SettingsProvider>
          <SavedProvider>
            <Stack.Navigator
              initialRouteName="Loader"
              screenOptions={{ headerShown: false }}
            >
              {/* Загрузка и онбординг */}
              <Stack.Screen name="Loader"     component={Loader} />
              <Stack.Screen name="Onboarding" component={Onboarding} />

              {/* Главное меню */}
              <Stack.Screen name="Home" component={HomeScreen} />

              {/* Celestial Objects → Detail → Observation */}
              <Stack.Screen
                name="Objects"
                component={CelestialObjectsList}
              />
              <Stack.Screen name="Detail"  component={ObjectDetail} />
       

              {/* Achievements */}
              <Stack.Screen
                name="Achievements"
                component={AchievementsGrid}
              />

              {/* My Constellation */}
              <Stack.Screen
                name="Constellation"
                component={MyConstellation}
              />

              {/* Settings */}
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
              />
            </Stack.Navigator>
          </SavedProvider>
        </SettingsProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
