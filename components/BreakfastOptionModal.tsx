import React, { useState } from 'react'; // Import von useState hinzufügen
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons'; // Dieser Import wird im aktuellen Code nicht verwendet.
import RoundButton from './roundButton'; // Stellen Sie sicher, dass der Pfad korrekt ist.

// Interface für die Props der Komponente
interface BreakfastOptionsModalProps {
  isVisible: boolean;  // Boolean, der angibt, ob das Modal sichtbar ist
  onClose: () => void; // Funktion, die aufgerufen wird, um das Modal zu schließen
}

const BreakfastOptionsModal: React.FC<BreakfastOptionsModalProps> = ({ isVisible, onClose }) => {
  const [score, setScore] = useState(0); // Zustand für 'score' hinzufügen.

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Dein Frühstück</Text>
        {['Weniger/nichts', 'Ca. 420 - 620 Kalorien', 'Mehr'].map((option, index) => (
          <View style={styles.option} key={index}>
            <Text style={styles.optionText}>{option}</Text>
            <RoundButton points={10} onPress={() => setScore(score + 10)} color="#4CAF50" />
          </View>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: 300,
  },
  optionText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FFD580',
    borderRadius: 20,
    padding: 10,
  }
});

export default BreakfastOptionsModal;