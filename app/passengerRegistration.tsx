// PassengerRegistrationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PassengerRegistrationScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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

    const handleRegister = () => {
        // Lógica de cadastro
    };

    return (
        <View style={styles.container}>
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
            <Button title="Cadastrar" onPress={handleRegister} color="#44EAC3" />
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
