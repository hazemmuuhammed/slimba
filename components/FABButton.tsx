import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import SweetsModal from './SweetsModal';
import AlcoholModal from './AlcoholModal';
import ActivityModal from './ActivityModal';
import WeightModal from './WeightModal';
import ActiveChallenges from './ActiveChallenges'; // Import ActiveChallenges

const DURATION = 400;
const TRANSLATE_Y = -100;
const AUTO_CLOSE_DELAY = 5000; // 5 seconds

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FABButtonProps {
  onCloseOverlay?: () => void; // Optional function prop
  onToggle?: (isOpened: boolean) => void; // Callback for when the FAB is toggled
}

const FABButton: React.FC<FABButtonProps> = ({ onCloseOverlay, onToggle }) => {
  const [isSweetsModalVisible, setIsSweetsModalVisible] = useState(false);
  const [isAlcoholModalVisible, setIsAlcoholModalVisible] = useState(false);
  const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isActiveChallengesVisible, setIsActiveChallengesVisible] = useState(false); // State for ActiveChallenges modal
  const [isOpened, setIsOpened] = useState(false);
  const transYChallenge = useSharedValue(0);
  const transYAlcohol = useSharedValue(0);
  const transYScale = useSharedValue(0);
  const transYSweets = useSharedValue(0);
  const transYActivity = useSharedValue(0);

  useEffect(() => {
    if (isOpened) {
      const timer = setTimeout(() => {
        closeFAB();
      }, AUTO_CLOSE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isOpened]);

  const closeFAB = () => {
    transYChallenge.value = withTiming(0, { duration: DURATION });
    transYAlcohol.value = withDelay(DURATION / 2, withTiming(0, { duration: DURATION }));
    transYScale.value = withTiming(0, { duration: DURATION });
    transYSweets.value = withDelay(DURATION / 2, withTiming(0, { duration: DURATION }));
    transYActivity.value = withTiming(0, { duration: DURATION });
    setIsOpened(false);
    if (onCloseOverlay) onCloseOverlay();
    if (onToggle) onToggle(false); // Call onToggle with false when closing
  };

  const rChallengeAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(transYChallenge.value, [TRANSLATE_Y, 0], [-80, 0]) },
        { translateX: interpolate(transYChallenge.value, [TRANSLATE_Y, 0], [0, 0]) },
        { scale: interpolate(transYChallenge.value, [TRANSLATE_Y, 0], [1, 0]) }
      ],
    };
  }, []);

  const rAlcoholAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(transYAlcohol.value, [TRANSLATE_Y, 0], [TRANSLATE_Y / 2, 0]) },
        { translateX: interpolate(transYAlcohol.value, [TRANSLATE_Y, 0], [50, 0]) },
        { scale: interpolate(transYAlcohol.value, [TRANSLATE_Y, 0], [1, 0]) }
      ],
    };
  }, []);

  const rScaleAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(transYScale.value, [TRANSLATE_Y, 0], [0, 0]) },
        { translateX: interpolate(transYActivity.value, [TRANSLATE_Y, 0], [-80, 0]) },
        { scale: interpolate(transYScale.value, [TRANSLATE_Y, 0], [1, 0]) }
      ],
    };
  }, []);

  const rSweetsAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(transYSweets.value, [TRANSLATE_Y, 0], [TRANSLATE_Y / 2, 0]) },
        { translateX: interpolate(transYSweets.value, [TRANSLATE_Y, 0], [-50, 0]) },
        { scale: interpolate(transYSweets.value, [TRANSLATE_Y, 0], [1, 0]) }
      ],
    };
  }, []);

  const rActivityAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(transYActivity.value, [TRANSLATE_Y, 0], [0, 0]) },
        { translateX: interpolate(transYActivity.value, [TRANSLATE_Y, 0], [80, 0]) },
      ],
    };
  }, []);

  const handlePress = () => {
    if (isOpened) {
      closeFAB();
    } else {
      transYChallenge.value = withTiming(TRANSLATE_Y, { duration: DURATION });
      transYAlcohol.value = withDelay(DURATION / 2, withTiming(TRANSLATE_Y, { duration: DURATION }));
      transYScale.value = withDelay(DURATION / 2, withTiming(TRANSLATE_Y, { duration: DURATION }));
      transYSweets.value = withDelay(DURATION / 2, withTiming(TRANSLATE_Y, { duration: DURATION }));
      transYActivity.value = withTiming(TRANSLATE_Y, { duration: DURATION });
      setIsOpened(true);
      if (onToggle) onToggle(true); // Call onToggle with true when opening
    }
  };

  const handleOpenSweetsModal = () => {
    setIsSweetsModalVisible(true);
  };

  const handleCloseSweetsModal = () => {
    setIsSweetsModalVisible(false);
  };

  const handleOpenAlcoholModal = () => {
    setIsAlcoholModalVisible(true);
  };

  const handleCloseAlcoholModal = () => {
    setIsAlcoholModalVisible(false);
  };

  const handleOpenActivityModal = () => {
    setIsActivityModalVisible(true);
  };

  const handleCloseActivityModal = () => {
    setIsActivityModalVisible(false);
  };

  const handleOpenWeightModal = () => {
    setIsWeightModalVisible(true);
  };

  const handleCloseWeightModal = () => {
    setIsWeightModalVisible(false);
  };

  const handleOpenActiveChallenges = () => {
    setIsActiveChallengesVisible(true);
  };

  const handleCloseActiveChallenges = () => {
    setIsActiveChallengesVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => (pressed ? [styles.plusButton, { transform: [{ scale: 0.9 }] }] : styles.plusButton)}
      >
        <AntDesign name={isOpened ? "minus" : "plus"} size={36} color={'white'} />
      </Pressable>

      <AnimatedPressable style={[styles.challengeButton, rChallengeAnimateStyles]} onPress={handleOpenActiveChallenges}>
        <Image source={require('../assets/icons/challenge.png')} style={styles.challengeIcon} />
      </AnimatedPressable>

      <AnimatedPressable style={[styles.challengeButton, rAlcoholAnimateStyles]} onPress={handleOpenAlcoholModal}>
        <Image source={require('../assets/icons/alcohol.png')} style={styles.challengeIcon} />
      </AnimatedPressable>

      <AnimatedPressable style={[styles.challengeButton, rScaleAnimateStyles]} onPress={handleOpenWeightModal}>
        <Image source={require('../assets/icons/scale.png')} style={styles.challengeIcon} />
      </AnimatedPressable>

      <AnimatedPressable style={[styles.challengeButton, rSweetsAnimateStyles]} onPress={handleOpenSweetsModal}>
        <Image source={require('../assets/icons/sweets.png')} style={styles.challengeIcon} />
      </AnimatedPressable>

      <AnimatedPressable style={[styles.challengeButton, rActivityAnimateStyles]} onPress={handleOpenActivityModal}>
        <Image source={require('../assets/icons/activity.png')} style={styles.challengeIcon} />
      </AnimatedPressable>

      <SweetsModal visible={isSweetsModalVisible} onClose={handleCloseSweetsModal} />
      <AlcoholModal visible={isAlcoholModalVisible} onClose={handleCloseAlcoholModal} />
      <ActivityModal visible={isActivityModalVisible} onClose={handleCloseActivityModal} />
      <WeightModal visible={isWeightModalVisible} onClose={handleCloseWeightModal} />
      <ActiveChallenges visible={isActiveChallengesVisible} onClose={handleCloseActiveChallenges} />
    </View>
  );
};

export default FABButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007B40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#66B08C',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: -1,
  },
  challengeIcon: {
    width: 28,
    height: 28,
  },
});
