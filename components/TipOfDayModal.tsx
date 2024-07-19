import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../hooks/theme'; // Importieren Sie das Theme
import tips from '../assets/tips.json'; // Importieren Sie die JSON-Datei
import useStore from './store'; // Importieren Sie den Zustand-Store

const screenHeight = Dimensions.get('window').height;

const getDayOfYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const TipOfDayModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tip, setTip] = useState("");
  const displayName = useStore(state => state.userInfo.displayName); // Holen des Displaynamens aus dem Store

  useEffect(() => {
    const showTipOfTheDay = async () => {
      setIsVisible(true);

      // Sortieren der Tipps nach Nummern
      const sortedTips = tips.sort((a, b) => a.number - b.number);

      // Laden des letzten angezeigten Tipps und Datums aus AsyncStorage
      const lastTipIndexString = await AsyncStorage.getItem('lastTipIndex');
      const lastDateString = await AsyncStorage.getItem('lastDate');

      const lastTipIndex = lastTipIndexString ? parseInt(lastTipIndexString, 10) : -1;
      const lastDate = lastDateString ? new Date(lastDateString) : new Date(0);

      const currentDate = new Date();
      const currentDayOfYear = getDayOfYear();

      let newTipIndex = lastTipIndex;

      // Wenn das Datum sich geändert hat, den nächsten Tipp anzeigen
      if (lastDate.getDate() !== currentDate.getDate() || lastDate.getMonth() !== currentDate.getMonth() || lastDate.getFullYear() !== currentDate.getFullYear()) {
        newTipIndex = (lastTipIndex + 1) % sortedTips.length;

        // Speichern des neuen Tipps und Datums in AsyncStorage
        await AsyncStorage.setItem('lastTipIndex', newTipIndex.toString());
        await AsyncStorage.setItem('lastDate', currentDate.toISOString());
      }

      // Den neuen Tipp setzen
      setTip(sortedTips[newTipIndex].text);
    };

    showTipOfTheDay();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={handleClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.swipeBar} />
        </TouchableWithoutFeedback>
        <Text style={styles.tipTitle}>Hallo {displayName}</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  swipeBar: {
    width: 40,
    height: 5,
    backgroundColor: theme.colors.primaryGreen100,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalContent: {
    backgroundColor: theme.colors.secondaryBeige20,
    padding: 20,
    paddingTop: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.45, // 45% des Bildschirms
  },
  tipTitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: 10,
  },
  tipText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    fontSize: 16,
  },
});

export default TipOfDayModal;