import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Asset } from "expo-asset";
import theme from "@/hooks/theme";
import IndexScreen from "./index";
import MainDrawerNavigator from "./screens/drawerNavigator";
// import OnboardingLayout from "./onboarding/_layout";
import CalorieCalculator from "./screens/calorieCalculator/calorieCalculator";
import LoadingScreen from "./onboarding/LoadingScreen";
import OnboardingScreen1 from "./onboarding/OnboardingScreen1";
import OnboardingScreen2 from "./onboarding/OnboardingScreen2";
import OnboardingScreen3 from "./onboarding/OnboardingScreen3";
import OnboardingScreen4 from "./onboarding/OnboardingScreen4";
import OnboardingScreen5 from "./onboarding/OnboardingScreen5";
import OnboardingScreen6 from "./onboarding/OnboardingScreen6";
import ChallengesScreen from "./screens/challenges/Challenges";

export type RootStackParamList = {
  Index: undefined;
  Main: undefined;
  Onboarding: undefined;
  CalorieCalculator: undefined;
  OnboardingScreen1: undefined;
  OnboardingScreen2: undefined;
  OnboardingScreen3: undefined;
  OnboardingScreen4: undefined;
  OnboardingScreen5: undefined;
  OnboardingScreen6: undefined;
  Challenges: undefined;
  LoadingScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootLayout: React.FC = () => {
  const [isAppReady, setAppReady] = useState(false);
  const [loaded] = useFonts({
    "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
    "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
  });

  useEffect(() => {
    const loadAssets = async () => {
      await Asset.loadAsync([require("../assets/models/Lion.glb")]);
      setAppReady(true);
      SplashScreen.hideAsync();
    };

    loadAssets();
  }, []);

  if (!loaded || !isAppReady) {
    return null;
  }

  const NavigationTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.white,
      text: theme.colors.black,
    },
  };

  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="Main" component={MainDrawerNavigator} />
        {/* <Stack.Screen name="Onboarding" component={OnboardingLayout} /> */}
        <Stack.Screen name="Challenges" component={ChallengesScreen} />
        <Stack.Screen name="CalorieCalculator" component={CalorieCalculator} />
        <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
        <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
        <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
        <Stack.Screen name="OnboardingScreen4" component={OnboardingScreen4} />
        <Stack.Screen name="OnboardingScreen5" component={OnboardingScreen5} />
        <Stack.Screen name="OnboardingScreen6" component={OnboardingScreen6} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootLayout;
