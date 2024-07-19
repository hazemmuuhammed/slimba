import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from './store';
import theme from '../hooks/theme';

interface SweetsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SweetsModal: React.FC<SweetsModalProps> = ({ visible, onClose }) => {
  const logSins = useStore((state) => state.logSins);

  const handleAddSins = (type: 'Klein' | 'Mittel' | 'Gross') => {
    logSins(type);
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
          <Text style={styles.title}>Süßigkeit</Text>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>kleine Sünde</Text>
              <Text style={styles.optionSubtitle}>Schokoriegel oder Ähnliches</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonYellow]}
              onPress={() => handleAddSins('Klein')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Genussbiessen</Text>
              <Text style={styles.optionSubtitle}>Tortenstück oder Ähnliches</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonOrange]}
              onPress={() => handleAddSins('Mittel')}
            >
              <Ionicons name="add" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>
          <View style={styles.option}>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Eskalation</Text>
              <Text style={styles.optionSubtitle}>Schokolade (ganz) oder Ähnliches</Text>
            </View>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButtonRed]}
              onPress={() => handleAddSins('Gross')}
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

export default SweetsModal;
