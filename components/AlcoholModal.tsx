import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from './store';
import theme from '../hooks/theme';

interface AlcoholModalProps {
  visible: boolean;
  onClose: () => void;
}

const AlcoholModal: React.FC<AlcoholModalProps> = ({ visible, onClose }) => {
  const logAlcoholIntake = useStore((state) => state.logAlcoholIntake);

  const handleAddAlcoholIntake = (type: 'Klein' | 'Mittel' | 'Gross') => {
    logAlcoholIntake(type);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContainer} onTouchEnd={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Alkohol</Text>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Ein Getränk</Text>
              <Text style={styles.optionSubtitle}>Bier, Wein oder Ähnliches</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonYellow]}
              onPress={() => handleAddAlcoholIntake('Klein')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Zwei Getränke</Text>
              <Text style={styles.optionSubtitle}>Zwei Bier, zwei Wein oder Ähnliches</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonOrange]}
              onPress={() => handleAddAlcoholIntake('Mittel')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Übermäßiger Konsum</Text>
              <Text style={styles.optionSubtitle}>Drei oder mehr Getränke</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonRed]}
              onPress={() => handleAddAlcoholIntake('Gross')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    paddingRight: 8,
    paddingBottom: 8,
    paddingTop: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    borderRadius: 30,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  optionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonYellow: {
    backgroundColor: theme.colors.accentYellow,
  },
  optionButtonOrange: {
    backgroundColor: theme.colors.accentOrange100,
  },
  optionButtonRed: {
    backgroundColor: theme.colors.accentRed100,
  },
});

export default AlcoholModal;
