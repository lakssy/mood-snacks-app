import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { Mood, Snack } from '../types';

const MOOD_OPTIONS = [
  { name: 'Happy', emoji: '😊', id: 'happy' },
  { name: 'Sad', emoji: '😢', id: 'sad' },
  { name: 'Stressed', emoji: '😰', id: 'stressed' },
  { name: 'Energetic', emoji: '⚡', id: 'energetic' },
  { name: 'Tired', emoji: '😴', id: 'tired' },
  { name: 'Angry', emoji: '😠', id: 'angry' },
];

export default function HomeScreen() {
  const { 
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
    getRecommendedSnacks 
  } = useApp();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);

  // Snack management
  const [isAddingSnack, setIsAddingSnack] = useState(false);
  const [editingSnack, setEditingSnack] = useState<Snack | null>(null);
  const [snackName, setSnackName] = useState('');
  const [snackDescription, setSnackDescription] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const handleSubmitMood = async () => {
    if (!selectedMood) return;

    const moodData = {
      id: editingMood?.id || Date.now().toString(),
      name: MOOD_OPTIONS.find(m => m.id === selectedMood)?.name || '',
      emoji: MOOD_OPTIONS.find(m => m.id === selectedMood)?.emoji || '',
      timestamp: new Date().toISOString(),
      intensity,
      note,
    };

    if (editingMood) {
      await updateMood(moodData);
      setEditingMood(null);
    } else {
      await addMood(moodData);
    }

    setSelectedMood(null);
    setNote('');
    setIntensity(3);
  };

  const handleEditMood = (mood: Mood) => {
    setEditingMood(mood);
    setSelectedMood(MOOD_OPTIONS.find(m => m.name === mood.name)?.id || null);
    setNote(mood.note || '');
    setIntensity(mood.intensity);
  };

  const handleDeleteMood = async (id: string) => {
    Alert.alert(
      'Delete Mood',
      'Are you sure you want to delete this mood?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMood(id);
              // Reset editing state if we're deleting the mood being edited
              if (editingMood?.id === id) {
                setEditingMood(null);
                setSelectedMood(null);
                setNote('');
                setIntensity(3);
              }
              // Show success message
              Alert.alert('Success', 'Mood deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete mood. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleSubmitSnack = async () => {
    if (!snackName || selectedMoods.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const snackData: Snack = {
      id: editingSnack?.id || Date.now().toString(),
      name: snackName,
      description: snackDescription,
      mood: selectedMoods,
    };

    if (editingSnack) {
      await updateSnack(snackData);
    } else {
      await addSnack(snackData);
    }

    resetSnackForm();
  };

  const resetSnackForm = () => {
    setSnackName('');
    setSnackDescription('');
    setSelectedMoods([]);
    setIsAddingSnack(false);
    setEditingSnack(null);
  };

  const handleEditSnack = (snack: Snack) => {
    setEditingSnack(snack);
    setSnackName(snack.name);
    setSnackDescription(snack.description);
    setSelectedMoods(snack.mood);
    setIsAddingSnack(true);
  };

  const handleDeleteSnack = async (id: string) => {
    Alert.alert(
      'Delete Snack',
      'Are you sure you want to delete this snack?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSnack(id);
              // Reset editing state if we're deleting the snack being edited
              if (editingSnack?.id === id) {
                resetSnackForm();
              }
              // Show success message
              Alert.alert('Success', 'Snack deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete snack. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleMoodForSnack = (moodId: string) => {
    setSelectedMoods(prev =>
      prev.includes(moodId)
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const recommendedSnacks = selectedMood ? getRecommendedSnacks(selectedMood) : [];

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const cardColor = isDarkMode ? '#1a1a1a' : '#f0f0f0';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.darkModeSwitch}>
          <Ionicons 
            name={isDarkMode ? "moon" : "sunny"} 
            size={24} 
            color={textColor} 
          />
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          How are you feeling?
        </Text>
        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodOption,
                { backgroundColor: cardColor },
                selectedMood === mood.id && styles.selectedMood,
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodName, { color: textColor }]}>
                {mood.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedMood && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Intensity
            </Text>
            <View style={styles.intensityContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.intensityOption,
                    { backgroundColor: cardColor },
                    intensity === value && styles.selectedIntensity,
                  ]}
                  onPress={() => setIntensity(value)}
                >
                  <Text style={[
                    styles.intensityText,
                    { color: intensity === value ? '#fff' : textColor }
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Add a note (optional)
            </Text>
            <TextInput
              style={[styles.noteInput, { backgroundColor: cardColor, color: textColor }]}
              placeholder="How are you feeling?"
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Recommended Snacks
            </Text>
            {recommendedSnacks.map((snack) => (
              <View 
                key={snack.id} 
                style={[styles.snackItem, { backgroundColor: cardColor }]}
              >
                <View style={styles.snackHeader}>
                  <Text style={[styles.snackName, { color: textColor }]}>
                    {snack.name}
                  </Text>
                  <TouchableOpacity onPress={() => handleEditSnack(snack)}>
                    <Ionicons name="pencil" size={20} color={textColor} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.snackDescription, { color: isDarkMode ? '#ccc' : '#666' }]}>
                  {snack.description}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, { opacity: editingMood ? 0.9 : 1 }]} 
            onPress={handleSubmitMood}
          >
            <Text style={styles.submitButtonText}>
              {editingMood ? 'Update Mood' : 'Save Mood'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Manage Snacks
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: '#007AFF' }]}
            onPress={() => setIsAddingSnack(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {snacks.map((snack) => (
          <View 
            key={snack.id} 
            style={[styles.snackItem, { backgroundColor: cardColor }]}
          >
            <View style={styles.snackHeader}>
              <Text style={[styles.snackName, { color: textColor }]}>
                {snack.name}
              </Text>
              <View style={styles.snackActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditSnack(snack)}
                >
                  <Ionicons name="pencil" size={20} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteSnack(snack.id)}
                >
                  <Ionicons name="trash" size={20} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.snackDescription, { color: isDarkMode ? '#ccc' : '#666' }]}>
              {snack.description}
            </Text>
            <View style={styles.moodTags}>
              {snack.mood.map(moodId => {
                const mood = MOOD_OPTIONS.find(m => m.id === moodId);
                return mood ? (
                  <View 
                    key={moodId} 
                    style={[styles.moodTag, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}
                  >
                    <Text>{mood.emoji}</Text>
                  </View>
                ) : null;
              })}
            </View>
          </View>
        ))}
      </View>

      <Modal
        visible={isAddingSnack}
        animationType="slide"
        transparent={true}
        onRequestClose={resetSnackForm}
      >
        <View style={[styles.modalContainer, { backgroundColor: backgroundColor }]}>
          <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {editingSnack ? 'Edit Snack' : 'Add New Snack'}
            </Text>
            
            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#fff', color: textColor }]}
              placeholder="Snack name"
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={snackName}
              onChangeText={setSnackName}
            />
            
            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#fff', color: textColor }]}
              placeholder="Description"
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={snackDescription}
              onChangeText={setSnackDescription}
              multiline
            />

            <Text style={[styles.modalSubtitle, { color: textColor }]}>
              Good for these moods:
            </Text>
            <View style={styles.moodGrid}>
              {MOOD_OPTIONS.map(mood => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    { backgroundColor: isDarkMode ? '#333' : '#fff' },
                    selectedMoods.includes(mood.id) && styles.selectedMood,
                  ]}
                  onPress={() => toggleMoodForSnack(mood.id)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodName, { color: textColor }]}>
                    {mood.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetSnackForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmitSnack}
              >
                <Text style={styles.buttonText}>
                  {editingSnack ? 'Update' : 'Add'} Snack
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  darkModeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedMood: {
    backgroundColor: '#007AFF',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodName: {
    fontSize: 14,
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  intensityOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIntensity: {
    backgroundColor: '#007AFF',
  },
  intensityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteInput: {
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  snackItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  snackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  snackName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  snackDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  moodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 