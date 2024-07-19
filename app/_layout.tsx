import 'react-native-gesture-handler';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Asset } from 'expo-asset';
import theme from '@/hooks/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [loaded] = useFonts({
    'Fredoka-Regular': require('../assets/fonts/Fredoka-Regular.ttf'),
    'Fredoka-SemiBold': require('../assets/fonts/Fredoka-SemiBold.ttf'),
    'Fredoka-Bold': require('../assets/fonts/Fredoka-Bold.ttf'),
  });

  useEffect(() => {
    const loadAssets = async () => {
      // Lade die Fonts und setze die App bereit
      setAppReady(true);
      SplashScreen.hideAsync();

      // Lade das Lion-Modell im Hintergrund
      await Asset.loadAsync([require('../assets/models/Lion.glb')]);
    };

    loadAssets();
  }, []);

  if (!loaded || !isAppReady) {
    return null;
  }

  const NavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.white,
      text: theme.colors.black,
    },
  };

  return (
    <ThemeProvider value={NavigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="screens/dashboard" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
