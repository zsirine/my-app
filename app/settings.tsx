import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteToken } from './lib/auth';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await deleteToken();
      router.replace('/');
    } catch (error) {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Paramètres</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121826' },
  container: { flex: 1, padding: 24, justifyContent: 'flex-end' },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 30 },
  logoutButton: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#ef4444', padding: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
});