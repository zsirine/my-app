import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Import ajusté selon ton arborescence
import { executePost } from './lib/API'; 

export default function ControlScreen() {
  const router = useRouter();

  const handleAction = async (
    name: string,
    func: () => Promise<Response>
  ) => {
    try {
      const res = await func();

      if (res.ok) {
        Alert.alert('Succès', `${name} exécuté`);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.log("Erreur API:", errData);
        Alert.alert('Erreur', `Impossible de lancer ${name}`);
      }
    } catch (e) {
      Alert.alert('Erreur', 'Serveur injoignable');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Contrôle Robot</Text>

        {/* SECTION ROBOT */}
        <Text style={styles.section}>Robot</Text>

        <TouchableOpacity
          style={styles.buttonGreen}
          onPress={() =>
            handleAction('START ROBOT', () =>
              executePost('/robot/start')
            )
          }
        >
          <Text style={styles.buttonText}>START ROBOT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRed}
          onPress={() =>
            handleAction('STOP ROBOT', () =>
              executePost('/robot/stop')
            )
          }
        >
          <Text style={styles.buttonText}>STOP ROBOT</Text>
        </TouchableOpacity>

        {/* SECTION CONVOYEUR */}
        <Text style={styles.section}>Convoyeur</Text>

        <TouchableOpacity
          style={styles.buttonBlue}
          onPress={() =>
            handleAction('START CONVOYEUR', () =>
              executePost('/conveyor/start')
            )
          }
        >
          <Text style={styles.buttonText}>START CONVOYEUR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonBlueDark}
          onPress={() =>
            handleAction('STOP CONVOYEUR', () =>
              executePost('/conveyor/stop')
            )
          }
        >
          <Text style={styles.buttonText}>STOP CONVOYEUR</Text>
        </TouchableOpacity>

        {/* SECTION POSITION */}
        <Text style={styles.section}>Position</Text>

        <TouchableOpacity
          style={styles.buttonYellow}
          onPress={() =>
            handleAction('POSITION INTERMEDIAIRE', () =>
              executePost('/scenarios/Position_intermediaire')
            )
          }
        >
          <Text style={styles.buttonTextDark}>
            POSITION INTERMEDIAIRE
          </Text>
        </TouchableOpacity>

        {/* BOUTON RETOUR */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>RETOUR AU DASHBOARD</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121826',
  },
  container: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    color: '#3b82f6',
    fontSize: 18,
    marginBottom: 15,
    marginTop: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonGreen: {
    backgroundColor: '#22c55e',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  buttonRed: {
    backgroundColor: '#ef4444',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  buttonBlue: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonBlueDark: {
    backgroundColor: '#1e40af',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonYellow: {
    backgroundColor: '#eab308',
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextDark: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 15,
  },
  backText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 'bold',
  },
});