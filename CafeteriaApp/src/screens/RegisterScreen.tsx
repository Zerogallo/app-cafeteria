import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigation = useNavigation();
  const { setUser, setToken } = useUser();

  const handleRegister = async () => {
    if (password !== confirm) return Alert.alert('Erro', 'Senhas não conferem');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, user } = res.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      navigation.navigate('Home' as never);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Falha no cadastro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  button: { backgroundColor: '#6b4f3c', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});