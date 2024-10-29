import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import LoadingIndicator from '../components/Loading';
import toastHelper from '@/utils/toast';
import { loginApp } from '../api/routes';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, user } = useContext(UserContext);

  const handleLogin = () => {
    setLoading(true);
    loginApp(email, password).then(response => {
      if(response.error){
        toastHelper.error('Credenciais Incorretas', response.error.message);
        return
      }
      login(response);
    }).catch(error => {
      console.log('error', error)
      toastHelper.error('Erro ao realizar login', 'error');
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log('user', user)
    if (user) {
      toastHelper.success('Login realizado com sucesso!', 'success');
    }
  }, [user]);

  if (loading) return <LoadingIndicator />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image source={require('../assets/images/dc_logo.png')}
          style={styles.photo}
          resizeMode='contain' />
        <TextInput
          style={[styles.input, {
            marginTop: 50
          }]}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        {/* password input */}
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
  photo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
});
