import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Picker } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [stylePreference, setStylePreference] = useState('classic');
  const [eventType, setEventType] = useState('casual');
  const [weather, setWeather] = useState('moderate');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Outfit Planner</Text>
      
      <Text>Select Style:</Text>
      <Button title="Gen Z" onPress={() => setStylePreference('gen-z')} />
      <Button title="Gen X" onPress={() => setStylePreference('gen-x')} />
      <Button title="Classic" onPress={() => setStylePreference('classic')} />
      
      <Text>Event Type:</Text>
      <Picker
        selectedValue={eventType}
        onValueChange={(itemValue) => setEventType(itemValue)}>
        <Picker.Item label="Casual" value="casual" />
        <Picker.Item label="Business" value="business" />
        <Picker.Item label="Formal" value="formal" />
        <Picker.Item label="Party" value="party" />
      </Picker>
      
      <Text>Weather:</Text>
      <Picker
        selectedValue={weather}
        onValueChange={(itemValue) => setWeather(itemValue)}>
        <Picker.Item label="Hot" value="hot" />
        <Picker.Item label="Moderate" value="moderate" />
        <Picker.Item label="Cold" value="cold" />
        <Picker.Item label="Rainy" value="rainy" />
      </Picker>
      
      <Button 
        title="Get Outfit Suggestions" 
        onPress={() => navigation.navigate('Outfit', { 
          style: stylePreference,
          event: eventType,
          weather
        })}
      />
      
      <Button 
        title="View Favorites" 
        onPress={() => navigation.navigate('Favorites')} 
      />
      
          <Button
            title="Manage Wardrobe"
            onPress={() => navigation.navigate('Wardrobe')}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  }
});

export default HomeScreen;