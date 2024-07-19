import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useStore from './store';

const UserInfoForm: React.FC = () => {
  const setUserInfo = useStore((state) => state.setUserInfo);
  
  const [displayName, setDisplayName] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('1.2');
  const [goal, setGoal] = useState<string>('');

  const handleSubmit = () => {
    setUserInfo(displayName, parseFloat(weight), parseFloat(height), birthday, parseFloat(activityLevel), goal);
  };

  return (
    <View style={styles.container}>
      <Text>Anzeigename:</Text>
      <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />
      
      <Text>Gewicht (kg):</Text>
      <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
      
      <Text>Größe (cm):</Text>
      <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" />
      
      <Text>Geburtstag (YYYY-MM-DD):</Text>
      <TextInput style={styles.input} value={birthday} onChangeText={setBirthday} />
      
      <Text>Aktivitätslevel:</Text>
      <Picker selectedValue={activityLevel} style={styles.input} onValueChange={(itemValue) => setActivityLevel(itemValue)}>
        <Picker.Item label="Sedentary (little or no exercise)" value="1.2" />
        <Picker.Item label="Lightly active (light exercise/sports 1-3 days/week)" value="1.375" />
        <Picker.Item label="Moderately active (moderate exercise/sports 3-5 days/week)" value="1.55" />
        <Picker.Item label="Very active (hard exercise/sports 6-7 days a week)" value="1.725" />
        <Picker.Item label="Super active (very hard exercise/sports & a physical job)" value="1.9" />
      </Picker>
      
      <Text>Ziel:</Text>
      <TextInput style={styles.input} value={goal} onChangeText={setGoal} />
      
      <Button title="Speichern" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default UserInfoForm;