import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useStore from "../../components/store"; // Importieren Sie den Store und die UserInfo-Schnittstelle
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from "react-native-picker-select";
import theme from "../../hooks/theme";

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

const genders = [
  { label: "Männlich", value: "male" },
  { label: "Weiblich", value: "female" },
];

export default function PersonalInfoScreen() {
  const navigation = useNavigation<any>();
  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);

  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [weight, setWeight] = useState(userInfo.weight.toString());
  const [height, setHeight] = useState(userInfo.height.toString());
  const [birthday, setBirthday] = useState(userInfo.birthday);
  const [activityLevel, setActivityLevel] = useState(
    userInfo.activityLevel.toString()
  );
  const [goal, setGoal] = useState(userInfo.goal);
  const [gender, setGender] = useState(userInfo.gender);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const handleSave = () => {
    const newWeight = parseFloat(weight);
    const newHeight = parseFloat(height);
    const birthYear = parseInt(birthday.split(".")[2], 10);
    const newActivityLevel = parseFloat(activityLevel);

    if (isNaN(newWeight) || isNaN(newHeight) || isNaN(newActivityLevel)) {
      Alert.alert(
        "Fehler",
        "Bitte geben Sie gültige numerische Werte für Gewicht, Größe und Aktivitätsniveau ein."
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
      displayName,
      newWeight,
      newHeight,
      birthday,
      newActivityLevel,
      goal,
      gender
    );
    Alert.alert("Erfolg", "Profil erfolgreich aktualisiert", [
      { text: "OK", onPress: () => navigation.navigate("Main") },
    ]);
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

  const getInputStyle = (inputName: string) => {
    return [styles.input, activeInput === inputName && styles.activeInput];
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={getInputStyle("displayName")}
            value={displayName}
            onChangeText={setDisplayName}
            onFocus={() => setActiveInput("displayName")}
            onBlur={() => setActiveInput(null)}
          />
          <Text style={styles.label}>Gewicht (kg)</Text>
          <TextInput
            style={getInputStyle("weight")}
            value={weight}
            onChangeText={setWeight}
            keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
            onFocus={() => setActiveInput("weight")}
            onBlur={() => setActiveInput(null)}
          />
          <Text style={styles.label}>Größe (cm)</Text>
          <TextInput
            style={getInputStyle("height")}
            value={height}
            onChangeText={setHeight}
            keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
            onFocus={() => setActiveInput("height")}
            onBlur={() => setActiveInput(null)}
          />
          <Text style={styles.label}>Geburtstag</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={[getInputStyle("birthday"), styles.birthdayInput]}>
              {birthday}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <Text style={styles.label}>Aktivitätsniveau</Text>
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.activityButton,
                activityLevel === level.value && styles.activeButton,
              ]}
              onPress={() => setActivityLevel(level.value)}
            >
              <Text style={styles.buttonLabel}>{level.label}</Text>
              <Text style={styles.buttonDescription}>{level.description}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.label}>Ziel</Text>
          {goals.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[
                styles.activityButton,
                goal === g.value && styles.activeButton,
              ]}
              onPress={() => setGoal(g.value)}
            >
              <Text style={styles.buttonText}>{g.label}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.label}>Geschlecht</Text>
          <RNPickerSelect
            onValueChange={(value: string) =>
              setGender(value as "male" | "female")
            }
            items={genders}
            value={gender}
            style={{
              ...pickerSelectStyles,
              inputIOS: [
                pickerSelectStyles.inputIOS,
                activeInput === "gender" && styles.activeInput,
              ],
              inputAndroid: [
                pickerSelectStyles.inputAndroid,
                activeInput === "gender" && styles.activeInput,
              ],
            }}
            placeholder={{ label: "Wählen Sie ein Geschlecht", value: null }}
            onOpen={() => setActiveInput("gender")}
            onClose={() => setActiveInput(null)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Speichern</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.secondaryBeige20,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 8,
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
  birthdayInput: {
    borderRadius: 10,
  },
  activeInput: {
    borderColor: theme.colors.primaryGreen100,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  activityButton: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  activeButton: {
    borderColor: theme.colors.primaryGreen100,
    borderWidth: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  buttonDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  saveButton: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryGreen100,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
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
