import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { getFavorites } from '../services/favoritesService';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favs = await getFavorites();
      setFavorites(favs);
    };
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Outfits</Text>
      
      {favorites.length === 0 ? (
        <Text>No saved outfits yet</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Text style={styles.favoriteStyle}>{item.style.toUpperCase()}</Text>
              <Text>Top: {item.top}</Text>
              <Text>Bottom: {item.bottom}</Text>
              <Text>Shoes: {item.shoes}</Text>
              <Text>Accessories: {item.accessories.join(', ')}</Text>
              <Text>Saved: {new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      
      <Button 
        title="Back to Home" 
        onPress={() => navigation.navigate('Home')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  favoriteItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
  },
  favoriteStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5
  }
});

export default FavoritesScreen;