import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const { user, updateUser } = useUser();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      const res = await api.post('/scan', { codigo: data });
      const { copos, premio } = res.data;

      updateUser({ copos });
      if (premio) {
        const novosPremios = [...(user?.premios || []), { codigo: premio, usado: false }];
        updateUser({ premios: novosPremios });
        Alert.alert('🎉 Parabéns!', 'Você ganhou um café grátis!');
        navigation.navigate('Premio' as never);
      } else {
        Alert.alert('Sucesso', 'Copo acumulado!');
        navigation.goBack();
      }
    } catch {
      Alert.alert('Erro', 'QRCode inválido ou problema no servidor');
      setScanned(false);
    }
  };

  if (hasPermission === null) return <Text>Solicitando permissão...</Text>;
  if (hasPermission === false) return <Text>Sem acesso à câmera</Text>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFill}
      />
      {scanned && <Button title="Escanear novamente" onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});