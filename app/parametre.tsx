import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function ParametresScreen() {
  const [url, setUrl] = useState('');
  const [urlActuelle, setUrlActuelle] = useState('');
  const router = useRouter();

  useEffect(() => {
    const chargerUrl = async () => {
      const stored = await SecureStore.getItemAsync('api_url');
      if (stored) {
        setUrl(stored);
        setUrlActuelle(stored);
      }
    };
    chargerUrl();
  }, []);

  const handleSave = async () => {
    if (!url.startsWith('http')) {
      Alert.alert('Erreur', "L'adresse doit commencer par http:// ou https://");
      return;
    }
    await SecureStore.setItemAsync('api_url', url);
    Alert.alert('Succès', 'Adresse API mise à jour !', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleReset = async () => {
    await SecureStore.deleteItemAsync('api_url');
    setUrl('');
    setUrlActuelle('');
    Alert.alert('Réinitialisé', 'Adresse par défaut restaurée');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.retour}>← Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>⚙️ Paramètres API</Text>

        {urlActuelle ? (
          <View style={styles.urlCard}>
            <Text style={styles.urlLabel}>Adresse actuelle :</Text>
            <Text style={styles.urlValue}>{urlActuelle}</Text>
          </View>
        ) : (
          <View style={styles.urlCard}>
            <Text style={styles.urlLabel}>Adresse actuelle :</Text>
            <Text style={styles.urlDefault}>Adresse par défaut (app.json)</Text>
          </View>
        )}

        <Text style={styles.label}>Nouvelle adresse IP :</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: http://192.168.1.50:8000"
          placeholderTextColor="#9ca3af"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Text style={styles.btnText}>ENREGISTRER</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
          <Text style={styles.btnResetText}>Réinitialiser (défaut)</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121826',
  },
  container: {
    padding: 24,
  },
  retour: {
    color: '#3b82f6',
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  urlCard: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  urlLabel: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 5,
  },
  urlValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  urlDefault: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 20,
    fontSize: 15,
  },
  btnSave: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnReset: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  btnResetText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});