// MealModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../hooks/theme";
import useStore, { MealStatus } from "../../../../components/store";
import MealSuggestionModal from "../../../../components/MealSuggestionProps";

interface MealModalProps {
  visible: boolean;
  onClose: () => void;
  onSelection: (selection: string) => void;
  meal: keyof MealStatus | null;
  recommendations: { min: number; max: number };
}

const MealModal: React.FC<MealModalProps> = ({
  visible,
  onClose,
  onSelection,
  meal,
  recommendations,
}) => {
  const [confirmCheatMealVisible, setConfirmCheatMealVisible] = useState(false);
  const [mealSuggestionVisible, setMealSuggestionVisible] = useState(false);
  const cheatMealsRemaining = useStore((state) => state.cheatMealsRemaining);
  const useCheatMeal = useStore((state) => state.useCheatMeal);
  const updateStatus = useStore((state) => state.updateStatus);

  const handleUseCheatMeal = () => {
    if (cheatMealsRemaining > 0 && meal) {
      useCheatMeal();
      updateStatus(meal, "Cheat Meal");
      setConfirmCheatMealVisible(false);
      onClose();
    } else {
      Alert.alert("Keine Cheat Meals übrig");
    }
  };

  const handleInfoPress = () => {
    onClose();
    setTimeout(() => {
      //navigte to calorie calculator
    }, 300); // Slight delay to allow modal to close
  };

  const handleInspirationPress = () => {
    setMealSuggestionVisible(true);
  };

  const handleMealSuggestionClose = () => {
    setMealSuggestionVisible(false);
  };

  if (!meal) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.primaryGreen100}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}> {meal}</Text>
              <View style={styles.cheatMealContainer}>
                <TouchableOpacity
                  style={styles.cheatMealButton}
                  onPress={() => {
                    if (cheatMealsRemaining > 0) {
                      setConfirmCheatMealVisible(true);
                    } else {
                      Alert.alert("Keine Cheat Meals übrig");
                    }
                  }}
                >
                  <Image
                    source={require("../../../../assets/icons/burger.png")}
                    style={styles.cheatMealIcon}
                  />
                  <Text style={styles.cheatMealText}>
                    {cheatMealsRemaining}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.inspirationButton}
                  onPress={handleInspirationPress}
                >
                  <Image
                    source={require("../../../../assets/icons/inspiration.png")}
                    style={styles.inspirationIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={handleInfoPress}
                >
                  <Ionicons
                    name="help-outline"
                    size={26}
                    color={theme.colors.primaryGreen100}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.spaceContainer}></View>
              <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Weniger/nichts</Text>
                <TouchableOpacity
                  style={[styles.optionButton, styles.lessButton]}
                  onPress={() => {
                    onSelection("Nichts gegessen");
                    onClose();
                  }}
                >
                  <Ionicons
                    name="arrow-down-outline"
                    size={24}
                    color={theme.colors.accentOrange100}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.optionContainer}>
                <Text style={[styles.optionText, styles.recommendationText]}>
                  Ca. {recommendations.min} - {recommendations.max} Kalorien
                </Text>
                <TouchableOpacity
                  style={[styles.optionButton, styles.recommendedButton]}
                  onPress={() => {
                    onSelection("Richtig gegessen");
                    onClose();
                  }}
                >
                  <Ionicons
                    name="reorder-two"
                    size={24}
                    color={theme.colors.primaryGreen100}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Mehr</Text>
                <TouchableOpacity
                  style={[styles.optionButton, styles.moreButton]}
                  onPress={() => {
                    onSelection("Zuviel gegessen");
                    onClose();
                  }}
                >
                  <Ionicons
                    name="arrow-up-outline"
                    size={24}
                    color={theme.colors.accentRed100}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Confirm Cheat Meal Modal */}
      <Modal
        visible={confirmCheatMealVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.centeredModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>
              Bist du sicher, dass du dein Cheat Meal einsetzen möchtest?
            </Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonYes]}
                onPress={handleUseCheatMeal}
              >
                <Text style={styles.confirmButtonText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonNo]}
                onPress={() => setConfirmCheatMealVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Nein</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Meal Suggestion Modal */}
      <MealSuggestionModal
        visible={mealSuggestionVisible}
        onClose={handleMealSuggestionClose}
        meal={meal}
        recommendations={recommendations}
      />
    </Modal>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: theme.colors.secondaryBeige20,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
    height: height * 0.5, // Updated to 50% of the screen height
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
  },
  cheatMealContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    right: 60,
  },
  cheatMealButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: 7,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 30,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  cheatMealIcon: {
    width: 25,
    height: 25,
  },
  cheatMealText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    marginLeft: 10,
    color: theme.colors.primaryGreen100,
  },
  inspirationButton: {
    marginLeft: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 6,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  inspirationIcon: {
    width: 24,
    height: 24,
  },
  infoButton: {
    marginLeft: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 6,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 24,
    paddingRight: 8,
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
  },
  recommendationText: {
    color: theme.colors.primaryGreen100,
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  lessButton: {
    backgroundColor: "rgba(255, 165, 0, 0.5)", // Transparent orange
  },
  recommendedButton: {
    backgroundColor: "rgba(144, 238, 144, 0.5)", // Light green with transparency
  },
  moreButton: {
    backgroundColor: "rgba(255, 0, 0, 0.5)", // Transparent red
  },
  confirmModalContent: {
    width: "80%",
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  confirmModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
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
    backgroundColor: theme.colors.accentRed100,
  },
  confirmButtonNo: {
    backgroundColor: theme.colors.primaryGreen100,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.bold,
  },
  spaceContainer: {
    height: 20,
    borderTopWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
  },
});

export default MealModal;
