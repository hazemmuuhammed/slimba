import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStore from "../../components/store";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import theme from "../../hooks/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const genders = [
  { label: "Männlich", value: "male" },
  { label: "Weiblich", value: "female" },
];

export default function OnboardingScreen2() {
  const navigation = useNavigation<any>();
  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  useEffect(() => {
    validateForm();
  }, [weight, height, birthday, gender]);

  const validateForm = () => {
    if (weight && height && birthday && gender) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleNext = () => {
    if (isFormValid) {
      const newWeight = parseFloat(weight);
      const newHeight = parseFloat(height);
      const birthYear = parseInt(birthday.split(".")[2], 10);

      if (isNaN(newWeight) || isNaN(newHeight)) {
        Alert.alert(
          "Fehler",
          "Bitte gebe gültige numerische Werte für Gewicht und Größe ein."
        );
        return;
      }

      if (newWeight < 30 || newWeight > 350) {
        Alert.alert("Fehler", "Gewicht muss zwischen 30 und 350 kg liegen.");
        return;
      }

      if (newHeight < 120 || newHeight > 250) {
        Alert.alert("Fehler", "Größe muss zwischen 120 und 250 cm liegen.");
        return;
      }

      if (birthYear < 1900) {
        Alert.alert("Fehler", "Geburtsjahr muss nach 1900 liegen.");
        return;
      }

      setUserInfo(
        userInfo.displayName,
        newWeight,
        newHeight,
        birthday,
        userInfo.activityLevel,
        userInfo.goal,
        gender
      );
      navigation.navigate("OnboardingScreen3");
    } else {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
    setBirthday(formattedDate);
    hideDatePicker();
  };

  const handleFocus = (inputName: string) => {
    setActiveInput(inputName);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={[styles.progressDot, styles.activeDot]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <Text style={styles.text}>
              <Text style={styles.text}>
                Cool! Freut mich dich kennenzulernen
              </Text>{" "}
              <Text style={styles.boldText}>{userInfo.displayName}</Text>!
            </Text>
            <Text style={styles.text}>
              Um dir{" "}
              <Text style={styles.boldText}>maßgeschneiderte Empfehlungen</Text>{" "}
              geben zu können, brauche ich noch ein paar{" "}
              <Text style={styles.boldText}>persönliche Infos</Text> von dir.
            </Text>
            <View style={styles.separator} />
            <Text style={styles.label}>Wie viel wiegst du aktuell?</Text>
            <TextInput
              style={[
                styles.input,
                activeInput === "weight" && styles.activeInput,
              ]}
              placeholder="(kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
              onFocus={() => handleFocus("weight")}
              onBlur={handleBlur}
            />
            <Text style={styles.label}>Wie groß bist du?</Text>
            <TextInput
              style={[
                styles.input,
                activeInput === "height" && styles.activeInput,
              ]}
              placeholder="(cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
              onFocus={() => handleFocus("height")}
              onBlur={handleBlur}
            />
            <Text style={styles.label}>Wann hast du Geburtstag?</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={[styles.input, !birthday && styles.placeholderText]}>
                {birthday || "dd.mm.jjjj"}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={new Date(1990, 0, 1)} // Standarddatum auf 01.01.1990
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Text style={styles.label}>
              Mit welchem Geschlecht wurdest du geboren?
            </Text>
            <RNPickerSelect
              onValueChange={(value) => setGender(value as "female" | "male")}
              items={genders}
              value={gender}
              style={pickerSelectStyles}
              placeholder={{ label: "Bitte Geschlecht auswählen", value: null }}
            />
            <View style={styles.separator} />
            <Text style={styles.text}>
              Keine Sorge,{" "}
              <Text style={styles.boldText}>deine Individualität </Text>steht
              bei mir an erster Stelle und ich respektiere sie voll und ganz!
            </Text>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <View style={styles.buttonBackground}>
            <TouchableOpacity
              style={[
                styles.addButton,
                !isFormValid && {
                  backgroundColor: theme.colors.primaryGreen20,
                },
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
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBeige20,
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
  boldText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    color: theme.colors.black,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  activeInput: {
    borderColor: theme.colors.primaryGreen100,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  placeholderText: {
    color: theme.colors.grey,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: 40,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: theme.colors.black,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputAndroid: {
    width: "100%",
    height: 40,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: theme.colors.black,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
