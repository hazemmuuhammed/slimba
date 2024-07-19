import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import theme from '../../hooks/theme';

export default function OnboardingScreen6() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/screens/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/avatar.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Onboarding Screen 6</Text>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.buttonBackground}>
          <TouchableOpacity style={styles.addButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Los geht's</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  imageContainer: {
    flex: 4.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 5,
    backgroundColor: theme.colors.secondaryBeige20,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginBottom: 20,
  },
  footerContainer: {
    flex: 0.9,
    backgroundColor: theme.colors.white,
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
    bottom: 30,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGreen100,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});
