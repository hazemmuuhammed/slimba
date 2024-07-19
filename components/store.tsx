import create, { StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import calculateRecommendations from './calculateRecommendations';
import { Alert } from 'react-native';

export interface Challenge {
  id: number;
  name: string;
  description: string;
  points: number;
  duration: number;
}

export interface UserInfo {
  displayName: string;
  weight: number;
  height: number;
  birthday: string;
  activityLevel: number;
  goal: string;
  gender: 'male' | 'female';
}

export interface MealStatus {
  Frühstück: string | null;
  Mittagessen: string | null;
  Abendessen: string | null;
  Snacks: string | null;
}

export interface DailyData {
  date: string;
  status: MealStatus;
  points: number;
}

export interface Recommendations {
  Frühstück: { min: number; max: number };
  Mittagessen: { min: number; max: number };
  Abendessen: { min: number; max: number };
  Snacks: { min: number; max: number };
  totalCalories?: number;
}

export interface Activity {
  type: 'Klein' | 'Mittel' | 'Gross';
  date: string;
  category: 'Sport' | 'Süßes' | 'Alkohol';
}

export interface WeightChange {
  change: number;
  date: string;
}

export interface ChallengeStatus {
  challengeId: number;
  status: 'Bestanden' | 'Nicht bestanden';
  date: string;
}

export interface Message {
  id: number;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  conditions: {
    level: number;
    days: number;
  };
}

type MealType = 'Frühstück' | 'Mittagessen' | 'Abendessen' | 'Snacks';

interface StoreState {
  points: number;
  totalPoints: number;
  level: number;
  userInfo: UserInfo;
  recommendations: Recommendations;
  dailyData: {
    [key: string]: DailyData;
  };
  currentDate: string;
  lastWeightModalOpen: string | null;
  activeChallenge: Challenge | null;
  challengeStartDate: string | null;
  challengeProgress: number;
  cheatMealsRemaining: number;
  activities: Activity[];
  weightChanges: WeightChange[];
  challengeStatuses: ChallengeStatus[];
  reminderTime: Date | null;
  perfectDay: boolean;
  messages: Message[];
  daysSinceStart: number;
  mealPercentages: { Frühstück: number; Mittagessen: number; Abendessen: number; Snacks: number };
  levelUp: boolean;
  updatePoints: (activity: string, value: number) => void;
  deductPoints: (points: number) => void;
  addPoints: (points: number) => void;
  resetPoints: () => void;
  setUserInfo: (displayName: string, weight: number, height: number, birthday: string, activityLevel: number, goal: string, gender: 'male' | 'female') => void;
  updateStatus: (meal: keyof MealStatus, status: string) => void;
  loadDay: (date: string) => void;
  updateWeightChange: (weightChange: number) => void;
  updateWeight: (newWeight: number) => void;
  updateLastWeightModalOpen: () => void;
  logSins: (type: 'Klein' | 'Mittel' | 'Gross') => void;
  logSportActivity: (type: 'Klein' | 'Mittel' | 'Gross') => void;
  logAlcoholIntake: (type: 'Klein' | 'Mittel' | 'Gross') => void;
  logAppUsage: () => void;
  participateChallenge: (challenge: Challenge) => void;
  completeChallenge: (success: boolean) => void;
  cancelChallenge: () => void;
  checkLevelUp: () => void;
  checkLevelDown: () => void;
  updateLevel: () => void;
  calculateRecommendation: () => void;
  resetMealPercentages: () => void;
  setRecommendations: (meal: MealType, min: number, max: number) => void;
  updateMealPercentage: (meal: MealType, percentage: number) => void;
  pointsNeededForNextLevel: () => number;
  useCheatMeal: () => void;
  resetCheatMeals: () => void;
  setReminder: (time: Date) => void;
  markMessageAsRead: (id: number) => void;
  addMessage: (message: Message) => void;
  checkMessages: () => void;
  resetMealEntriesAndLevel: () => void;
}

const levels = [
  { level: 1, threshold: 0, cumulative: 0 },
  { level: 2, threshold: 500, cumulative: 500 },
  { level: 3, threshold: 1000, cumulative: 1500 },
  { level: 4, threshold: 2000, cumulative: 3500 },
  { level: 5, threshold: 4000, cumulative: 7500 },
];

const initialState: StoreState = {
  points: 0,
  totalPoints: 0,
  level: 1,
  userInfo: {
    displayName: '',
    weight: 0,
    height: 0,
    birthday: '',
    activityLevel: 1.2,
    goal: '',
    gender: 'male',
  },
  recommendations: {
    Frühstück: { min: 300, max: 400 },
    Mittagessen: { min: 500, max: 700 },
    Abendessen: { min: 500, max: 700 },
    Snacks: { min: 150, max: 250 },
  },
  mealPercentages: {
    Frühstück: 25,
    Mittagessen: 35,
    Abendessen: 30,
    Snacks: 10,
  },
  dailyData: {
    [new Date().toISOString().split('T')[0]]: {
      date: new Date().toISOString().split('T')[0],
      status: {
        Frühstück: null,
        Mittagessen: null,
        Abendessen: null,
        Snacks: null,
      },
      points: 0,
    },
  },
  currentDate: new Date().toISOString().split('T')[0],
  lastWeightModalOpen: null,
  activeChallenge: null,
  challengeStartDate: null,
  challengeProgress: 0,
  cheatMealsRemaining: 2,
  activities: [],
  weightChanges: [],
  challengeStatuses: [],
  reminderTime: null,
  perfectDay: false,
  messages: [],
  daysSinceStart: 0,
  levelUp: false,
  updatePoints: () => {},
  deductPoints: () => {},
  addPoints: () => {},
  resetPoints: () => {},
  setUserInfo: () => {},
  updateStatus: () => {},
  loadDay: () => {},
  updateWeightChange: () => {},
  updateWeight: () => {},
  updateLastWeightModalOpen: () => {},
  logSins: () => {},
  logSportActivity: () => {},
  logAlcoholIntake: () => {},
  logAppUsage: () => {},
  participateChallenge: () => {},
  completeChallenge: () => {},
  cancelChallenge: () => {},
  checkLevelUp: () => {},
  checkLevelDown: () => {},
  updateLevel: () => {},
  calculateRecommendation: () => {},
  resetMealPercentages: () => {},
  setRecommendations: () => {},
  updateMealPercentage: () => {},
  pointsNeededForNextLevel: () => 0,
  useCheatMeal: () => {},
  resetCheatMeals: () => {},
  setReminder: () => {},
  markMessageAsRead: () => {},
  addMessage: () => {},
  checkMessages: () => {},
  resetMealEntriesAndLevel: () => {},
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      resetMealPercentages: () => set({
        mealPercentages: {
          Frühstück: 25,
          Mittagessen: 35,
          Abendessen: 30,
          Snacks: 10,
        }
      }),
      pointsNeededForNextLevel: () => {
        const { totalPoints, level } = get();
        const nextLevel = levels.find((lvl) => lvl.level === level + 1);

        if (nextLevel) {
          return nextLevel.cumulative;
        }
        return 0;
      },
      updateMealPercentage: (meal, percentage) => set((state) => {
        const totalPercentage = state.mealPercentages.Frühstück + state.mealPercentages.Mittagessen + state.mealPercentages.Abendessen + state.mealPercentages.Snacks - state.mealPercentages[meal] + percentage;
        if (totalPercentage > 100) {
          Alert.alert('Fehler', 'Die Gesamtprozentzahl darf 100% nicht überschreiten.');
          return state;
        }
        return {
          mealPercentages: {
            ...state.mealPercentages,
            [meal]: percentage,
          }
        };
      }),
      loadDay: (date) => {
        const state = get();
        if (!state.dailyData[date]) {
          state.dailyData[date] = {
            date,
            status: {
              Frühstück: null,
              Mittagessen: null,
              Abendessen: null,
              Snacks: null,
            },
            points: 0,
          };
        }
        set({
          currentDate: date,
          perfectDay: false, // Reset perfect day
        });
      },
      updatePoints: (activity, value) => {
        const currentDate = get().currentDate;
        set((state) => {
          const newPoints = Math.round(state.dailyData[currentDate].points + value);
          return {
            dailyData: {
              ...state.dailyData,
              [currentDate]: {
                ...state.dailyData[currentDate],
                points: newPoints,
              },
            },
          };
        });
        setTimeout(() => {
          const newTotalPoints = Object.values(get().dailyData).reduce((acc, day) => acc + day.points, 0);
          set({ totalPoints: newTotalPoints >= 0 ? newTotalPoints : 0 });
          get().updateLevel();
        }, 0);
      },
      deductPoints: (points) => {
        const currentDate = get().currentDate;
        set((state) => {
          const newPoints = Math.round(state.dailyData[currentDate].points - points);
          return {
            dailyData: {
              ...state.dailyData,
              [currentDate]: {
                ...state.dailyData[currentDate],
                points: newPoints,
              },
            },
          };
        });
        setTimeout(() => {
          const newTotalPoints = Object.values(get().dailyData).reduce((acc, day) => acc + day.points, 0);
          set({ totalPoints: newTotalPoints >= 0 ? newTotalPoints : 0 });
          get().updateLevel();
        }, 0);
      },
      addPoints: (points) => {
        const currentDate = get().currentDate;
        set((state) => {
          const newPoints = Math.round(state.dailyData[currentDate].points + points);
          return {
            dailyData: {
              ...state.dailyData,
              [currentDate]: {
                ...state.dailyData[currentDate],
                points: newPoints,
              },
            },
          };
        });
        setTimeout(() => {
          const newTotalPoints = Object.values(get().dailyData).reduce((acc, day) => acc + day.points, 0);
          set({ totalPoints: newTotalPoints >= 0 ? newTotalPoints : 0 });
          get().updateLevel();
        }, 0);
      },
      resetPoints: () => set({
        points: 0,
        totalPoints: 0,
      }),
      setRecommendations: (meal, min, max) => set((state) => ({
        recommendations: {
          ...state.recommendations,
          [meal]: { min, max },
        }
      })),
      setUserInfo: (displayName, weight, height, birthday, activityLevel, goal, gender) => {
        const userInfo: UserInfo = { displayName, weight, height: Number(height), birthday, activityLevel, goal, gender };
        const recommendations = calculateRecommendations(userInfo);
        set({
          userInfo,
          recommendations,
        });
      },
      updateStatus: (meal, status) => {
        const currentDate = get().currentDate;
        set((state) => ({
          dailyData: {
            ...state.dailyData,
            [currentDate]: {
              ...state.dailyData[currentDate],
              status: {
                ...state.dailyData[currentDate].status,
                [meal]: status,
              },
            },
          },
        }));

        // Check for Perfect Day
        const updatedStatus = get().dailyData[currentDate].status;
        if (updatedStatus.Frühstück === 'Richtig gegessen' && updatedStatus.Mittagessen === 'Richtig gegessen' && updatedStatus.Abendessen === 'Richtig gegessen' && updatedStatus.Snacks === 'Richtig gegessen') {
          set({ perfectDay: true });
          get().addPoints(10);
        } else {
          set({ perfectDay: false });
        }
      },
      updateWeightChange: (weightChange) => {
        const currentDate = get().currentDate;
        set((state) => ({
          weightChanges: [...state.weightChanges, { change: weightChange, date: currentDate }],
        }));
        const points = weightChange > 0 ? -10 * (weightChange / 0.1) : 10 * (-weightChange / 0.1);
        get().updatePoints('Gewichtsveränderung', points);
      },
      updateWeight: (newWeight) => {
        const userInfo = { ...get().userInfo, weight: newWeight };
        const recommendations = calculateRecommendations(userInfo);
        set({
          userInfo,
          recommendations,
        });
      },
      updateLastWeightModalOpen: () => set({
        lastWeightModalOpen: new Date().toDateString(),
      }),
      logSins: (type) => {
        const currentDate = get().currentDate;
        set((state) => ({
          activities: [...state.activities, { type, date: currentDate, category: 'Süßes' }],
        }));
        let points = 0;
        switch (type) {
          case 'Klein':
            points = -10;
            break;
          case 'Mittel':
            points = -30;
            break;
          case 'Gross':
            points = -50;
            break;
        }
        get().updatePoints('Sünden', points);
      },
      logSportActivity: (type) => {
        const currentDate = get().currentDate;
        set((state) => ({
          activities: [...state.activities, { type, date: currentDate, category: 'Sport' }],
        }));
        let points = 0;
        if (type === 'Gross') {
          points = 60;
        } else if (type === 'Mittel') {
          points = 40;
        } else if (type === 'Klein') {
          points = 20;
        }
        get().updatePoints('Sportliche Aktivität', points);
      },
      logAlcoholIntake: (type) => {
        const currentDate = get().currentDate;
        set((state) => ({
          activities: [...state.activities, { type, date: currentDate, category: 'Alkohol' }],
        }));
        let points = 0;
        switch (type) {
          case 'Klein':
            points = -10;
            break;
          case 'Mittel':
            points = -30;
            break;
          case 'Gross':
            points = -50;
            break;
        }
        get().updatePoints('Alkoholkonsum', points);
      },
      logAppUsage: () => {
        get().updatePoints('Tägliche App-Nutzung', 5);
      },
      participateChallenge: (challenge) => {
        const currentDate = new Date().toISOString().split('T')[0];
        set((state) => ({
          activeChallenge: challenge,
          challengeStartDate: currentDate,
          challengeProgress: 0,
        }));
      },
      completeChallenge: (success: boolean) => {
        const state = get();
        const { activeChallenge } = state;
        const currentDate = new Date().toISOString().split('T')[0];

        if (activeChallenge) {
          set((state) => ({
            challengeStatuses: [
              ...state.challengeStatuses,
              {
                challengeId: activeChallenge.id,
                status: success ? 'Bestanden' : 'Nicht bestanden',
                date: currentDate,
              },
            ],
            activeChallenge: null,
            challengeStartDate: null,
            challengeProgress: 0,
          }));

          if (success) {
            state.addPoints(activeChallenge.points);
            Alert.alert('Erfolg', 'Challenge erfolgreich abgeschlossen!');
          } else {
            Alert.alert('Schade', 'Beim nächsten Mal klappt es bestimmt. Bleib dran.');
          }
        }
      },
      cancelChallenge: () => set({
        activeChallenge: null,
        challengeStartDate: null,
        challengeProgress: 0,
      }),
      checkLevelUp: () => {
        const { totalPoints, level } = get();
        const nextLevel = levels.find((lvl) => lvl.level === level + 1);
        if (nextLevel && totalPoints >= nextLevel.cumulative) {
          set({ level: nextLevel.level, levelUp: true });
          get().checkMessages(); // Check messages for new level-up conditions
        }
      },
      checkLevelDown: () => {
        const { totalPoints, level } = get();
        const currentLevel = levels.find((lvl) => lvl.level === level);
        const previousLevel = currentLevel ? levels.slice().reverse().find((lvl) => lvl.level < level && totalPoints < currentLevel.cumulative) : undefined;
        if (previousLevel) {
          set({ level: previousLevel.level, levelUp: false });
        }
      },
      updateLevel: () => {
        get().checkLevelUp();
        get().checkLevelDown();
      },
      calculateRecommendation: () => {
        const userInfo = get().userInfo;
        const recommendations = calculateRecommendations(userInfo);
        set({ recommendations });
      },
      useCheatMeal: () => {
        set((state) => {
          if (state.cheatMealsRemaining > 0) {
            return { cheatMealsRemaining: state.cheatMealsRemaining - 1 };
          }
          return state;
        });
      },
      resetCheatMeals: () => {
        set({ cheatMealsRemaining: 2 });
      },
      setReminder: (time: Date) => set({ reminderTime: time }),
      markMessageAsRead: (id: number) => set((state) => ({
        messages: state.messages.map((msg) => msg.id === id ? { ...msg, read: true } : msg),
      })),
      
      
      addMessage: (message: Message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      checkMessages: () => {
        const state = get();
        const newMessages = state.messages.map((message) => {
          const daysConditionMet = state.daysSinceStart >= message.conditions.days;
          const levelConditionMet = state.level >= message.conditions.level;
          if (!message.read && daysConditionMet && levelConditionMet) {
            return { ...message, read: true };
          }
          return message;
        });
        set({ messages: newMessages });
      },
      resetMealEntriesAndLevel: () => set({
        points: 0,
        totalPoints: 0,
        level: 1,
        dailyData: {
          [new Date().toISOString().split('T')[0]]: {
            date: new Date().toISOString().split('T')[0],
            status: {
              Frühstück: null,
              Mittagessen: null,
              Abendessen: null,
              Snacks: null,
            },
            points: 0,
          },
        },
      }),
    }),
    {
      name: 'store-storage', // unique name
      getStorage: () => AsyncStorage, // Use AsyncStorage for storage
    }
  )
);

export default useStore;
