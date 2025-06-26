import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mood, Snack } from '../types';
import { useColorScheme } from 'react-native';

interface AppContextType {
  moods: Mood[];
  snacks: Snack[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  addMood: (mood: Mood) => Promise<void>;
  updateMood: (mood: Mood) => Promise<void>;
  deleteMood: (id: string) => Promise<void>;
  addSnack: (snack: Snack) => Promise<void>;
  updateSnack: (snack: Snack) => Promise<void>;
  deleteSnack: (id: string) => Promise<void>;
  getRecommendedSnacks: (moodId: string) => Snack[];
}

const DEFAULT_SNACKS: Snack[] = [
  {
    id: '1',
    name: 'Dark Chocolate',
    description: 'Rich in antioxidants and mood-boosting compounds',
    mood: ['sad', 'stressed'],
  },
  {
    id: '2',
    name: 'Mixed Nuts',
    description: 'Healthy fats and protein for sustained energy',
    mood: ['tired', 'stressed'],
  },
  {
    id: '3',
    name: 'Fresh Fruit',
    description: 'Natural sugars for quick energy boost',
    mood: ['sad', 'tired'],
  },
  {
    id: '4',
    name: 'Green Tea',
    description: 'Calming and focusing effects',
    mood: ['stressed', 'angry'],
  },
  {
    id: '5',
    name: 'Yogurt with Berries',
    description: 'Probiotics and antioxidants for overall wellness',
    mood: ['happy', 'energetic'],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [moodsData, snacksData, darkModeData] = await Promise.all([
        AsyncStorage.getItem('moods'),
        AsyncStorage.getItem('snacks'),
        AsyncStorage.getItem('isDarkMode'),
      ]);

      if (moodsData) {
        setMoods(JSON.parse(moodsData));
      }

      // Initialize snacks with default data if not exists
      if (snacksData) {
        setSnacks(JSON.parse(snacksData));
      } else {
        setSnacks(DEFAULT_SNACKS);
        await AsyncStorage.setItem('snacks', JSON.stringify(DEFAULT_SNACKS));
      }

      if (darkModeData) {
        setIsDarkMode(JSON.parse(darkModeData));
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with defaults on error
      setSnacks(DEFAULT_SNACKS);
      setIsInitialized(true);
    }
  };

  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await saveData('isDarkMode', newMode);
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  };

  const addMood = async (mood: Mood) => {
    try {
      const newMoods = [...moods, mood];
      await saveData('moods', newMoods);
      setMoods(newMoods);
    } catch (error) {
      console.error('Error adding mood:', error);
      throw new Error('Failed to add mood');
    }
  };

  const updateMood = async (mood: Mood) => {
    try {
      const newMoods = moods.map(m => m.id === mood.id ? mood : m);
      await saveData('moods', newMoods);
      setMoods(newMoods);
    } catch (error) {
      console.error('Error updating mood:', error);
      throw new Error('Failed to update mood');
    }
  };

  const deleteMood = async (id: string) => {
    try {
      const newMoods = moods.filter(m => m.id !== id);
      await saveData('moods', newMoods);
      setMoods(newMoods);
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw new Error('Failed to delete mood');
    }
  };

  const addSnack = async (snack: Snack) => {
    try {
      const newSnacks = [...snacks, snack];
      await saveData('snacks', newSnacks);
      setSnacks(newSnacks);
    } catch (error) {
      console.error('Error adding snack:', error);
      throw new Error('Failed to add snack');
    }
  };

  const updateSnack = async (snack: Snack) => {
    try {
      const newSnacks = snacks.map(s => s.id === snack.id ? snack : s);
      await saveData('snacks', newSnacks);
      setSnacks(newSnacks);
    } catch (error) {
      console.error('Error updating snack:', error);
      throw new Error('Failed to update snack');
    }
  };

  const deleteSnack = async (id: string) => {
    try {
      const newSnacks = snacks.filter(s => s.id !== id);
      await saveData('snacks', newSnacks);
      setSnacks(newSnacks);
    } catch (error) {
      console.error('Error deleting snack:', error);
      throw new Error('Failed to delete snack');
    }
  };

  const getRecommendedSnacks = (moodId: string) => {
    return snacks.filter(snack => snack.mood.includes(moodId));
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <AppContext.Provider
      value={{
        moods,
        snacks,
        isDarkMode,
        toggleDarkMode,
        addMood,
        updateMood,
        deleteMood,
        addSnack,
        updateSnack,
        deleteSnack,
        getRecommendedSnacks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 