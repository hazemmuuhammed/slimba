import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useStore from '@/components/store'; // Import the zustand store

const DayStreak = () => {
  const consecutiveDays = useStore(state => state.consecutiveDays); // Get consecutive days from store

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{consecutiveDays} Day Streak</Text>
    </View>
  );
};

export default DayStreak;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2, // Ensure text is above other content
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    padding: 5,
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
