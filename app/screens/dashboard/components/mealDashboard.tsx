import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStore, { MealStatus } from "../../../../components/store";
import MealModal from "./MealModal";
import theme from "../../../../hooks/theme";

interface MealDashboardProps {
  setPerfectDay: (value: boolean) => void;
}

const MealDashboard: React.FC<MealDashboardProps> = ({ setPerfectDay }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<keyof MealStatus | null>(
    null
  );

  const currentDate = useStore((state) => state.currentDate);
  const dailyData = useStore((state) => state.dailyData[currentDate]);
  const points = dailyData?.points || 0;
  const totalPoints = useStore((state) => state.totalPoints);
  const level = useStore((state) => state.level);
  const updatePoints = useStore((state) => state.updatePoints);
  const recommendations = useStore((state) => state.recommendations);
  const status = dailyData?.status || {};
  const updateStatus = useStore((state) => state.updateStatus);

  useEffect(() => {
    if (
      status.Frühstück === "Richtig gegessen" &&
      status.Mittagessen === "Richtig gegessen" &&
      status.Abendessen === "Richtig gegessen" &&
      status.Snacks === "Richtig gegessen"
    ) {
      setPerfectDay(true);
    } else {
      setPerfectDay(false);
    }
  }, [status, setPerfectDay, updatePoints]);

  const openModal = (meal: keyof MealStatus) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const handleSelection = (selection: string) => {
    if (selectedMeal) {
      updateStatus(selectedMeal, selection);
      let pointsChange = 0;
      if (selection === "Richtig gegessen") pointsChange = 10;
      else if (selection === "Nichts gegessen") pointsChange = -5;
      else if (selection === "Zuviel gegessen") pointsChange = -10;
      updatePoints("Kalorieneintrag", pointsChange);
      setModalVisible(false);
    }
  };

  const openConfirmModal = (meal: keyof MealStatus) => {
    setSelectedMeal(meal);
    setConfirmModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMeal) {
      let pointsChange = 0;
      const currentStatus = status[selectedMeal];
      if (currentStatus === "Richtig gegessen") pointsChange = -10;
      else if (currentStatus === "Nichts gegessen") pointsChange = 5;
      else if (currentStatus === "Zuviel gegessen") pointsChange = 10;

      updateStatus(selectedMeal, "");
      updatePoints("Kalorieneintrag", pointsChange);
      setConfirmModalVisible(false);

      const allMealsTracked = Object.values(status).every(
        (mealStatus) => mealStatus === "Richtig gegessen"
      );
      if (allMealsTracked) {
        updatePoints("Perfect Day", -10); // Additional 10 points deduction for perfect day
      }
    }
  };

  const getButtonStyle = (mealStatus: string | null) => {
    switch (mealStatus) {
      case "Richtig gegessen":
      case "Cheat Meal":
        return [styles.completedButton, styles.completedButtonGreen];
      case "Zuviel gegessen":
        return [styles.completedButton, styles.completedButtonRed];
      case "Nichts gegessen":
        return [styles.completedButton, styles.completedButtonOrange];
      default:
        return styles.addButton;
    }
  };

  const getButtonIcon = (mealStatus: string | null) => {
    if (mealStatus === "Richtig gegessen" || mealStatus === "Cheat Meal") {
      return (
        <Ionicons
          name="reorder-two"
          size={24}
          color={theme.colors.primaryGreen100}
        />
      );
    } else if (mealStatus === "Zuviel gegessen") {
      return (
        <Ionicons
          name="arrow-up-outline"
          size={24}
          color={theme.colors.accentRed100}
        />
      );
    } else if (mealStatus === "Nichts gegessen") {
      return (
        <Ionicons
          name="arrow-down-outline"
          size={24}
          color={theme.colors.accentOrange100}
        />
      );
    } else {
      return (
        <Image
          source={require("../../../../assets/icons/plus.png")}
          style={styles.addButtonIcon}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {(
        [
          "Frühstück",
          "Mittagessen",
          "Abendessen",
          "Snacks",
        ] as (keyof MealStatus)[]
      ).map((meal) => (
        <View key={meal} style={styles.mealContainer}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealTitle}>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Text>
            <Text style={styles.caloriesText}>
              Ca. {recommendations[meal].min} - {recommendations[meal].max}{" "}
              Kalorien
            </Text>
          </View>
          {status[meal] ? (
            <TouchableOpacity
              style={getButtonStyle(status[meal])}
              onPress={() => openConfirmModal(meal)}
            >
              {getButtonIcon(status[meal])}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openModal(meal)}
            >
              <Image
                source={require("../../../../assets/icons/plus.png")}
                style={styles.addButtonIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <MealModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelection={handleSelection}
        meal={selectedMeal}
        recommendations={
          selectedMeal ? recommendations[selectedMeal] : { min: 0, max: 0 }
        }
      />
      <Modal
        visible={confirmModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>
              Möchtest du die Eingabe löschen?
            </Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.confirmButtonYes]}
                onPress={handleConfirmDelete}
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
    </View>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
    marginTop: -20,
    backgroundColor: theme.colors.secondaryBeige20,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  starIcon: {
    marginRight: 8,
  },
  levelText: {
    position: "absolute",
    fontSize: 18,
    color: theme.colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  pointsText: {
    marginTop: 8,
    fontSize: 16,
    color: theme.colors.white,
  },
  mealContainer: {
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
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
  },
  mealInfo: {
    flexDirection: "column",
  },
  mealTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
  },
  caloriesText: {
    fontSize: 14,
    color: "#888",
    fontFamily: theme.fonts.regular,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryBeige100,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonIcon: {
    width: 16,
    height: 16,
  },
  completedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  completedButtonGreen: {
    backgroundColor: "rgba(144, 238, 144, 0.5)", // Light green with transparency
  },
  completedButtonRed: {
    backgroundColor: "rgba(255, 0, 0, 0.5)", // Transparent red
  },
  completedButtonOrange: {
    backgroundColor: "rgba(255, 165, 0, 0.5)", // Transparent orange
  },
  completedButtonText: {
    fontSize: 24,
    color: theme.colors.white,
    fontFamily: theme.fonts.regular,
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
  },
  confirmModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "left",
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
    backgroundColor: theme.colors.accentRed100, // Rot
  },
  confirmButtonNo: {
    backgroundColor: theme.colors.primaryGreen100, // Grün
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.bold,
  },
});

export default MealDashboard;
