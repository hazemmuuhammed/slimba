import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from './store';
import theme from '../hooks/theme';

interface ActivityModalProps {
  visible: boolean;
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ visible, onClose }) => {
  const logSportActivity = useStore((state) => state.logSportActivity);

  const handleAddActivity = (type: 'Klein' | 'Mittel' | 'Gross') => {
    logSportActivity(type);
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
          <Text style={styles.title}>Aktivität</Text>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Leichte Aktivität</Text>
              <Text style={styles.optionSubtitle}>Bis zu 30 Minuten</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonGreenLight]}
              onPress={() => handleAddActivity('Klein')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Mittlere Aktivität</Text>
              <Text style={styles.optionSubtitle}>30-60 Minuten</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonGreenMedium]}
              onPress={() => handleAddActivity('Mittel')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Grosse Aktivität</Text>
              <Text style={styles.optionSubtitle}>Mehr als 60 Minuten</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonGreenDark]}
              onPress={() => handleAddActivity('Gross')}
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
  optionButtonGreenLight: {
    backgroundColor: theme.colors.primaryGreen40,
  },
  optionButtonGreenMedium: {
    backgroundColor: theme.colors.primaryGreen60,
  },
  optionButtonGreenDark: {
    backgroundColor: theme.colors.primaryGreen80,
  },
});

export default ActivityModal;
