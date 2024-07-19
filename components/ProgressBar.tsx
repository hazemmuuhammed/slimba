import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useStore from './store';
import theme from '../hooks/theme';

const levels = [
  { level: 1, threshold: 0, cumulative: 0 },
  { level: 2, threshold: 500, cumulative: 500 },
  { level: 3, threshold: 1000, cumulative: 1500 },
  { level: 4, threshold: 2000, cumulative: 3500 },
  { level: 5, threshold: 4000, cumulative: 7500 },
];

const ProgressBar: React.FC = () => {
  const points = useStore((state) => state.totalPoints);
  const currentLevel = useStore((state) => state.level);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Berechnen des aktuellen und nächsten Levels
  const currentLevelInfo = levels.find((level) => level.level === currentLevel);
  const nextLevelInfo = levels.find((level) => level.level === currentLevel + 1);

  if (!currentLevelInfo) {
    return null; // Falls Level-Informationen nicht gefunden werden
  }

  // Berechnung des Fortschritts
  const pointsInCurrentLevel = points - currentLevelInfo.cumulative;
  const pointsForNextLevel = nextLevelInfo ? nextLevelInfo.cumulative - currentLevelInfo.cumulative : 1; // Vermeiden von Division durch 0
  const progress = pointsInCurrentLevel / pointsForNextLevel;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    borderAnim.setValue(0);
    Animated.sequence([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [progress]);

  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.white, theme.colors.primaryGreen100],
  });

  return (
    <Animated.View style={[styles.progressBarContainer, { borderColor }]}>
      <View style={styles.progressBarWrapper}>
        <Animated.View style={[styles.progressBar, { width: animatedWidth }]}>
          <LinearGradient
            colors={[theme.colors.primaryGreen60, theme.colors.primaryGreen100]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View style={styles.stripesContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.stripe} />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10, // Updated to 15
    width: '100%',
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderStartWidth: 0,
    borderRadius: 0,
  },
  progressBarWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  stripesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space the stripes evenly
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingHorizontal: 2, // Add some padding to avoid stripes at the edges
  },
  stripe: {
    width: 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 10,
    color: theme.colors.black,
    textAlign: 'center',
    marginTop: 5, // Optional: Adds some spacing above the progress bar
  },
});

export default ProgressBar;
