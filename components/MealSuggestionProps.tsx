import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchChatGPTResponse } from '../app/utility/api';
import theme from '../hooks/theme';

interface MealSuggestionModalProps {
  visible: boolean;
  onClose: () => void;
  meal: string;
  recommendations: { min: number; max: number };
}

const MealSuggestionModal: React.FC<MealSuggestionModalProps> = ({ visible, onClose, meal, recommendations }) => {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getSuggestion = async () => {
      setLoading(true);
      const response = await fetchChatGPTResponse(`Gib mir einen einzigen Menüvorschlag mit Zutaten und Mengenangaben für ein ${meal} mit einer Kalorienanzahl zwischen ${recommendations.min} und ${recommendations.max}, ohne Zubereitungshinweise.`);
      setSuggestion(response);
      setLoading(false);
    };

    if (visible) {
      getSuggestion();
    }
  }, [visible, meal, recommendations]);

  const formatSuggestion = (suggestion: string | null) => {
    if (!suggestion) return null;
    const ingredients = suggestion.split('\n').filter(line => line.trim() !== '');
    return (
      <View>
        <Text style={styles.suggestionText}>
          <Text style={styles.boldText}>Mahlzeit: </Text><Text style={styles.regularText}>{meal}</Text>
        </Text>
        <Text style={styles.suggestionText}>
          <Text style={styles.boldText}>Kalorien: </Text><Text style={styles.regularText}>{recommendations.min} - {recommendations.max}</Text>
        </Text>
        <View style={styles.separator} />
        {ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.regularText}>{ingredient}</Text>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.primaryGreen100} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Mahlzeiten-Empfehlung</Text>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primaryGreen100} />
          ) : (
            formatSuggestion(suggestion)
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.secondaryBeige20,
    padding: 20,
    borderRadius: 10,
    borderColor: theme.colors.secondaryBeige100,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.semiBold,
    marginBottom: 20,
    color: theme.colors.primaryGreen100,
  },
  suggestionText: {
    fontSize: 16,
    color: theme.colors.black,
    textAlign: 'left',
    fontFamily: theme.fonts.regular,
  },
  regularText: {
    fontSize: 16,
    color: theme.colors.black,
    fontFamily: theme.fonts.regular,
  },
  boldText: {
    fontSize: 16,
    color: theme.colors.black,
    fontFamily: theme.fonts.bold,
  },
  separator: {
    height: 10,
  },
});

export default MealSuggestionModal;
