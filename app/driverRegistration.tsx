import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CarBrandPicker from '../components/CarBrandModelSelector';

export default function DriverRegistrationScreen() {
    const [step, setStep] = useState(1);
    // Etapa 1
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
    const [holdingDocumentPhoto, setHoldingDocumentPhoto] = useState<string | null>(null);
    // Etapa 2
    const [cnh, setCnh] = useState('');
    const [brand, setBrand] = useState<{
        codigo: string;
        nome: string;
    } | null>(null);
    const [model, setModel] = useState<{
        codigo: string;
        nome: string;
    } | null>(null);
    const [year, setYear] = useState('');
    const [plate, setPlate] = useState('');
    const [renavam, setRenavam] = useState('');
    const [vehiclePhotos, setVehiclePhotos] = useState<string[]>([]);

    const pickImage = async (setter: (uri: string | null) => void) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setter(result.assets[0].uri);
        }
    };

    const pickMultipleImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            aspect: [4, 3],
        });
        if (!result.canceled) {
            setVehiclePhotos([...result.assets.map(asset => asset.uri)]);
        }
    };

    const handleNextStep = () => setStep(2);
    const handleRegister = () => {
        // Lógica de cadastro
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {step === 1 ? (
                        <>
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
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={() => pickImage(setDocumentPhoto)}>
                                    {documentPhoto ? (
                                        <Image source={{ uri: documentPhoto }} style={styles.photo} />
                                    ) : (
                                        <View style={styles.photoPlaceholder}>
                                            <Text style={styles.photoText}>Foto do documento</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pickImage(setHoldingDocumentPhoto)}>
                                    {holdingDocumentPhoto ? (
                                        <Image source={{ uri: holdingDocumentPhoto }} style={styles.photo} />
                                    ) : (
                                        <View style={styles.photoPlaceholder}>
                                            <Text style={styles.photoText}>Foto segurando o documento</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <Button title="Próximo" onPress={handleNextStep} color="#44EAC3" />
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="CNH"
                                placeholderTextColor="#ccc"
                                value={cnh}
                                onChangeText={setCnh}
                            />
                            <CarBrandPicker
                                setBrand={setBrand}
                                setModel={setModel}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Ano"
                                placeholderTextColor="#ccc"
                                value={year}
                                onChangeText={setYear}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Placa"
                                placeholderTextColor="#ccc"
                                value={plate}
                                onChangeText={setPlate}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Renavam"
                                placeholderTextColor="#ccc"
                                value={renavam}
                                onChangeText={setRenavam}
                            />
                            <TouchableOpacity onPress={pickMultipleImages}>
                                <View style={styles.photoPlaceholder}>
                                    <Text style={styles.photoText}>Adicionar Fotos do Veículo</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.photoVehicleContainer}>
                                {vehiclePhotos.map((uri, index) => (
                                    <Image key={index} source={{ uri }} style={styles.photo} />
                                ))}
                            </View>
                            <Button title="Cadastrar" onPress={handleRegister} color="#44EAC3" />
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40, // Adiciona espaço extra na parte inferior
    },
    photo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#44EAC3',
        padding: 10,
        marginBottom: 20,
        color: '#fff',
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    photoVehicleContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
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
