import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* L'écran de login par défaut */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* L'accès aux onglets (Home, Settings) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* TA NOUVELLE PAGE DE CONTRÔLE */}
      <Stack.Screen name="controle" options={{ title: 'Contrôle Manuel', headerShown: false }} />
    </Stack>
  );
}

