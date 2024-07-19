import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Animated, Text, View, Modal, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Header from '@/components/header';
import Footer from '@/components/footer';
import MealDashboard from '@/components/mealDashboard';
import Davatar from '@/components/davatar';
import TipOfDayModal from '@/components/TipOfDayModal';
import useStore from '../../components/store';
import theme from '../../hooks/theme';
import quotes from '../../assets/quotes.json';

export default function Dashboard() {
  const router = useRouter();
  const currentDate = useStore((state) => state.currentDate);
  const points = useStore((state) => state.dailyData[currentDate]?.points || 0);
  const [prevPoints, setPrevPoints] = useState(points);
  const [pointsChange, setPointsChange] = useState<number | null>(null);
  const [isFabOpened, setIsFabOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPerfectDay, setShowPerfectDay] = useState(false);
  const [endChallengeModalVisible, setEndChallengeModalVisible] = useState(false); // Modal for challenge end
  const activeChallenge = useStore((state) => state.activeChallenge);
  const completeChallenge = useStore((state) => state.completeChallenge);
  const challengeProgress = useStore((state) => state.challengeProgress);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const prevDate = useRef(currentDate);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Wird geladen...');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote.quote);
    setAuthor(randomQuote.author);

    const timeout = setTimeout(() => {
      setLoadingMessage('Heute dauert es wiedermal länger. Es scheint, dass Slimba noch schläft. Prüfe deine Internet-Verbindung.');
    }, 12000); // Zeigt die Nachricht nach 12 Sekunden an

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const change = points - prevPoints;
    if (currentDate !== prevDate.current) {
      prevDate.current = currentDate;
      setPrevPoints(points);
    } else if (change !== 0) {
      setPointsChange(change);
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPointsChange(null);
      });
    }
    setPrevPoints(points);
  }, [points, currentDate]);

  useEffect(() => {
    if (showPerfectDay) {
      setTimeout(() => {
        setShowPerfectDay(false);
      }, 1000);
    }
  }, [showPerfectDay]);

  useEffect(() => {
    // Check if the challenge duration is met and show the modal
    if (activeChallenge && challengeProgress >= activeChallenge.duration) {
      setEndChallengeModalVisible(true);
    }
  }, [challengeProgress, activeChallenge]);

  const handleFabCloseOverlay = () => {
    Animated.timing(overlayAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFabOpened(false);
    });
  };

  const handleFabToggle = (isOpened: boolean) => {
    if (isOpened) {
      setIsFabOpened(true);
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }).start();
    } else {
      handleFabCloseOverlay();
    }
  };

  const handleChallengeEnd = (success: boolean) => {
    completeChallenge(success);
    setEndChallengeModalVisible(false);
  };

  const overlayStyle = {
    opacity: overlayAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7],
    }),
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ImageBackground
            source={require('../../assets/images/inspiration.jpg')}
            style={styles.loadingBackground}
          >
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{quote}"</Text>
              <Text style={styles.authorText}>- {author}</Text>
            </View>
            <View style={styles.loadingBottomContainer}>
              <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
              <Text style={styles.loadingMessage}>{loadingMessage}</Text>
            </View>
          </ImageBackground>
        </View>
      )}
      <Header />
      <View style={styles.content}>
        <Davatar style={styles.davatar} onLoad={() => setLoading(false)} />
        <View style={styles.mealDashboard}>
          <MealDashboard setPerfectDay={setShowPerfectDay} />
        </View>
      </View>
      {pointsChange !== null && (
        <Animated.View
          style={[
            styles.pointsChangeContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.pointsChangeText}>
            {pointsChange > 0 ? `+${pointsChange}` : pointsChange}
          </Text>
        </Animated.View>
      )}
      {showPerfectDay && (
        <Animated.View
          style={[
            styles.pointsChangeContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.pointsChangeText}>Perfect Day!</Text>
        </Animated.View>
      )}
      {isFabOpened && (
        <Animated.View style={[styles.fabOverlay, overlayStyle]} />
      )}
      <Footer onCloseOverlay={handleFabCloseOverlay} onToggle={handleFabToggle} style={styles.footer} />

      <Modal
        transparent={true}
        visible={endChallengeModalVisible}
        animationType="slide"
        onRequestClose={() => setEndChallengeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>Hast du die Challenge bestanden?</Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity style={[styles.confirmButton, styles.confirmButtonYes]} onPress={() => handleChallengeEnd(true)}>
                <Text style={styles.confirmButtonText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, styles.confirmButtonNo]} onPress={() => handleChallengeEnd(false)}>
                <Text style={styles.confirmButtonText}>Nein</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  davatar: {
    flex: 0.9,
  },
  mealDashboard: {
    flex: 1,
  },
  pointsChangeContainer: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsChangeText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryGreen100,
    zIndex: 3,
  },
  loadingBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
    fontFamily: theme.fonts.semiBold,
  },
  authorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: theme.fonts.regular,
  },
  loadingBottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loadingIndicator: {
    marginBottom: 10,
  },
  loadingMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: theme.fonts.regular,
  },
  fabOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(251, 203, 145, 0.7)',
    zIndex: 1,
  },
  footer: {
    zIndex: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  confirmModalContent: {
    width: '80%',
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  confirmModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    fontFamily: theme.fonts.regular,
  },
  confirmButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  confirmButtonYes: {
    backgroundColor: theme.colors.primaryGreen100,
  },
  confirmButtonNo: {
    backgroundColor: theme.colors.accentRed100,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.semiBold,
  },
});
