import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CarBrandPicker from '../components/CarBrandModelSelector';
import { createDriver, createVehicle } from '../api/routes';
import { maskToDate } from '../utils/mask';
import toastHelper from '../utils/toast';
import { navigate } from './rootNavigation';

export default function DriverRegistrationScreen() {
    const [step, setStep] = useState(1);
    // Etapa 1
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState<string>('');
    const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
    const [holdingDocumentPhoto, setHoldingDocumentPhoto] = useState<string | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
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
    const [color, setColor] = useState('');
    const [plate, setPlate] = useState('');
    const [renavam, setRenavam] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const handlePreviousStep = () => setStep(1);
    const handleNextStep = () => setStep(2);

    const handleRegisterDriver = async () => {
        const formData = new FormData();
        console.log('brand', brand)
        console.log('model', model)
        const newBirthDate = birthDate.split('/').reverse().join('-');
        console.log('newBirthDate', newBirthDate)
        // Adiciona os dados textuais ao FormData
        formData.append('name', name.split(' ')[0]);
        formData.append('last_name', name.split(' ').slice(1).join(' '));
        formData.append('email', email);
        formData.append('birth_date', newBirthDate);
        formData.append('type', 'driver');
        formData.append('phone', phone);
        formData.append('cpf', cpf);
        formData.append('cnh', cnh);
        formData.append('password', password);
        //ajusta o type conforme o tipo de arquivo
        formData.append('cnh_picture', {
            uri: documentPhoto,
            name: `documentPhoto.${documentPhoto?.split('.').pop()}`,
            type: `image/${documentPhoto?.split('.').pop()}`
        } as any)
        formData.append('profile_doc_picture', {
            uri: holdingDocumentPhoto,
            name: `holdingDocumentPhoto.${holdingDocumentPhoto?.split('.').pop()}`,
            type: `image/${holdingDocumentPhoto?.split('.').pop()}`
        } as any)
        formData.append('profile_picture', {
            uri: profilePhoto,
            name: `profilePhoto.${profilePhoto?.split('.').pop()}`,
            type: `image/${profilePhoto?.split('.').pop()}`
        } as any)
        console.log('formData1', formData)

        const res = await createDriver(formData).then(res => {
            console.log('res', res)
            handleRegisterVehicle(res.id)
        }).catch(error => {
            console.log('error', error)
            toastHelper.error('Erro ao cadastrar motorista', 'Tente novamente mais tarde');
        });
    };

    const handleRegisterVehicle = async (id: number | string) => {
        const formData = new FormData();
        if (!brand || !model) {
            toastHelper.error('Preencha todos os campos!', 'Selecione a marca e modelo do veículo');
            return;
        }
        formData.append('model', `${brand?.nome}-${model?.nome}`);
        formData.append('year', year);
        formData.append('plate', plate);
        formData.append('renavam', renavam);
        formData.append('color', color);
        formData.append('driver_id', id.toString());


        for (let i = 0; i < vehiclePhotos.length; i++) {
            formData.append(`pictures`, {
                uri: vehiclePhotos[i],
                name: `vehiclePhoto_${i}.${vehiclePhotos[i].split('.').pop()}`,
                type: `image/${vehiclePhotos[i].split('.').pop()}`
            } as any)
        }

        await createVehicle(formData).then(response => {
            navigate('pendingApproval');
        }).catch(error => {
            toastHelper.error('Erro ao cadastrar veículo', 'Tente novamente mais tarde');
        });
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
                            <TextInput
                                style={styles.input}
                                placeholder="Data de Nascimento"
                                placeholderTextColor="#ccc"
                                value={birthDate}
                                onChangeText={(date: string) => setBirthDate(maskToDate(date))}
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
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={() => pickImage(setProfilePhoto)}>
                                    {profilePhoto ? (
                                        <Image source={{ uri: profilePhoto }} style={styles.photo} />
                                    ) : (
                                        <View style={styles.photoPlaceholder}>
                                            <Text style={styles.photoText}>Foto de Perfil</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
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
                                placeholder="Cor"
                                placeholderTextColor="#ccc"
                                value={color}
                                onChangeText={setColor}
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
                            <Button title="Anterior" onPress={handlePreviousStep} color="#44EAC3" />
                            <Button title="Cadastrar" onPress={handleRegisterDriver} color="#44EAC3" />
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
