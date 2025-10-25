import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { addWardrobeItem, getWardrobe, clearWardrobe, removeWardrobeItem } from '../services/wardrobeService';

const WardrobeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const load = async () => {
      const w = await getWardrobe();
      setItems(w);
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!text || text.trim() === '') return;
    await addWardrobeItem(text.trim());
    const w = await getWardrobe();
    setItems(w);
    setText('');
  };

  const handleClear = async () => {
    await clearWardrobe();
    setItems([]);
  };

  const handleRemove = async (index) => {
    const updated = await removeWardrobeItem(index);
    setItems(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wardrobe</Text>
      <TextInput
        placeholder="e.g. blue jeans, white tee, leather jacket"
        style={styles.input}
        value={text}
        onChangeText={setText}
      />
      <Button title="Add Item" onPress={handleAdd} />

      <Text style={styles.subtitle}>Saved items</Text>
      {items.length === 0 ? (
        <Text>No items yet — add some above.</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.item}>{item}</Text>
              <Button title="Delete" color="#b22222" onPress={() => handleRemove(index)} />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Clear Wardrobe" color="#b22222" onPress={handleClear} />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginTop: 15, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  item: { padding: 8, flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8 }
});

export default WardrobeScreen;
