import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import toastHelper from '@/utils/toast';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(UserContext);

  const handleLogin = () => {
    login({ username: email.split("@")[0], email });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Entrar" onPress={handleLogin} color="#44EAC3" />
      </View>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#44EAC3',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#44EAC3',
    padding: 10,
    marginBottom: 20,
    color: '#fff',
  },
});
