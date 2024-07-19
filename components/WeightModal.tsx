import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, Platform, Alert } from 'react-native';
import useStore from './store';
import theme from '../hooks/theme';

interface WeightModalProps {
  visible: boolean;
  onClose: () => void;
}

const WeightModal: React.FC<WeightModalProps> = ({ visible, onClose }) => {
  const currentWeight = useStore((state) => state.userInfo.weight);
  const lastWeightModalOpen = useStore((state) => state.lastWeightModalOpen);
  const updateWeight = useStore((state) => state.updateWeight);
  const updateWeightChange = useStore((state) => state.updateWeightChange);
  const updateLastWeightModalOpen = useStore((state) => state.updateLastWeightModalOpen);
  const [selectedWeight, setSelectedWeight] = useState<string>(currentWeight.toFixed(1));
  const [isModalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      const today = new Date().toDateString();
      if (lastWeightModalOpen === today) {
        Alert.alert('Hinweis', 'Das Gewicht kann nur einmal pro Tag geändert werden.');
        onClose();
      } else {
        setSelectedWeight(currentWeight.toFixed(1));
        setModalVisible(true);
      }
    } else {
      setModalVisible(false);
    }
  }, [visible, lastWeightModalOpen, currentWeight, onClose]);

  const handleSaveWeight = () => {
    const weight = parseFloat(selectedWeight);
    const weightChange = weight - currentWeight;
    if (weightChange <= 2 && weightChange >= -2 && !isNaN(weight)) {
      updateWeight(weight);
      updateWeightChange(weightChange); // Aktualisiere den Punktestand basierend auf der Gewichtsänderung
      updateLastWeightModalOpen();
      onClose();
    } else {
      Alert.alert('Fehler', 'Gewichtsänderung darf maximal 2 kg pro Tag betragen. Passe größere Änderungen in den Einstellungen im Profil an.');
    }
  };

  const handleWeightInputChange = (input: string) => {
    if (/^\d*\.?\d*$/.test(input)) {
      setSelectedWeight(input);
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isModalVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContainer} onTouchEnd={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Gewichtsänderung</Text>
          <TextInput
            style={styles.weightInput}
            value={selectedWeight}
            onChangeText={handleWeightInputChange}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWeight}>
            <Text style={styles.saveButtonText}>Neues Gewicht speichern</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.secondaryBeige100,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 16,
  },
  weightInput: {
    width: '100%',
    height: 40,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 18,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 20,
    width: '100%',
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
});

export default WeightModal;