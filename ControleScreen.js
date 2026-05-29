import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ControlScreen() {
  const sendCommand = async (action) => {
    console.log("Action demandée : " + action);
    alert("Commande " + action + " envoyée au serveur !");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilotage Palettiseur</Text>
      
      {/* Bouton pour lancer un scénario */}
      <TouchableOpacity 
        style={[styles.button, {backgroundColor: 'green'}]}
        onPress={() => sendCommand('START')}
      >
        <Text style={styles.buttonText}>Lancer Palettisation</Text>
      </TouchableOpacity>

      {/* Bouton d'arrêt d'urgence */}
      <TouchableOpacity 
        style={[styles.button, {backgroundColor: 'red'}]}
        onPress={() => sendCommand('EMERGENCY_STOP')}
      >
        <Text style={styles.buttonText}>ARRÊT URGENCE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  button: { padding: 20, borderRadius: 10, margin: 10, width: 250 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});