import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, Modal, TouchableOpacity, Text } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import LoadingIndicator from '../components/Loading';
import toastHelper from '@/utils/toast';
import { loginApp } from '../api/routes';
import { navigate } from '../utils/rootNavigation';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('guilhermemotorista1@gmail.com');
  const [password, setPassword] = useState('1234567');
  const [modalVisible, setModalVisible] = useState(false);

  const { login, user } = useContext(UserContext);

  const handleLogin = () => {
    setLoading(true);
    loginApp(email, password).then(response => {
      if (response.error) {
        toastHelper.error('Credenciais Incorretas', response.error.message);
        return
      }
      login(response.user, response.activeTravel);
    }).catch(error => {
      console.log('error', error)
      toastHelper.error('Erro ao realizar login', 'error');
    }).finally(() => setLoading(false));
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const navigateToPassengerRegistration = () => {
    closeModal();
    navigate('passengerRegistration');
  };

  const navigateToDriverRegistration = () => {
    closeModal();
    navigate('driverRegistration');
  };
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
          placeholder="Digite seu e-mail, telefone ou CPF"
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
        {/* Botão para criar nova conta */}
        <TouchableOpacity onPress={openModal} style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>Criar Nova Conta</Text>
        </TouchableOpacity>

        {/* Modal de seleção */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione o tipo de conta</Text>
              <Button
                title="Passageiro"
                onPress={navigateToPassengerRegistration}
                color="#44EAC3"
              />
              <Button
                title="Motorista"
                onPress={navigateToDriverRegistration}
                color="#44EAC3"
              />
              <Button title="Cancelar" onPress={closeModal} color="#FF4444" />
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#44EAC3',
    marginBottom: 20,
  },
  createAccountButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  createAccountText: {
    color: '#44EAC3',
    fontSize: 16,
  },
});
