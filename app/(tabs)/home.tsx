import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl, executePost } from '../lib/API';
import { router } from 'expo-router/build/exports';
import { deleteToken, getToken } from '../lib/auth';

export default function HomeScreen() {
  const [robotStatus, setRobotStatus] = useState('Vérification...');
  const [loading, setLoading] = useState(false);
  
  const [triModalVisible, setTriModalVisible] = useState(false);
  const [zone, setZone] = useState('A');
  const [forme, setForme] = useState('tous'); 
  const [couleur, setCouleur] = useState('tous');

  const fetchStatus = async () => {
  try {
    const token = await getToken();
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/robot/status`, {
  headers: token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {},
});  
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    const data = await res.json();
    console.log('STATUS API:', data);

    const isConnected =
      data?.robot?.connected === true ||
      data?.robot?.connected === 'true' ||
      data?.connected === true ||
      data?.connected === 'true' ||
      data?.robot?.status === 'ONLINE' ||
      data?.status === 'ONLINE';

    setRobotStatus(
      isConnected ? 'OPÉRATIONNEL' : 'DÉCONNECTÉ'
    );

  } catch (error) {
    console.log('Erreur fetchStatus:', error);
    setRobotStatus('HORS LIGNE');
  }
};


  useEffect(() => { fetchStatus(); }, []);

      <ScrollView contentContainerStyle={styles.container}></ScrollView>
  const handleAction = async (name: string, func: () => Promise<Response>) => {
    setLoading(true);
    try {
      const res = await func();
      if (res.ok) Alert.alert('Succès', `${name} lancé avec succès.`);
      else {
        const errData = await res.json();
        console.log(errData); 
        Alert.alert('Erreur', `Code ${res.status}: Vérifiez les paramètres.`);
      }
    } catch { Alert.alert('Erreur', 'Serveur injoignable'); }
    finally { setLoading(false); }
  };
  const handleLogout = async () => {
  await deleteToken();
  router.replace('/');
};
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Superviseur Niryo</Text>
        
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Statut du système :</Text>
          <Text style={styles.statusValue}>{robotStatus}</Text>
        </View>
        <TouchableOpacity onPress={fetchStatus}>
          <Text style={{color: '#3b82f6'}}> Actualiser</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.bigBtn} onPress={() => setTriModalVisible(true)}>
            <Text style={styles.btnLabel}>CONFIGURER LE TRI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigBtn, {backgroundColor: '#f3f53d'}]} onPress={() => handleAction('Empilage', () => executePost('/scenarios/empilage'))}>
            <Text style={[styles.btnLabel, {color: '#000'}]}>EMPILAGE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigBtn, {backgroundColor: '#47a8ff'}]} onPress={() => handleAction('Rangement', () => executePost('/scenarios/rangement'))}>
            <Text style={styles.btnLabel}>RANGEMENT</Text>
          </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bigBtn, { backgroundColor: '#4b5563', marginTop: 10 }]} 
          onPress={() => router.push('/controle')}
        >
          <Text style={styles.btnLabel}> CONTRÔLE MANUEL</Text>
        </TouchableOpacity>
        <TouchableOpacity 
  style={styles.logoutBtn}
  onPress={() => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", style: "destructive", onPress: handleLogout }
      ]
    );
  }}
>
  <Text style={styles.logoutText}>SE DÉCONNECTER</Text>
</TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal de Tri optimisée */}
      <Modal visible={triModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Paramètres du Tri</Text>
            
            <Text style={styles.label}>Zone de destination : {zone}</Text>
            <View style={styles.selector}>
              {['A', 'B', 'C', 'D'].map(z => (
                <TouchableOpacity key={z} style={[styles.chip, zone === z && styles.chipActive]} onPress={() => setZone(z)}>
                  <Text style={zone === z ? styles.chipTextActive : styles.chipText}>{z}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* SÉLECTEUR DE FORME */}
            <Text style={styles.label}>Forme des pièces : {forme}</Text>
            <View style={styles.selector}>
              {['tous', 'rond', 'carre'].map(f => (
                <TouchableOpacity 
                  key={f} 
                  style={[styles.chip, forme === f && styles.chipActive]} 
                  onPress={() => setForme(f)}
                >
                  <Text style={forme === f ? styles.chipTextActive : styles.chipText}>
                    {f.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SÉLECTEUR DE COULEUR */}
            <Text style={styles.label}>Couleur : {couleur}</Text>
            <View style={styles.selector}>
              {['tous', 'bleu', 'rouge', 'vert'].map(c => (
                <TouchableOpacity 
                  key={c} 
                  style={[styles.chip, couleur === c && styles.chipActive]} 
                  onPress={() => setCouleur(c)}
                >
                  <Text style={couleur === c ? styles.chipTextActive : styles.chipText}>
                    {c.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={() => {
                setTriModalVisible(false);
                handleAction('Tri', () => executePost('/scenarios/tri_convoyeur', { zone, forme, couleur, quantite: 1 }));
              }}
            >
              <Text style={styles.btnTextBold}>LANCER LE CYCLE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setTriModalVisible(false)}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121826' },
  container: { padding: 20 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  statusCard: { backgroundColor: '#1f2937', padding: 20, borderRadius: 15, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#3b82f6' },
  statusLabel: { color: '#9ca3af', fontSize: 14 },
  statusValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bigBtn: { width: '48%', backgroundColor: '#3b82f6', aspectRatio: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 5 },
  emergencyBtn: { backgroundColor: '#ef4444', width: '100%' },
  btnEmoji: { fontSize: 30, marginBottom: 10 },
  btnLabel: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, minHeight: '50%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, color: '#4b5563', marginBottom: 10 },
  selector: { flexDirection: 'row', marginBottom: 20 },
  chip: { padding: 10, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, marginRight: 10, minWidth: 50, alignItems: 'center' },
  chipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  chipText: { color: '#4b5563' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  confirmBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  btnTextBold: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelText: { textAlign: 'center', marginTop: 15, color: '#ef4444' },
  controlButton: {
    backgroundColor: '#4b5563',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoutBtn: {
    marginTop: 30,
    width: '100%',
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});