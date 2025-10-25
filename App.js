import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import OutfitScreen from './src/screens/OutfitScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import WardrobeScreen from './src/screens/WardrobeScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Outfit" component={OutfitScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;