import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useStore from "./store";
import theme from "../hooks/theme";

interface ActiveChallengesProps {
  visible: boolean;
  onClose: () => void;
}

const ActiveChallenges: React.FC<ActiveChallengesProps> = ({
  visible,
  onClose,
}) => {
  const activeChallenge = useStore((state) => state.activeChallenge);
  const navigation = useNavigation<any>();

  const handleDiscoverButtonPress = () => {
    onClose();
    navigation.navigate("Challenges"); // FIXME: replace with the challenges route
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={styles.modalContainer}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>Aktive Challenges</Text>
          {activeChallenge ? (
            <View style={styles.activeChallengeContainer}>
              <Text style={styles.activeChallengeTitle}>
                {activeChallenge.name}
              </Text>
              <Text style={styles.activeChallengeDescription}>
                {activeChallenge.description}
              </Text>
              <Text
                style={styles.activeChallengePoints}
              >{`Punkte: ${activeChallenge.points}`}</Text>
              <Text
                style={styles.activeChallengeDuration}
              >{`Tage verbleibend: ${
                activeChallenge.duration - useStore.getState().challengeProgress
              }`}</Text>
            </View>
          ) : (
            <Text style={styles.noActiveChallengeText}>
              Derzeit keine aktive Challenge
            </Text>
          )}
          <TouchableOpacity
            style={styles.discoverButton}
            onPress={handleDiscoverButtonPress}
          >
            <Text style={styles.discoverButtonText}>Challenges entdecken</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.secondaryBeige100,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 16,
  },
  activeChallengeContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    backgroundColor: theme.colors.secondaryBeige20,
    marginBottom: 16,
  },
  activeChallengeTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
    marginBottom: 10,
  },
  activeChallengeDescription: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 10,
  },
  activeChallengePoints: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 10,
  },
  activeChallengeDuration: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  noActiveChallengeText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 16,
  },
  discoverButton: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGreen100,
    justifyContent: "center",
    alignItems: "center",
  },
  discoverButtonText: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});

export default ActiveChallenges;
