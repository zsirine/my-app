import React, { useState } from 'react';
import{
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { executePost } from './lib/API'; 

export default function ControlScreen() {
  const router = useRouter();
  const [convModalVisible, setConvModalVisible] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [direction, setDirection] = useState(1);

  const handleAction = async (name: string, func: () => Promise<Response>) => {
  try {
    const res = await func();
    if (res.ok) {
      Alert.alert('Succès', `${name} exécuté`);
    } else {
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

<Text style={styles.section}>Convoyeur</Text>
        {/* SECTION CONVOYEUR */}
        <TouchableOpacity
  style={styles.buttonBlue}
  onPress={() => setConvModalVisible(true)}
>
  <Text style={styles.buttonText}>START CONVOYEUR</Text>
</TouchableOpacity>

{/* MODAL CONVOYEUR */}
<Modal visible={convModalVisible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Paramètres Convoyeur</Text>

    <Text style={styles.modalLabel}>Vitesse</Text>
    <View style={styles.modalRow}>
      {[30, 50, 100].map(v => (
        <TouchableOpacity
          key={v}
          style={[styles.modalBtn, speed === v && styles.modalBtnActive]}
          onPress={() => setSpeed(v)}
        >
          <Text style={styles.modalBtnText}>{v}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.modalLabel}>Direction</Text>
    <View style={styles.modalRow}>
      <TouchableOpacity
        style={[styles.modalBtn, direction === 1 && styles.modalBtnActive]}
        onPress={() => setDirection(1)}
      >
        <Text style={styles.modalBtnText}>AVANT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalBtn, direction === -1 && styles.modalBtnActive]}
        onPress={() => setDirection(-1)}
      >
        <Text style={styles.modalBtnText}>ARRIÈRE</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.modalLancer}
      onPress={() => {
        setConvModalVisible(false);
        handleAction('START CONVOYEUR', () =>
          executePost('/conveyor/start', { speed, direction })
        );
      }}
    >
      <Text style={styles.buttonText}>LANCER</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setConvModalVisible(false)}>
      <Text style={styles.annuler}>Annuler</Text>
    </TouchableOpacity>
  </View>
</Modal>

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
  modalContainer: {
  flex: 1, justifyContent: 'flex-end',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalTitle: {
  color: '#fff', fontSize: 22, fontWeight: 'bold',
  marginBottom: 20, textAlign: 'center',
},
modalLabel: {
  color: '#3b82f6', fontSize: 16,
  marginBottom: 10, fontWeight: 'bold',
},
modalRow: {
  flexDirection: 'row', gap: 10, marginBottom: 20,
},
modalBtn: {
  padding: 12, borderRadius: 8,
  borderWidth: 1, borderColor: '#3b82f6',
},
modalBtnActive: {
  backgroundColor: '#3b82f6',
},
modalBtnText: {
  color: '#fff', fontWeight: 'bold',
},
modalLancer: {
  backgroundColor: '#22c55e',
  padding: 15, borderRadius: 10,
  alignItems: 'center', marginBottom: 10,
},
annuler: {
  color: '#ef4444', textAlign: 'center',
  marginTop: 10, fontSize: 14,
},
});