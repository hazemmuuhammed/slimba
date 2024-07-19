import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';
import OnboardingScreen4 from './OnboardingScreen4';
import OnboardingScreen5 from './OnboardingScreen5';
import OnboardingScreen6 from './OnboardingScreen6';
import LoadingScreen from './LoadingScreen';

import theme from '@/hooks/theme';

const Stack = createStackNavigator();

const OnboardingLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
        <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} />
        <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} />
        <Stack.Screen name="OnboardingScreen4" component={OnboardingScreen4} />
        <Stack.Screen name="OnboardingScreen5" component={OnboardingScreen5} />
        <Stack.Screen name="OnboardingScreen6" component={OnboardingScreen6} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    justifyContent: 'center',
    height: '100%',
  },
});

export default OnboardingLayout;
