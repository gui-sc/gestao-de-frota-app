// PassengerRegistrationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createUser } from '../api/routes';
import { maskToDate } from '../utils/mask';
import { RouteList } from '../utils/stackParamRouteList';
import { useNavigation } from '@react-navigation/native';
import toastHelper from '../utils/toast';
import { navigate } from './rootNavigation';

export default function PassengerRegistrationScreen() {

    const navigation = useNavigation<RouteList>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [photo, setPhoto] = useState<string | null | undefined>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {

            setPhoto(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        const formData = new FormData();
        const newBirthDate = birthDate.split('/').reverse().join('-');
        console.log('newBirthDate', newBirthDate)
        // Adiciona os dados textuais ao FormData
        formData.append('name', name.split(' ')[0]);
        formData.append('last_name', name.split(' ').slice(1).join(' '));
        formData.append('email', email);
        formData.append('birth_date', newBirthDate);
        formData.append('type', 'passenger');
        formData.append('phone', phone);
        formData.append('cpf', cpf);
        formData.append('password', password);
        //ajusta o type conforme o tipo de arquivo
        formData.append('avatar', {
            uri: photo,
            name: `avatar.${photo?.split('.').pop()}`,
            type: `image/${photo?.split('.').pop()}`
        } as any)

        console.log('formData1', formData)

        await createUser(formData).then(res => {
            console.log('res', res)
            navigate('login');
        }).catch(error => {
            console.log('error', error)
            toastHelper.error('Erro ao cadastrar usuário', 'Tente novamente mais tarde');
        })
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <TouchableOpacity onPress={pickImage}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Text style={styles.photoText}>Adicionar Foto</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    placeholderTextColor="#ccc"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Data de Nascimento"
                    placeholderTextColor="#ccc"
                    value={birthDate}
                    onChangeText={(date: string) => setBirthDate(maskToDate(date))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#ccc"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor="#ccc"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.input}
                    placeholder="CPF"
                    placeholderTextColor="#ccc"
                    value={cpf}
                    onChangeText={setCpf}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#ccc"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#ccc"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <Button title="Cadastrar" onPress={handleRegister} color="#44EAC3" />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#44EAC3',
        padding: 10,
        marginBottom: 20,
        color: '#fff',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    photoText: {
        color: '#ccc',
    },
});
