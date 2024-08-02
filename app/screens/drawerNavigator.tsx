import "react-native-gesture-handler";
import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { DefaultTheme, DrawerActions, Theme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/navigation/CustomDrawerContent";
import theme from "@/hooks/theme";
import { StyleSheet, TouchableOpacity } from "react-native";
import DashboardScreen from "./dashboard/dashboard";
import ChallengesScreen from "./challenges/Challenges";
import CalorieCalculatorScreen from "./calorieCalculator/calorieCalculator";
import InboxScreen from "./InboxScreen";
import UserProfileScreen from "./UserProfile";
import CalorieOverviewScreen from "./calorieOverview/CalorieOverview";
import EvaluationScreen from "./evaluation";
import LevelScreen from "./Level";
import SettingsScreen from "./settings";
import { useNavigation } from "@react-navigation/native";

export type RootDrawerParamList = {
  dashboard: undefined;
  Challenges: undefined;
  calorieCalculator: undefined;
  UserProfile: undefined;
  CalorieOverview: undefined;
  evaluation: undefined;
  settings: undefined;
};

const Drawer = createDrawerNavigator<any>();

const MainDrawerNavigator: React.FC = () => {
  const NavigationTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.white,
      text: theme.colors.black,
    },
  };

  const navigation = useNavigation<any>();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveBackgroundColor: "#007B40",
          drawerActiveTintColor: "#fff",
          drawerLabelStyle: {
            marginLeft: -20,
            fontFamily: theme.fonts.regular,
            fontSize: 16,
          },
          drawerItemStyle: {
            borderRadius: 4,
          },
          drawerContentContainerStyle: {
            paddingTop: 20,
          },
          headerTitleStyle: {
            fontFamily: theme.fonts.semiBold,
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons
                name="menu"
                size={24}
                color={theme.colors.primaryGreen100}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.primaryGreen100}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen
          name="dashboard"
          component={DashboardScreen}
          options={{
            drawerLabel: "Slimba",
            headerShown: false,
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Challenges"
          component={ChallengesScreen}
          options={{
            drawerLabel: "Challenges",
            headerTitle: "Challenges",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="rocket-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calorieCalculator"
          component={CalorieCalculatorScreen}
          options={{
            drawerLabel: "Ernährungs-Assistent",
            headerTitle: "Ernährungs-Assistent",
            drawerIcon: ({ size, color }) => (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="InboxScreen"
          component={InboxScreen}
          options={{
            drawerLabel: "Inbox",
            headerTitle: "Inbox",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="mail-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={{
            drawerLabel: "Mein Profil",
            headerTitle: "Mein Profil",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="scale-outline" size={size} color={color} />
            ),
            drawerItemStyle: styles.spacedItem,
          }}
        />
        <Drawer.Screen
          name="CalorieOverview"
          component={CalorieOverviewScreen}
          options={{
            drawerLabel: "Kalorienübersicht",
            headerTitle: "Kalorienübersicht",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="options-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="evaluation"
          component={EvaluationScreen}
          options={{
            drawerLabel: "7-Tage Statistik",
            headerTitle: "7-Tage Statistik",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Level"
          component={LevelScreen}
          options={{
            drawerLabel: "Level",
            headerTitle: "Level und Punktestand",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          component={SettingsScreen}
          options={{
            drawerLabel: "Einstellungen",
            headerTitle: "Einstellungen",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
            drawerItemStyle: styles.spacedItem,
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    justifyContent: "center",
    height: "100%",
  },
  closeButton: {
    marginRight: 16,
    justifyContent: "center",
    height: "100%",
  },
  spacedItem: {
    marginTop: 48,
  },
});

export default MainDrawerNavigator;
