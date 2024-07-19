import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import useStore from '../../components/store';
import theme from '../../hooks/theme';

const SettingsScreen: React.FC = () => {
  const resetMealEntriesAndLevel = useStore((state) => state.resetMealEntriesAndLevel);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const confirmResetPoints = () => {
    resetMealEntriesAndLevel();
    setModalVisible(false);
    alert('Punktestand und Mahlzeiten wurden zurückgesetzt.');
  };

  const deleteAccount = () => {
    // Hier fügst du deine Logik zum Löschen des Kontos hinzu
    alert('Dein Konto wurde erfolgreich gelöscht.');
  };

  const signOut = () => {
    // Hier fügst du deine Logik zum Abmelden hinzu
    alert('Du wurdest erfolgreich abgemeldet.');
  };

  const giveFeedback = () => {
    // Hier fügst du deine Logik für Feedback hinzu
    alert('Danke für dein Feedback!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Punktestand und Mahlzeiten zurücksetzen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Abmelden</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={deleteAccount}>
        <Text style={styles.buttonText}>Konto löschen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={giveFeedback}>
        <Text style={styles.buttonText}>Feedback geben</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>Bist du sicher, dass du den Punktestand und die Mahlzeiten zurücksetzen willst?</Text>
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity style={[styles.confirmButton, styles.confirmButtonYes]} onPress={confirmResetPoints}>
                <Text style={styles.confirmButtonText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, styles.confirmButtonNo]} onPress={() => setModalVisible(false)}>
                <Text style={styles.confirmButtonText}>Nein</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.secondaryBeige20,
  },
  button: {
    backgroundColor: theme.colors.white,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.black,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
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
  },
  confirmModalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
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
    backgroundColor: theme.colors.accentRed100,
  },
  confirmButtonNo: {
    backgroundColor: theme.colors.primaryGreen100,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});

export default SettingsScreen;
