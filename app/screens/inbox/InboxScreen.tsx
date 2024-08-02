import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMessages, Message } from "../../utility/useMessages";
import theme from "../../../hooks/theme";

const InboxScreen: React.FC = () => {
  const { messages, markMessageAsRead } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handlePress = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageContainer,
        item.read ? styles.readMessage : styles.unreadMessage,
      ]}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.messageSubject}>{item.subject}</Text>
      <Text style={styles.messageSender}>Slimba</Text>
      <Text style={styles.messageTimestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      {selectedMessage && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={selectedMessage !== null}
          onRequestClose={() => setSelectedMessage(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalSubject}>{selectedMessage.subject}</Text>
              <Text style={styles.modalSender}>Slimba</Text>
              <Text style={styles.modalTimestamp}>
                {new Date(selectedMessage.timestamp).toLocaleDateString()}
              </Text>
              <Text style={styles.modalContentText}>
                {selectedMessage.content}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedMessage(null)}
              >
                <Text style={styles.closeButtonText}>Schließen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryBeige20,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 10,
    margin: 15,
    backgroundColor: theme.colors.white,
  },
  unreadMessage: {
    borderColor: theme.colors.primaryGreen100,
    borderWidth: 2,
  },
  readMessage: {
    borderColor: theme.colors.secondaryBeige20,
    borderWidth: 1,
  },
  messageSubject: {
    fontSize: 16,
    color: theme.colors.black,
    fontFamily: theme.fonts.semiBold,
  },
  messageSender: {
    fontSize: 14,
    color: theme.colors.black,
  },
  messageTimestamp: {
    fontSize: 12,
    color: theme.colors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  modalSubject: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSender: {
    fontSize: 14,
    color: theme.colors.primaryGreen100,
    marginBottom: 5,
  },
  modalTimestamp: {
    fontSize: 12,
    color: theme.colors.black,
    marginBottom: 20,
  },
  modalContentText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: theme.colors.primaryGreen100,
    borderRadius: 5,
  },
  closeButtonText: {
    color: theme.colors.white,
  },
});

export default InboxScreen;
