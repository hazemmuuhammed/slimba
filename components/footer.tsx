import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FABButton from "./FABButton";

interface FooterProps {
  onCloseOverlay?: () => void; // Optional function prop
  onToggle?: (isOpened: boolean) => void; // Callback for when the FAB is toggled
  style?: ViewStyle; // Optional style prop
}

const Footer: React.FC<FooterProps> = ({ onCloseOverlay, onToggle, style }) => {
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "ios" && styles.safeAreaIOS,
        style,
      ]}
    >
      <View style={styles.footerContainer}>
        <View style={styles.buttonBackground}>
          <View style={styles.addButton}>
            <FABButton onCloseOverlay={onCloseOverlay} onToggle={onToggle} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  safeAreaIOS: {
    paddingBottom: -40, // Add extra padding for iOS to accommodate the safe area
  },
  footerContainer: {
    backgroundColor: "white",
    height: Platform.OS === "android" ? 45 : 65,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: Platform.OS === "android" ? 10 : 25, // Unterschiedliche Positionierung für Android und iOS
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 160,
  },
});

export default Footer;
