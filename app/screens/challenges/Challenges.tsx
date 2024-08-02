import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import useStore, { Challenge } from "../../../components/store";
import theme from "../../../hooks/theme";
import challengesData from "./services/challenges.json"; // Importieren der JSON-Daten
import { Ionicons } from "@expo/vector-icons";

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const activeChallenge = useStore((state) => state.activeChallenge);
  const participateChallenge = useStore((state) => state.participateChallenge);
  const cancelChallenge = useStore((state) => state.cancelChallenge);

  useEffect(() => {
    setChallenges(challengesData); // Setzen der Daten direkt
  }, []);

  const handleParticipate = (challenge: Challenge) => {
    if (activeChallenge) {
      Alert.alert("Fehler", "Es ist nur eine Challenge gleichzeitig möglich.");
      return;
    }
    setSelectedChallenge(challenge);
    setConfirmModalVisible(true);
  };

  const handleConfirmParticipate = () => {
    if (selectedChallenge) {
      participateChallenge(selectedChallenge);
      setConfirmModalVisible(false);
      setSelectedChallenge(null);
    }
  };

  const handleCancel = () => {
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    cancelChallenge();
    setCancelModalVisible(false);
  };

  const renderChallengeTitle = (title: string) => {
    const [firstWord, secondWord, ...rest] = title.split(" ");
    return (
      <Text style={styles.challengeTitle}>
        <Text style={styles.greenText}>
          {firstWord} {secondWord}{" "}
        </Text>
        {rest.join(" ")}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {activeChallenge && (
        <Text style={styles.subtitle}>
          Es ist nur eine Challenge gleichzeitig möglich
        </Text>
      )}
      <Text style={styles.challengesTitle}>Aktive Challenge</Text>
      {activeChallenge ? (
        <View style={styles.activeChallengeContainer}>
          <View style={styles.headerContainer}>
            {renderChallengeTitle(activeChallenge.name)}
            <View style={styles.pointsContainer}>
              <Image
                source={require("../../../assets/icons/star.png")}
                style={styles.starIcon}
              />
              <Text style={styles.pointsText}>{activeChallenge.points}</Text>
            </View>
          </View>
          <Text style={styles.activeChallengeDescription}>
            {activeChallenge.description}
          </Text>
          <Text style={styles.activeChallengeDuration}>{`Tage verbleibend: ${
            activeChallenge.duration - useStore.getState().challengeProgress
          }`}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleCancel}>
            <Text style={styles.actionButtonText}>Challenge abbrechen</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noActiveChallengeText}>Keine Challenge aktiv</Text>
      )}
      <Text style={styles.challengesTitle}>Verfügbare Challenges</Text>
      {challenges.map((challenge) => (
        <View key={challenge.id} style={styles.challengeContainer}>
          <View style={styles.headerContainer}>
            {renderChallengeTitle(challenge.name)}
            <View style={styles.pointsContainer}>
              <Image
                source={require("../../../assets/icons/star.png")}
                style={styles.starIcon}
              />
              <Text style={styles.pointsText}>{challenge.points}</Text>
            </View>
          </View>
          <Text style={styles.challengeDescription}>
            {challenge.description}
          </Text>
          {/* <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleParticipate(challenge)}
            disabled={!!activeChallenge}
          >
            <Text style={styles.actionButtonText}>Challenge starten</Text>
          </TouchableOpacity> */}
          {activeChallenge && <View style={styles.inactiveOverlay} />}
        </View>
      ))}

      <Modal
        transparent={true}
        visible={confirmModalVisible}
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>
              Möchtest du die Challenge starten?
            </Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonYes]}
                onPress={handleConfirmParticipate}
              >
                <Text style={styles.confirmButtonText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonNo]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Nein</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={cancelModalVisible}
        animationType="slide"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>
              Möchtest du die Challenge abbrechen?
            </Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButtonYes]}
                onPress={handleConfirmCancel}
              >
                <Text style={styles.confirmButtonText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButtonNo]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Nein</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.secondaryBeige20,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeChallengeContainer: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  activeChallengeTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  descriptionPointsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeChallengeDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginVertical: 10,
    flex: 1,
    marginRight: 10,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  pointsText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.accentOrange100,
  },
  activeChallengeDuration: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  actionButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primaryGreen100,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primaryGreen100,
  },
  noActiveChallengeText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 30,
  },
  challengesTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 10,
    textAlign: "left",
  },
  challengeContainer: {
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    position: "relative",
  },
  challengeTextContainer: {
    flex: 1,
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    textAlign: "left",
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginVertical: 5,
    textAlign: "left",
  },
  greenText: {
    color: theme.colors.primaryGreen100,
  },
  startButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primaryGreen100,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primaryGreen100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmModalContent: {
    width: "80%",
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
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
    textAlign: "center",
    width: "100%",
    fontFamily: theme.fonts.regular,
  },
  confirmButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  confirmButtonYes: {
    backgroundColor: theme.colors.primaryGreen100, // Grün
  },
  confirmButtonNo: {
    backgroundColor: theme.colors.accentRed100, // Rot
  },
  cancelButtonYes: {
    backgroundColor: theme.colors.accentRed100, // Rot
  },
  cancelButtonNo: {
    backgroundColor: theme.colors.primaryGreen100, // Grün
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.semiBold,
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(254, 245, 233, 0.8)",
    borderRadius: 10,
  },
});

export default ChallengesScreen;
