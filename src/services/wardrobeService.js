import AsyncStorage from '@react-native-async-storage/async-storage';

const WARDROBE_KEY = '@wardrobe';

export const addWardrobeItem = async (item) => {
  try {
    const items = await getWardrobe();
    items.push(item);
    await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error adding wardrobe item', e);
  }
};

export const getWardrobe = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(WARDROBE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting wardrobe', e);
    return [];
  }
};

export const clearWardrobe = async () => {
  try {
    await AsyncStorage.removeItem(WARDROBE_KEY);
  } catch (e) {
    console.error('Error clearing wardrobe', e);
  }
};



export const removeWardrobeItem = async (indexToRemove) => {
  try {
    const items = await getWardrobe();
    const filtered = items.filter((_, i) => i !== indexToRemove);
    await AsyncStorage.setItem(WARDROBE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Error removing wardrobe item', e);
    return [];
  }
};
