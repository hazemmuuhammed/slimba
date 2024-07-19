import { useState, useEffect } from 'react';
import useStore from '../../components/store'; // Assuming you have a Zustand store for user data

export type Message = {
  id: number;
  subject: string;
  content: string;
  timestamp: number;
  read: boolean;
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const userLevel = useStore((state) => state.level);
  const userPoints = useStore((state) => state.totalPoints);
  const userDays = useStore((state) => state.daysSinceStart);

  useEffect(() => {
    const initialMessages: Message[] = [
      { id: 1, subject: 'Willkommen bei unserer App!', content: 'Wir freuen uns, dass du unsere App nutzt. Hier sind einige Tipps, um loszulegen...', timestamp: Date.now(), read: false },
      { id: 2, subject: 'Punkte erreicht!', content: 'Herzlichen Glückwunsch! Du hast deine ersten Punkte erreicht. Weiter so!', timestamp: Date.now(), read: false },
      { id: 3, subject: 'Level erreicht!', content: 'Glückwunsch! Du hast ein neues Level erreicht. Bleib dran!', timestamp: Date.now(), read: false },
    ];

    const filteredMessages = initialMessages.filter((message) => {
      if (message.id === 1) {
        return userDays >= 0;
      } else if (message.id === 2) {
        return userPoints > 100;
      } else if (message.id === 3) {
        return userLevel > 1;
      }
      return false;
    });

    setMessages((prevMessages) => {
      const prevMessagesMap = new Map(prevMessages.map((msg) => [msg.id, msg.read]));
      return filteredMessages.map((msg) => ({
        ...msg,
        read: prevMessagesMap.get(msg.id) ?? msg.read
      }));
    });
  }, [userLevel, userPoints, userDays]);

  const markMessageAsRead = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, read: true } : message
      )
    );
  };

  return { messages, markMessageAsRead };
};
