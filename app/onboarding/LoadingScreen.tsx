// LoadingScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../hooks/theme";
import DavatarWrapper from "@/components/DavatarWrapper";
import { useNavigation } from "@react-navigation/native";

const LoadingScreen = () => {
  const navigation = useNavigation<any>();
  const [davatarLoaded, setDavatarLoaded] = useState(false);

  const handleLoad = () => {
    setDavatarLoaded(true);
  };

  const handlePress = () => {
    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Laden...</Text>
      <DavatarWrapper onLoad={handleLoad} />
      {davatarLoaded && (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Lerne Slimba kennen</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryGreen100,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderColor: theme.colors.white,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontFamily: theme.fonts.bold,
  },
});

export default LoadingScreen;
