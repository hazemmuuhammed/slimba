import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import BreakfastOptionsModal from '@/components/BreakfastOptionModal'; // Pfad anpassen

const MealCard = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Frühstück</Text>
          <FontAwesome name="info-circle" size={20} color="black" style={styles.infoIcon} />
        </View>
        <Text style={styles.calories}>Ca. 420 - 620 Kalorien</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)} // Öffnet das Modal
      >
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>

      <BreakfastOptionsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 1000,  // Sehr hoher Wert für vollständige Abrundung
    padding: 10,
    marginHorizontal: 16,
    borderWidth: 2,
    borderColor: '#f0e6d2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    marginLeft: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoIcon: {
    marginLeft: 5,
  },
  calories: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFD580',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MealCard;