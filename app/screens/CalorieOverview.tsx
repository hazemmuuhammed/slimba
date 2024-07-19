import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import useStore from '../../components/store'; // Importieren Sie den Store und die UserInfo-Schnittstelle
import theme from '../../hooks/theme';

export default function CalorieOverviewScreen() {
  const router = useRouter();
  const recommendations = useStore((state) => state.recommendations);
  const calculateRecommendation = useStore((state) => state.calculateRecommendation);
  const mealPercentages = useStore((state) => state.mealPercentages);
  const updateMealPercentage = useStore((state) => state.updateMealPercentage);
  const resetMealPercentages = useStore((state) => state.resetMealPercentages);
  const setRecommendations = useStore((state) => state.setRecommendations);

  const [calories, setCalories] = useState(recommendations.totalCalories?.toString() || '');
  const [frühstück, setFrühstück] = useState(mealPercentages.Frühstück.toString());
  const [mittagessen, setMittagessen] = useState(mealPercentages.Mittagessen.toString());
  const [abendessen, setAbendessen] = useState(mealPercentages.Abendessen.toString());
  const [snacks, setSnacks] = useState(mealPercentages.Snacks.toString());
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    setFrühstück(mealPercentages.Frühstück.toString());
    setMittagessen(mealPercentages.Mittagessen.toString());
    setAbendessen(mealPercentages.Abendessen.toString());
    setSnacks(mealPercentages.Snacks.toString());
  }, [mealPercentages]);

  useEffect(() => {
    setCalories(recommendations.totalCalories?.toString() || '');
  }, [recommendations.totalCalories]);

  const roundTo10 = (num: number) => Math.round(num / 10) * 10;

  const handleSaveCalories = () => {
    const newCalories = parseFloat(calories);

    if (isNaN(newCalories)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige Kalorienzahl ein.');
      return;
    }

    // Berechnung der neuen Kalorienverteilung basierend auf den aktuellen Prozentsätzen
    const updatedFrühstück = roundTo10((newCalories * mealPercentages.Frühstück) / 100);
    const updatedMittagessen = roundTo10((newCalories * mealPercentages.Mittagessen) / 100);
    const updatedAbendessen = roundTo10((newCalories * mealPercentages.Abendessen) / 100);
    const updatedSnacks = roundTo10((newCalories * mealPercentages.Snacks) / 100);

    // Sicherstellen, dass keine Empfehlung unter 0 fällt
    if (updatedFrühstück < 0 || updatedMittagessen < 0 || updatedAbendessen < 0 || updatedSnacks < 0) {
      Alert.alert('Fehler', 'Kalorienverteilung darf nicht negativ sein.');
      return;
    }

    // Aktualisierung der Empfehlungen im Store
    setRecommendations('Frühstück', updatedFrühstück - 50, updatedFrühstück + 50);
    setRecommendations('Mittagessen', updatedMittagessen - 50, updatedMittagessen + 50);
    setRecommendations('Abendessen', updatedAbendessen - 50, updatedAbendessen + 50);
    setRecommendations('Snacks', updatedSnacks - 50, updatedSnacks + 50);

    // Aktualisierung der Gesamtkalorienzahl im Store
    useStore.setState((state) => ({
      recommendations: {
        ...state.recommendations,
        totalCalories: newCalories,
      }
    }));

    Alert.alert('Erfolg', 'Kalorienanzahl und Empfehlungen erfolgreich aktualisiert');
  };

  const handleResetCalories = () => {
    calculateRecommendation();
    const updatedRecommendations = useStore.getState().recommendations;
    setCalories(updatedRecommendations.totalCalories?.toString() || '');
  };

  const handleSavePercentages = () => {
    const totalPercentage = parseFloat(frühstück) + parseFloat(mittagessen) + parseFloat(abendessen) + parseFloat(snacks);

    if (totalPercentage !== 100) {
      Alert.alert('Fehler', 'Die Gesamtprozentzahl muss 100% betragen.');
      return;
    }

    const newCalories = parseFloat(calories);

    if (isNaN(newCalories)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige Kalorienzahl ein.');
      return;
    }

    const updatedFrühstück = parseFloat(frühstück) === 0 ? 0 : roundTo10((newCalories * parseFloat(frühstück)) / 100);
    const updatedMittagessen = parseFloat(mittagessen) === 0 ? 0 : roundTo10((newCalories * parseFloat(mittagessen)) / 100);
    const updatedAbendessen = parseFloat(abendessen) === 0 ? 0 : roundTo10((newCalories * parseFloat(abendessen)) / 100);
    const updatedSnacks = parseFloat(snacks) === 0 ? 0 : roundTo10((newCalories * parseFloat(snacks)) / 100);

    // Sicherstellen, dass keine Empfehlung unter 0 fällt
    if (updatedFrühstück < 0 || updatedMittagessen < 0 || updatedAbendessen < 0 || updatedSnacks < 0) {
      Alert.alert('Fehler', 'Kalorienverteilung darf nicht negativ sein.');
      return;
    }

    setRecommendations('Frühstück', updatedFrühstück - 50, updatedFrühstück + 50);
    setRecommendations('Mittagessen', updatedMittagessen - 50, updatedMittagessen + 50);
    setRecommendations('Abendessen', updatedAbendessen - 50, updatedAbendessen + 50);
    setRecommendations('Snacks', updatedSnacks - 50, updatedSnacks + 50);

    Alert.alert('Erfolg', 'Prozentsätze und Empfehlungen erfolgreich aktualisiert');
  };

  const handleResetPercentages = () => {
    resetMealPercentages();
    const newCalories = parseFloat(calories);
    const mealPercentages = useStore.getState().mealPercentages;

    const updatedFrühstück = roundTo10((newCalories * mealPercentages.Frühstück) / 100);
    const updatedMittagessen = roundTo10((newCalories * mealPercentages.Mittagessen) / 100);
    const updatedAbendessen = roundTo10((newCalories * mealPercentages.Abendessen) / 100);
    const updatedSnacks = roundTo10((newCalories * mealPercentages.Snacks) / 100);

    setRecommendations('Frühstück', updatedFrühstück - 50, updatedFrühstück + 50);
    setRecommendations('Mittagessen', updatedMittagessen - 50, updatedMittagessen + 50);
    setRecommendations('Abendessen', updatedAbendessen - 50, updatedAbendessen + 50);
    setRecommendations('Snacks', updatedSnacks - 50, updatedSnacks + 50);
  };

  const inputStyle = (field: string) => [
    styles.input,
    activeField === field && styles.activeInput
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Gesamtübersicht */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionSubtext}>Passe deine Aufteilung auf deine Bedürfnisse oder auf Empfehlung einer professionellen Ernährungsberatung an.</Text>

          <Text style={styles.label}>Tägliche Kalorienaufnahme</Text>
          <TextInput
            style={inputStyle('calories')}
            value={calories}
            onChangeText={setCalories}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            onFocus={() => setActiveField('calories')}
            onBlur={() => setActiveField(null)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCalories}>
              <Text style={styles.saveButtonText}>Speichern</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetCalories}>
              <Text style={styles.resetButtonText}>Zurücksetzen</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Kalorienempfehlungen */}
        <View style={[styles.sectionContainer, styles.highlightContainer]}>
          <Text style={styles.recommendationsTitle}>Empfehlung der Aufteilung</Text>
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationRow}>
              <Text style={styles.recommendation}>Frühstück:</Text>
              <Text style={styles.recommendationValue}>
                {Math.max(0, Math.round(recommendations.Frühstück.min))} - {Math.max(0, Math.round(recommendations.Frühstück.max))} kcal
              </Text>
            </View>
            <View style={styles.recommendationRow}>
              <Text style={styles.recommendation}>Mittagessen:</Text>
              <Text style={styles.recommendationValue}>
                {Math.max(0, Math.round(recommendations.Mittagessen.min))} - {Math.max(0, Math.round(recommendations.Mittagessen.max))} kcal
              </Text>
            </View>
            <View style={styles.recommendationRow}>
              <Text style={styles.recommendation}>Abendessen:</Text>
              <Text style={styles.recommendationValue}>
                {Math.max(0, Math.round(recommendations.Abendessen.min))} - {Math.max(0, Math.round(recommendations.Abendessen.max))} kcal
              </Text>
            </View>
            <View style={styles.recommendationRow}>
              <Text style={styles.recommendation}>Snacks:</Text>
              <Text style={styles.recommendationValue}>
                {Math.max(0, Math.round(recommendations.Snacks.min))} - {Math.max(0, Math.round(recommendations.Snacks.max))} kcal
              </Text>
            </View>
            <View style={styles.recommendationRow}>
              <Text style={styles.totalRecommendation}>Tagesziel:</Text>
              <Text style={styles.totalRecommendationValue}>{recommendations.totalCalories} kcal</Text>
            </View>
          </View>

          <Text style={styles.label}>Frühstück (%)</Text>
          <TextInput
            style={inputStyle('frühstück')}
            value={frühstück}
            onChangeText={(value) => {
              setFrühstück(value);
              const percentage = parseFloat(value);
              if (!isNaN(percentage)) {
                updateMealPercentage('Frühstück', percentage);
              }
            }}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            onFocus={() => setActiveField('frühstück')}
            onBlur={() => setActiveField(null)}
          />

          <Text style={styles.label}>Mittagessen (%)</Text>
          <TextInput
            style={inputStyle('mittagessen')}
            value={mittagessen}
            onChangeText={(value) => {
              setMittagessen(value);
              const percentage = parseFloat(value);
              if (!isNaN(percentage)) {
                updateMealPercentage('Mittagessen', percentage);
              }
            }}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            onFocus={() => setActiveField('mittagessen')}
            onBlur={() => setActiveField(null)}
          />

          <Text style={styles.label}>Abendessen (%)</Text>
          <TextInput
            style={inputStyle('abendessen')}
            value={abendessen}
            onChangeText={(value) => {
              setAbendessen(value);
              const percentage = parseFloat(value);
              if (!isNaN(percentage)) {
                updateMealPercentage('Abendessen', percentage);
              }
            }}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            onFocus={() => setActiveField('abendessen')}
            onBlur={() => setActiveField(null)}
          />

          <Text style={styles.label}>Snacks (%)</Text>
          <TextInput
            style={inputStyle('snacks')}
            value={snacks}
            onChangeText={(value) => {
              setSnacks(value);
              const percentage = parseFloat(value);
              if (!isNaN(percentage)) {
                updateMealPercentage('Snacks', percentage);
              }
            }}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            onFocus={() => setActiveField('snacks')}
            onBlur={() => setActiveField(null)}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePercentages}>
              <Text style={styles.saveButtonText}>Speichern</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetPercentages}>
              <Text style={styles.resetButtonText}>Zurücksetzen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: theme.colors.secondaryBeige20,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  highlightContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
    marginBottom: 20,
  },
  sectionSubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  activeInput: {
    borderColor: theme.colors.primaryGreen100,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryGreen100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
  },
  resetButton: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.secondaryBeige80,
    marginVertical: 20,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginTop: 10,
    marginBottom: 20,
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recommendation: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  recommendationValue: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primaryGreen100,
  },
  totalRecommendation: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginTop: 10,
    paddingBottom: 20,
  },
  totalRecommendationValue: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
    paddingBottom: 10,
  },
});

