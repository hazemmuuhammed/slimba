import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import useStore from '../../components/store';
import theme from '../../hooks/theme';

const Evaluation: React.FC = () => {
  const activities = useStore((state) => state.activities);
  const weightChanges = useStore((state) => state.weightChanges);
  const challengeStatuses = useStore((state) => state.challengeStatuses);
  const dailyData = useStore((state) => state.dailyData);

  const lastSevenDays = Object.keys(dailyData)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7);

  const countStatus = (status: string) =>
    lastSevenDays.reduce((acc, date) => acc + Object.values(dailyData[date].status).filter((s) => s === status).length, 0);

  const countActivities = (type: string, category: string) =>
    activities.filter((activity) => activity.type === type && activity.category === category && lastSevenDays.includes(activity.date)).length;

  const countWeightChanges = () =>
    weightChanges.filter((change) => lastSevenDays.includes(change.date)).reduce((acc, change) => acc + change.change, 0);

  const countChallenges = (status: string) =>
    challengeStatuses.filter((challenge) => challenge.status === status && lastSevenDays.includes(challenge.date)).length;

  const getCountStyle = (count: number, type: string) => {
    if (count === 0) {
      return styles.neutralCount;
    }
    switch (type) {
      case 'Zuviel gegessen':
      case 'Gross Alkohol':
        return styles.negativeCount;
      case 'Nichts gegessen':
      case 'Klein Süßes':
      case 'Mittel Süßes':
      case 'Klein Alkohol':
      case 'Mittel Alkohol':
        return styles.orangeCount;
      default:
        return styles.positiveCount;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image source={require('../../assets/icons/meal.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Mahlzeiten</Text>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Richtig gegessen</Text>
            <Text style={[styles.sectionCount, getCountStyle(countStatus('Richtig gegessen'), 'Richtig gegessen')]}>{countStatus('Richtig gegessen')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Zu viel gegessen</Text>
            <Text style={[styles.sectionCount, getCountStyle(countStatus('Zuviel gegessen'), 'Zuviel gegessen')]}>{countStatus('Zuviel gegessen')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Nichts gegessen</Text>
            <Text style={[styles.sectionCount, getCountStyle(countStatus('Nichts gegessen'), 'Nichts gegessen')]}>{countStatus('Nichts gegessen')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Image source={require('../../assets/icons/activity.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Sportliche Aktivität</Text>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Kleine sportliche Aktivitäten</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Klein', 'Sport'), 'Klein Sport')]}>{countActivities('Klein', 'Sport')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Mittlere sportliche Aktivitäten</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Mittel', 'Sport'), 'Mittel Sport')]}>{countActivities('Mittel', 'Sport')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Grosse sportliche Aktivitäten</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Gross', 'Sport'), 'Gross Sport')]}>{countActivities('Gross', 'Sport')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Image source={require('../../assets/icons/sweets.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Süßigkeiten</Text>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Kleine Süßigkeiten</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Klein', 'Süßes'), 'Klein Süßes')]}>{countActivities('Klein', 'Süßes')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Mittlere Süßigkeiten</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Mittel', 'Süßes'), 'Mittel Süßes')]}>{countActivities('Mittel', 'Süßes')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Grosse Süßigkeiten</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Gross', 'Süßes'), 'Gross Süßes')]}>{countActivities('Gross', 'Süßes')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Image source={require('../../assets/icons/alcohol.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Alkoholkonsum</Text>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Kleiner Alkoholkonsum</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Klein', 'Alkohol'), 'Klein Alkohol')]}>{countActivities('Klein', 'Alkohol')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Mittlerer Alkoholkonsum</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Mittel', 'Alkohol'), 'Mittel Alkohol')]}>{countActivities('Mittel', 'Alkohol')}</Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Grosser Alkoholkonsum</Text>
            <Text style={[styles.sectionCount, getCountStyle(countActivities('Gross', 'Alkohol'), 'Gross Alkohol')]}>{countActivities('Gross', 'Alkohol')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Image source={require('../../assets/icons/scale.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Gewichtsveränderung</Text>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Gewichtsveränderung</Text>
            <Text style={[styles.sectionCount, getCountStyle(countWeightChanges(), 'Gewichtsveränderung')]}>{countWeightChanges()} kg</Text>
          </View>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Image source={require('../../assets/icons/challenge.png')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Bestandene Challenges</Text>
          <View style={styles.textRow}>
            <Text style={styles.sectionText}>Bestandene Challenges</Text>
            <Text style={[styles.sectionCount, getCountStyle(countChallenges('Bestanden'), 'Bestanden')]}>{countChallenges('Bestanden')}</Text>
          </View>
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
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryGreen100,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primaryGreen100,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    minWidth: 30,
    marginLeft: 10,
  },
  positiveCount: {
    color: theme.colors.primaryGreen100,
  },
  negativeCount: {
    color: theme.colors.accentRed100,
  },
  orangeCount: {
    color: theme.colors.accentOrange100,
  },
  neutralCount: {
    color: theme.colors.black,
  },
});

export default Evaluation;
