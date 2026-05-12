import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { deleteToken } from './lib/auth';
import { getApiUrl, saveApiUrl } from './lib/config';

export default function SettingsScreen() {
  const router = useRouter();
  const [apiUrl, setApiUrl] = useState('');

  // Charger l'URL actuelle au démarrage
  useEffect(() => {
    const loadApiUrl = async () => {
      const savedUrl = await getApiUrl();
      if (savedUrl) setApiUrl(savedUrl);
    };
    loadApiUrl();
  }, []);

  const handleSave = async () => {
    try {
      if (!apiUrl.trim()) {
        Alert.alert('Erreur', "L'adresse API ne peut pas être vide.");
        return;
      }
      if (
  !apiUrl.startsWith('http://') &&
  !apiUrl.startsWith('https://')
) {
  Alert.alert(
    'Attention',
    "L'adresse doit commencer par http:// ou https://"
  );
  return;
}
        
      await saveApiUrl(apiUrl.trim());
      Alert.alert('Succès', 'Configuration mise à jour.');
    } catch {
      Alert.alert('Erreur', "Impossible de sauvegarder.");
    }
  };


  const handleLogout = async () => {
    try {
      await deleteToken(); // On supprime le token dans auth.ts
      router.replace('/'); // On redirige vers index.tsx
    } catch (error) {
      console.error(error);
      router.replace('/'); // Même en cas d'erreur, on force le retour au login
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <Text style={styles.title}>Paramètres</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Adresse du Serveur API</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="https://192.168.5.17:8000"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>ENREGISTRER</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>RETOUR</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121826' },
  container: { flex: 1, padding: 24 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  form: { backgroundColor: '#1f2937', padding: 20, borderRadius: 20, marginBottom: 20 },
  label: { color: '#3b82f6', fontSize: 14, fontWeight: '600', marginBottom: 10 },
  input: { backgroundColor: '#111827', color: '#fff', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 15 },
  saveButton: { backgroundColor: '#2563eb', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  footer: { marginTop: 'auto' },
  logoutButton: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#ef4444', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
  backButton: { padding: 15, alignItems: 'center' },
  backText: { color: '#9ca3af' },
});