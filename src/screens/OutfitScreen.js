import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ScrollView } from 'react-native';
import { getOutfitSuggestions } from '../services/outfitService';
import { saveFavorite } from '../services/favoritesService';
import { getWardrobe } from '../services/wardrobeService';

const OutfitScreen = ({ route }) => {
  const { style, event, weather } = route.params;
  const [outfit, setOutfit] = useState(null);
  const [altIndex, setAltIndex] = useState(-1);
  const [wardrobe, setWardrobe] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const w = await getWardrobe();
      setWardrobe(w);
      const suggestion = await getOutfitSuggestions(style, event, weather, w);
      setOutfit(suggestion);
      setAltIndex(-1);
    };
    fetch();
  }, [style, event, weather]);

  if (!outfit) {
    return (
      <View style={styles.container}>
        <Text>Loading outfit suggestions...</Text>
      </View>
    );
  }

  const handleSaveFavorite = async () => {
    // Save currently displayed outfit (either main or alternative)
    const displayed = altIndex === -1 ? outfit : { ...outfit, ...outfit.alternatives[altIndex] };
    await saveFavorite({
      style,
      ...displayed,
      date: new Date().toISOString()
    });
    alert('Outfit saved to favorites!');
  };

  const handleNextAlternative = () => {
    if (!outfit || !outfit.alternatives || outfit.alternatives.length === 0) return;
    setAltIndex((prev) => {
      const next = prev + 1;
      return next >= outfit.alternatives.length ? -1 : next;
    });
  };

  // Determine which outfit to display
  const displayed = altIndex === -1 ? outfit : { ...outfit, ...outfit.alternatives[altIndex] };

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Outfit Suggestions</Text>
      <Text>Style: {style.toUpperCase()}</Text>
      <Text>Event: {event.toUpperCase()}</Text>
      <Text>Weather: {weather.toUpperCase()}</Text>
      
  <Text style={styles.subtitle}>Top:</Text>
  <Text style={styles.item}>{displayed.top}</Text>
      
  <Text style={styles.subtitle}>Bottom:</Text>
  <Text style={styles.item}>{displayed.bottom}</Text>
      
  <Text style={styles.subtitle}>Shoes:</Text>
  <Text style={styles.item}>{displayed.shoes}</Text>
      
      <Text style={styles.subtitle}>Accessories:</Text>
      <FlatList
        data={displayed.accessories}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text style={[styles.subtitle, { marginTop: 18 }]}>Tips</Text>
      <ScrollView style={styles.tipsBox}>
        {outfit.tips.map((t, i) => (
          <Text key={i} style={styles.tipItem}>• {t}</Text>
        ))}
      </ScrollView>
      <View style={{ marginTop: 12, width: '100%' }}>
        <Button title="Save to Favorites" onPress={handleSaveFavorite} />
      </View>

      <View style={{ marginTop: 12, width: '100%' }}>
        <Button title={altIndex === -1 ? 'Show Alternative' : 'Show Main Suggestion'} onPress={handleNextAlternative} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15
  },
  item: {
    fontSize: 16,
    marginVertical: 5
  }
  ,
  tipsBox: {
    maxHeight: 120,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6
  },
  tipItem: { marginBottom: 6 }
});

export default OutfitScreen;