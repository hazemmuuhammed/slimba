import { UserInfo, Recommendations } from './store';

const calculateRecommendations = (userInfo: UserInfo): Recommendations => {
  const { weight, height, birthday, activityLevel, goal, gender } = userInfo;

  // Funktion zum Parsen des Geburtstags im Format dd.mm.yyyy
  const parseBirthday = (birthday: string): Date => {
    const [day, month, year] = birthday.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const birthDate = parseBirthday(birthday);
  let age = new Date().getFullYear() - birthDate.getFullYear();
  const monthDifference = new Date().getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && new Date().getDate() < birthDate.getDate())) {
    age--;
  }

  // Harris-Benedict Formel zur Berechnung des Grundumsatzes (BMR)
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Männer
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161; // Frauen
  }

  // Berechnung des Gesamtumsatzes (TDEE) basierend auf Aktivitätslevel
  let tdee = bmr * activityLevel;

  // Anpassung des TDEE basierend auf dem Ziel
  if (goal === 'abnehmen') {
    tdee -= 500;
  } else if (goal === 'zunehmen') {
    tdee += 500;
  }

  const roundTo10 = (num: number) => Math.round(num / 10) * 10;

  const minFrühstück = tdee * 0.25 - 50;
  const maxFrühstück = tdee * 0.25 + 50;
  const minMittagessen = tdee * 0.35 - 50;
  const maxMittagessen = tdee * 0.35 + 50;
  const minAbendessen = tdee * 0.35 - 50;
  const maxAbendessen = tdee * 0.35 + 50;
  const minSnacks = tdee * 0.15 - 50;
  const maxSnacks = tdee * 0.15 + 50;

  const totalMin = minFrühstück + minMittagessen + minAbendessen + minSnacks;
  const totalMax = maxFrühstück + maxMittagessen + maxAbendessen + maxSnacks;
  const totalCalories = roundTo10((totalMin + totalMax) / 2);

  return {
    Frühstück: { min: roundTo10(minFrühstück), max: roundTo10(maxFrühstück) },
    Mittagessen: { min: roundTo10(minMittagessen), max: roundTo10(maxMittagessen) },
    Abendessen: { min: roundTo10(minAbendessen), max: roundTo10(maxAbendessen) },
    Snacks: { min: roundTo10(minSnacks), max: roundTo10(maxSnacks) },
    totalCalories, // Fügt die gesamte Kalorienanzahl hinzu
  } as Recommendations;
};

export default calculateRecommendations;
