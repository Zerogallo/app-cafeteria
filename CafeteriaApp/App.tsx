import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/contexts/UserContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import PremioScreen from './src/screens/PremioScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null, title: 'Início' }} />
          <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escanear QRCode' }} />
          <Stack.Screen name="Premio" component={PremioScreen} options={{ title: 'Parabéns!' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}