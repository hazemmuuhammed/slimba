import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import useStore from '../../components/store';
import theme from '../../hooks/theme';
import ProgressBar from '../../components/ProgressBar'; // Importieren Sie die Fortschrittsbalken-Komponente

const levels = [
  { level: 1, threshold: 0, cumulative: 0 },
  { level: 2, threshold: 500, cumulative: 500 },
  { level: 3, threshold: 1000, cumulative: 1500 },
  { level: 4, threshold: 2000, cumulative: 3500 },
  { level: 5, threshold: 4000, cumulative: 7500 },
];

const LevelScreen: React.FC = () => {
  const level = useStore((state) => state.level);
  const totalPoints = useStore((state) => state.totalPoints);
  const pointsNeededForNextLevel = useStore((state) => state.pointsNeededForNextLevel);

  const nextLevelThreshold = pointsNeededForNextLevel();
  const pointsToNextLevel = nextLevelThreshold - totalPoints;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Aktuelle Punkteanzahl</Text>
          <Text style={styles.points}>
            <Text style={styles.currentPoints}>{totalPoints}</Text> / {nextLevelThreshold}
          </Text>
        </View>
        <View style={styles.levelContainer}>
          <View style={styles.starContainer}>
            <Image source={require('../../assets/icons/star.png')} style={styles.starIcon} />
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>
      </View>
      <ProgressBar />
      <Text style={styles.progressText}>Verdiene noch {pointsToNextLevel} Punkte bis zum nächsten Level.</Text>
      <View style={styles.separator} />
      <View style={styles.pointsSystemContainer}>
        <Text style={styles.pointsSystemTitle}>Punkte System</Text>
        <View style={styles.pointsTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Korrekte Kalorienzahl für Frühstück, Mittag, Abend</Text>
            <Text style={styles.tablePoints}>+10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Zu viel</Text>
            <Text style={[styles.tablePoints, styles.negativePoints]}>-30</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Zu wenig</Text>
            <Text style={[styles.tablePoints, styles.negativePoints]}>-10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>30 Minuten sportliche Aktivität</Text>
            <Text style={styles.tablePoints}>+20</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>60 Minuten sportliche Aktivität</Text>
            <Text style={styles.tablePoints}>+40</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>90 Minuten sportliche Aktivität</Text>
            <Text style={styles.tablePoints}>+60</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Gewichtsreduktion pro 100 gramm</Text>
            <Text style={styles.tablePoints}>+10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Gewichtszunahme pro 100 gramm</Text>
            <Text style={[styles.tablePoints, styles.negativePoints]}>-20</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Kleine Sünde</Text>
            <Text style={[styles.tablePoints, styles.negativePoints]}>-10</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Genussbiessen</Text>
            <Text style={[styles.tablePoints, styles.negativePoints]}>-30</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableAction}>Eskalation</Text>
            <Text style={[styles.tablePoints, styles.negativePoints]}>-50</Text>
          </View>
          {/* Weitere Zeilen hinzufügen */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.secondaryBeige20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  pointsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pointsLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    marginBottom: 4,
    textAlign: 'left',
  },
  points: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    textAlign: 'left',
  },
  currentPoints: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
  },
  levelContainer: {
    alignItems: 'center',
  },
  starContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  starIcon: {
    width: 60,
    height: 60,
  },
  levelText: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    color: theme.colors.black,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
    transform: [{ translateY: -10 }],
  },
  progressText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    textAlign: 'left',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.secondaryBeige100,
    marginTop: 60,
    marginBottom: 20,
  },
  pointsSystemContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pointsSystemTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 16,
    textAlign: 'left',
  },
  pointsTable: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondaryBeige100,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondaryBeige100,
  },
  tableAction: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    width: '80%',
    textAlign: 'left',
  },
  tablePoints: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
    textAlign: 'right',
  },
  negativePoints: {
    color: theme.colors.accentRed100,
  },
});

export default LevelScreen;
