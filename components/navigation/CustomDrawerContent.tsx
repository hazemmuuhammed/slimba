import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Image } from "react-native";
import theme from "@/hooks/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useStore from "../store";
import { Ionicons } from "@expo/vector-icons";

export default function CustomDrawerContent(props: any) {
  const { top, bottom } = useSafeAreaInsets();
  const level = useStore((state) => state.level);
  const displayName = useStore((state) => state.userInfo.displayName);
  const totalPoints = useStore((state) => state.totalPoints);
  const pointsNeededForNextLevel = useStore(
    (state) => state.pointsNeededForNextLevel
  )();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={styles.drawerContentContainer}
      >
        <View style={styles.mainContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.settingsContainer}>
        <Text style={styles.aboutText}>About</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    padding: 16,
    paddingBottom: 20,
  },
  headerText: {
    color: theme.colors.black,
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  drawerContentContainer: {
    backgroundColor: theme.colors.white,
    fontFamily: theme.fonts.regular,
  },
  OverviewContainer: {
    padding: 8,
  },
  infoContainer: {
    flexDirection: "row",
  },
  levelText: {
    position: "absolute",
    top: "25%",
    left: "40%",
    textAlign: "center",
    fontSize: 16,
    color: theme.colors.black,
    fontWeight: "bold",
    fontFamily: theme.fonts.bold,
  },
  NameText: {
    fontSize: 18,
    color: theme.colors.primaryGreen100,
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: theme.colors.white,
    paddingTop: 20,
  },
  PointsText: {
    fontSize: 16,
    color: theme.colors.black,
    fontFamily: theme.fonts.regular,
    marginLeft: 10, // Add margin to separate from the star container
  },
  starContainer: {
    position: "relative",
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  aboutText: {
    fontFamily: theme.fonts.regular,
  },
  logoutContainer: {
    padding: 10,
    paddingBottom: 20,
    backgroundColor: theme.colors.white,
    alignItems: "center",
  },
  logoutItem: {
    width: "100%",
  },
  logoutLabel: {
    fontSize: 14,
  },
  settingsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondaryBeige100,
    padding: 16,
    paddingBottom: 40,
  },
  starIcon: {
    width: 35,
    height: 35,
  },
});
