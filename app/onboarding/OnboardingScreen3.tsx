import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStore from "../../components/store";
import theme from "../../hooks/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const activityLevels = [
  { label: "Sitzend", description: "wenig oder keine Bewegung", value: "1.2" },
  {
    label: "Leicht aktiv",
    description: "leichte Bewegung/Sport 1-3 Tage/Woche",
    value: "1.375",
  },
  {
    label: "Mäßig aktiv",
    description: "mäßige Bewegung/Sport 3-5 Tage/Woche",
    value: "1.55",
  },
  {
    label: "Sehr aktiv",
    description: "anstrengende Bewegung/Sport 6-7 Tage/Woche",
    value: "1.725",
  },
  {
    label: "Extrem aktiv",
    description: "sehr anstrengende Bewegung/Sport und körperliche Arbeit",
    value: "1.9",
  },
];

const goals = [
  { label: "Gewicht halten", value: "maintain" },
  { label: "Abnehmen", value: "abnehmen" },
  { label: "Zunehmen", value: "zunehmen" },
];

export default function OnboardingScreen3() {
  const navigation = useNavigation<any>();
  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);

  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    validateForm();
  }, [activityLevel, goal]);

  const validateForm = () => {
    if (activityLevel && goal) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleNext = () => {
    if (isFormValid) {
      const newActivityLevel = parseFloat(activityLevel);

      if (isNaN(newActivityLevel)) {
        Alert.alert("Fehler", "Bitte gebe ein gültiges Aktivitätsniveau ein.");
        return;
      }

      setUserInfo(
        userInfo.displayName,
        userInfo.weight,
        userInfo.height,
        userInfo.birthday,
        newActivityLevel,
        goal,
        userInfo.gender
      );
      navigation.navigate("OnboardingScreen4");
    } else {
      Alert.alert(
        "Fehler",
        "Bitte wähle sowohl ein Aktivitätsniveau als auch ein Ziel."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            Vielen Dank für dein Vertrauen
            <Text style={styles.boldText}> {userInfo.displayName}</Text>.
          </Text>
          <View style={styles.separator} />
          <Text style={styles.label}>
            Wie sieht dein <Text style={styles.boldText}>Aktivitätsniveau</Text>{" "}
            aus?
          </Text>
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.button,
                activityLevel === level.value && styles.activeButton,
              ]}
              onPress={() => setActivityLevel(level.value)}
            >
              <Text style={styles.buttonLabel}>{level.label}</Text>
              <Text style={styles.buttonDescription}>{level.description}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.separator} />
          <Text style={styles.label}>
            Welches <Text style={styles.boldText}>Ziel</Text> verfolgst du?
          </Text>
          {goals.map((g) => (
            <View key={g.value} style={styles.goalContainer}>
              <TouchableOpacity
                style={[styles.button, goal === g.value && styles.activeButton]}
                onPress={() => setGoal(g.value)}
              >
                <Text style={styles.buttonText}>{g.label}</Text>
              </TouchableOpacity>
              {goal === "zunehmen" && g.value === "zunehmen" && (
                <Text style={styles.additionalText}>
                  Die Gamification Elemente (Punkteverteilung) der App sind
                  zurzeit erst auf das Ziel "Abnehmen" ausgelegt. Zu einem
                  späteren Zeitpunkt wird dies auch auf das Ziel "Zunehmen"
                  angepasst. Du kannst die App aber dennoch nutzen.
                  Kalorienempfehlungen werden auch auf das Ziel "Zunehmen"
                  angepasst.
                </Text>
              )}
            </View>
          ))}
          <View style={styles.separator} />
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <View style={styles.buttonBackground}>
          <TouchableOpacity
            style={[
              styles.addButton,
              !isFormValid && { backgroundColor: theme.colors.primaryGreen20 },
            ]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: theme.colors.white,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondaryBeige60,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primaryGreen100,
  },
  imageContainer: {
    height: height * 0.38,
    justifyContent: "center",
    backgroundColor: theme.colors.secondaryBeige20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    marginTop: -20,
    padding: 20,
    backgroundColor: theme.colors.secondaryBeige20,
    paddingBottom: 40,
    paddingTop: 40,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.grey,
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 5,
  },
  boldText: {
    fontFamily: theme.fonts.semiBold,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: theme.colors.white,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.black,
    fontFamily: theme.fonts.semiBold,
  },
  buttonDescription: {
    fontSize: 14,
    color: theme.colors.black,
    fontFamily: theme.fonts.regular,
  },
  buttonText: {
    fontSize: 18,
    color: theme.colors.black,
    fontFamily: theme.fonts.regular,
  },
  activeButton: {
    borderColor: theme.colors.primaryGreen100,
    borderWidth: 2,
  },
  goalContainer: {
    marginBottom: 0,
  },
  additionalText: {
    fontSize: 12,
    color: theme.colors.black,
    marginTop: 5,
  },
  footerContainer: {
    backgroundColor: "white",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 0,
    margin: 20,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryGreen100,
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.primaryGreen20,
  },
});
