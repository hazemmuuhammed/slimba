// api.ts
import axios from 'axios';

const OPENAI_API_KEY = 'sk-proj-SLX8AhD0nSa3xnYUVfghT3BlbkFJOo7wWC6NkAlfXIgxqO1p';

export const fetchChatGPTResponse = async (message: string): Promise<string> => {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  };

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Du bist ein Bot, der nur Fragen zu Mahlzeiten und deren Kalorien- und Nährwertangaben beantwortet. Antworten sollen kurz und prägnant sein. Es soll jeweils eine Durchschnittwert einer normaeln mahlzeit angegeben werden.Bitte gib auch die Werte für Eiweiß, Kohlenhydrate und Fett an.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens: 300,
    temperature: 1,
  };


  try {
    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching data from OpenAI API:', error);
    return 'Error fetching response from ChatGPT';
  }
};
