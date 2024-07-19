import { StyleSheet, Text, View, LogBox, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@/hooks/theme'; // Importiere das theme-Modul

LogBox.ignoreAllLogs();
console.warn = () => {};

const IndexScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/slimbavisualgym.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.welcomeText}></Text>
          </View>
          <TouchableOpacity style={styles.fullWidthButton} onPress={() => router.push('/onboarding/OnboardingScreen1')}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Jetzt loslegen</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.linkContainer}>
            <Text style={styles.infoText}>Du hast bereits ein Benutzerkonto?</Text>
            <Link href="/screens/dashboard">
              <Text style={styles.linkText}>Anmelden</Text>
            </Link>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBeige20, // Sekundärbeige Hintergrund
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    marginBottom: 20,
    color: theme.colors.primaryGreen100,
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: theme.colors.primaryGreen100,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  buttonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    color: theme.colors.white,
    textAlign: 'center',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  infoText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    marginBottom: 0,
  },
  linkText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: theme.colors.primaryGreen100,
    textDecorationLine: 'underline',
  },
});
