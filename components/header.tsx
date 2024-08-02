import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import useStore from "./store";
import theme from "../hooks/theme";
import ProgressBar from "./ProgressBar";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../app/screens/drawerNavigator"; // Adjust the import path accordingly

interface HeaderProps {
  navigation: DrawerNavigationProp<RootDrawerParamList>;
}

const Header: React.FC<HeaderProps> = ({ navigation }: any) => {
  const level = useStore((state) => state.level);
  const loadDay = useStore((state) => state.loadDay);
  const currentDate = useStore((state) => state.currentDate);
  const messages = useStore((state) => state.messages);

  const [dates, setDates] = useState<string[]>([]);
  const unreadMessagesCount = messages.filter((msg) => !msg.read).length;

  useEffect(() => {
    const today = new Date();
    const pastSevenDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      pastSevenDays.push(date.toISOString().split("T")[0]);
    }
    setDates(pastSevenDays);
  }, []);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
  };

  const handleToggleDay = (direction: "previous" | "next") => {
    const currentIndex = dates.indexOf(currentDate);
    if (direction === "previous" && currentIndex < dates.length - 1) {
      loadDay(dates[currentIndex + 1]);
    } else if (direction === "next" && currentIndex > 0) {
      loadDay(dates[currentIndex - 1]);
    } else {
      Alert.alert("Info", "Nur die letzten 7 Tage sind aufrufbar.");
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.leftIcons}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons
              name="menu"
              size={24}
              color={theme.colors.primaryGreen100}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Inbox")}
            style={styles.inboxIconContainer}
          >
            <Ionicons
              name="mail-outline"
              size={24}
              color={theme.colors.primaryGreen100}
            />
            {unreadMessagesCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadMessagesCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <TouchableOpacity
            onPress={() => handleToggleDay("previous")}
            style={styles.backButton}
            disabled={dates.indexOf(currentDate) >= dates.length - 1}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={
                dates.indexOf(currentDate) >= dates.length - 1
                  ? theme.colors.primaryGreen20
                  : theme.colors.primaryGreen100
              }
            />
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {dates.indexOf(currentDate) === 0
              ? `Heute, ${formatDate(currentDate)}`
              : formatDate(currentDate)}
          </Text>
          <TouchableOpacity
            onPress={() => handleToggleDay("next")}
            style={styles.nextButton}
            disabled={dates.indexOf(currentDate) === 0}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={
                dates.indexOf(currentDate) === 0
                  ? theme.colors.primaryGreen20
                  : theme.colors.primaryGreen100
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.starContainer}>
          <Image
            source={require("../assets/icons/star.png")}
            style={styles.starIcon}
          />
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>
      <ProgressBar />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 0,
    paddingTop: 4,
    backgroundColor: theme.colors.white,
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  centerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 20,
  },
  backButton: {
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  dateText: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    textAlign: "center",
  },
  inboxIconContainer: {
    marginLeft: 16,
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  starContainer: {
    position: "relative",
  },
  starIcon: {
    width: 35,
    height: 35,
  },
  levelText: {
    position: "absolute",
    top: "25%", // Adjust this value to move the text down
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 14,
    color: theme.colors.black,
    fontWeight: "bold",
    fontFamily: theme.fonts.bold,
  },
});

export default Header;
