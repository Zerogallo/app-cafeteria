import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

export default function PremioScreen() {
  const { user } = useUser();
  const navigation = useNavigation();

  const premio = user?.premios?.find(p => !p.usado);

  if (!premio) {
    return (
      <View style={styles.container}>
        <Text>Nenhum prêmio disponível</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Café grátis!</Text>
      <Text style={styles.subtitle}>Apresente este QRCode na loja para retirar seu café</Text>
      <QRCode value={premio.codigo} size={200} />
      <Text style={styles.code}>{premio.codigo}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  code: { marginTop: 10, fontSize: 12, color: '#666' },
  button: { marginTop: 30, backgroundColor: '#6b4f3c', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});