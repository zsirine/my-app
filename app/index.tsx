import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { saveToken } from './lib/auth';
import { getApiUrl } from './lib/API';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {

      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // important
      const data = await response.json();

      if (response.ok) {
        const token = data.access_token || data.token;

        if (!token) {
          Alert.alert("Erreur", "Token introuvable");
          return;
        }

        await saveToken(token);

        router.replace('/(tabs)/home');
      } else {
        Alert.alert("Erreur", data.detail || "Identifiants incorrects");
      }
    } catch (error) {
      Alert.alert("Erreur réseau", "Impossible de joindre l'API");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identification Robot Niryo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>SE CONNECTER</Text>
      </TouchableOpacity>

      <TouchableOpacity 
  style={styles.apiBtn}
  onPress={() => router.push('./parametre')}
>
  <Text style={styles.apiText}>Changer l'adresse API</Text>
</TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#0056b3',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  apiBtn: {
  marginTop: 15,
  alignItems: 'center',
  padding: 12,
},
apiText: {
  color: '#3b82f6',
  fontSize: 14,
},
});