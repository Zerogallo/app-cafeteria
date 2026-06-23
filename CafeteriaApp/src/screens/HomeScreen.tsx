import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const { user, updateUser } = useUser();
  const navigation = useNavigation();

  const hasPremio = user?.premios?.some(p => !p.usado) || false;

  const renderCup = (index: number) => {
    const filled = index < (user?.copos || 0);
    return (
      <Icon
        key={index}
        name="cafe"
        size={40}
        color={filled ? '#6b4f3c' : '#ccc'}
        style={styles.cup}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.name}!</Text>
      </View>

      <View style={styles.cupsContainer}>
        {[0, 1, 2, 3, 4].map(renderCup)}
      </View>
      <Text style={styles.progress}>
        {user?.copos || 0} de 5 copos acumulados
      </Text>

      {hasPremio && (
        <TouchableOpacity style={styles.premioButton} onPress={() => navigation.navigate('Premio' as never)}>
          <Text style={styles.premioButtonText}>🎁 Ver prêmio disponível!</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Scanner' as never)}>
        <Icon name="qr-code" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { marginBottom: 30 },
  welcome: { fontSize: 24, fontWeight: 'bold' },
  cupsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  cup: { marginHorizontal: 5 },
  progress: { fontSize: 18, textAlign: 'center', marginVertical: 20 },
  premioButton: { backgroundColor: '#6b4f3c', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 20 },
  premioButtonText: { color: '#fff', fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6b4f3c',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});