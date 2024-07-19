import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useStore from '../../components/store';
import theme from '../../hooks/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Reanimated, { SlideInRight, FadeIn, FadeOut } from 'react-native-reanimated';

export default function OnboardingScreen1() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const setUserInfo = useStore((state) => state.setUserInfo);

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    setUserInfo(displayName, 0, 0, '', 1.2, '', 'male');
    router.push('/onboarding/OnboardingScreen2');
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: height / 2 - 100, animated: true });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Reanimated.View entering={SlideInRight.duration(1000)} style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </Reanimated.View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Reanimated.View entering={SlideInRight.duration(1000)} style={styles.imageContainer}>
            <Image source={require('../../assets/images/slimbavisualgym.jpg')} style={styles.image} />
          </Reanimated.View>
          <Reanimated.View entering={SlideInRight.duration(1000)} style={styles.contentContainer}>
            <Text style={styles.text}>Hey, ich bin <Text style={styles.textgreen}>Slimba </Text> und werde dir dabei helfen, <Text style={styles.textbold}>dein Wohlfühlgewicht zu erreichen und zu halten!</Text></Text>
            <Text style={styles.text}>Egal, ob du ein bisschen <Text style={styles.textbold}>abnehmen </Text>oder einfach <Text style={styles.textbold}>fitter </Text>werden möchtest – ich bin hier, um dich zu <Text style={styles.textbold}>motivieren </Text>und mit spielerischen Elementen zu <Text style={styles.textbold}>unterstützen.</Text></Text>
            <Text style={styles.text}>Doch bevor wir loslegen, möchte ich dich besser kennenlernen! Wie ist dein <Text style={styles.textbold}>Name?</Text></Text>
            <TextInput
              style={[styles.input, isFocused && styles.inputFocused]}
              placeholder="Dein Name"
              value={displayName}
              onChangeText={setDisplayName}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </Reanimated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footerContainer}>
        <View style={styles.buttonBackground}>
          <TouchableOpacity
            style={[styles.addButton, !displayName && styles.addButtonDisabled]}
            onPress={handleNext}
            disabled={!displayName}
          >
            <Ionicons name="arrow-forward" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondaryBeige60,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primaryGreen100,
  },
  imageContainer: {
    height: height * 0.38,
    justifyContent: 'center',
    backgroundColor: theme.colors.secondaryBeige20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    marginTop: -20,
    padding: 20,
    backgroundColor: theme.colors.secondaryBeige20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 20,
  },
  textbold: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 20,
  },
  textgreen: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primaryGreen100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: theme.colors.secondaryBeige100,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  inputFocused: {
    borderColor: theme.colors.primaryGreen100,
  },
  footerContainer: {
    backgroundColor: 'white',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: 0,
    margin: 20,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGreen100,
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.primaryGreen20,
  },
});
