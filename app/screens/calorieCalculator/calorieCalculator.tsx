import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchChatGPTResponse } from "../../utility/api";
import theme from "../../../hooks/theme";
import useChatStore, { Message } from "./components/chatStore"; // Importiere den Zustand Store

export default function CalorieCalculator() {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const [inputText, setInputText] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const sendMessage = async () => {
    if (inputText.trim()) {
      const userMessage: Message = { role: "user", content: inputText };
      addMessage(userMessage); // Speichere die Nachricht im Zustand

      const responseMessage = await fetchChatGPTResponse(inputText);
      const botMessage: Message = {
        role: "assistant",
        content: responseMessage,
      };
      addMessage(botMessage); // Speichere die Antwort im Zustand
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        <View style={styles.chatContainer}>
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  message.role === "user"
                    ? styles.userMessageContainer
                    : styles.botMessageContainer,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.inputHintContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isInputFocused && styles.inputFocused]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Wie viel Kalorien hat..."
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons
                name="send"
                size={30}
                color={theme.colors.primaryGreen100}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              z.B. Silser Käse Sandwich, eine grosse Pizza Prosciutto, ein
              Chicken Bowl mit Sauce, ein Döner mit Cocktailsauce.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      <SafeAreaView style={styles.safeAreaBottom} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBeige20,
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: theme.colors.white,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.white,
    marginLeft: 20,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primaryGreen20,
    marginRight: 20,
  },
  messageText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  inputHintContainer: {
    backgroundColor: theme.colors.white,
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  hintContainer: {
    marginTop: 10,
    padding: 10,
  },
  hintText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: theme.colors.white,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.secondaryBeige100,
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: theme.colors.white,
    fontFamily: theme.fonts.regular,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  inputFocused: {
    borderColor: theme.colors.primaryGreen100,
  },
  icon: {
    marginHorizontal: 10,
  },
  safeAreaBottom: {
    backgroundColor: theme.colors.white,
  },
});
