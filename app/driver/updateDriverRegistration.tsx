import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// import { fetchDriverAndVehicleData, updateVehicleData } from '../api/routes';
import { RouteProp, useRoute } from '@react-navigation/native';
import toastHelper from '../../utils/toast';
import CarBrandPicker from '../../components/CarBrandModelSelector';
import { getDriver, updateDriver, updateVehicle } from '../../api/routes';
import LoadingIndicator from '../../components/Loading';
import { navigate } from '../../utils/rootNavigation';

type UpdateDriverScreenProps = RouteProp<{
    updateDriverRegistration: {
        driverId: number;
    };
}>

export default function UpdateDriverScreen() {

    const route = useRoute<UpdateDriverScreenProps>();
    const { driverId } = route.params; // Recebe o ID do motorista via props
    const [loading, setLoading] = useState(true);
    const [driverData, setDriverData] = useState<any>(null);

    const [documentPhoto, setDocumentPhoto] = useState<string | null>(null);
    const [holdingDocumentPhoto, setHoldingDocumentPhoto] = useState<string | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    // Dados que podem ser alterados
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
    const [vehicleId, setVehicleId] = useState<number | null>(null);
    const [vehiclePhotos, setVehiclePhotos] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDriver(driverId).finally(() => setLoading(false));
                console.log('data', data)
                setDriverData({
                    name: data.user.name,
                    lastName: data.user.last_name,
                    email: data.user.email,
                    phone: data.user.phone,
                    cpf: data.user.cpf,
                    birthDate: data.user.birth_date.split('-').reverse().join('/'),
                });

                setYear(data.vehicle.year.toString());
                setColor(data.vehicle.color);
                setPlate(data.vehicle.plate);
                setRenavam(data.vehicle.renavam);
                setVehicleId(data.vehicle.id);
            } catch (error) {
                toastHelper.error('Erro ao carregar dados', 'Tente novamente mais tarde.');
            }
        };
        fetchData();
    }, [driverId]);

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

    const handleUpdateDriver = async () => {
        const formData = new FormData();
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
        setLoading(true);
        await updateDriver(driverId, formData).then(res => {
            console.log('res', res)
            console.log('vehicleId', vehicleId)
            console.log('atualizando veículo')
            handleUpdateVehicle();
        }).catch(error => {
            setLoading(false);
            console.log('error', error)
            toastHelper.error('Erro ao atualizar cadastro', 'Tente novamente mais tarde.');
        })
    }

    const handleUpdateVehicle = async () => {
        const formData = new FormData();
        if (!brand || !model || !year || !color || !plate || !renavam || vehiclePhotos.length === 0 || !vehicleId) {
            toastHelper.error('Dados incompletos', 'Preencha todos os campos e adicione fotos do veículo.');
            return;
        }

        formData.append('model', `${brand.nome}-${model.nome}`);
        formData.append('year', year);
        formData.append('plate', plate);
        formData.append('color', color);
        formData.append('renavam', renavam);
        formData.append('driver_id', driverId.toString());

        for (let i = 0; i < vehiclePhotos.length; i++) {
            formData.append(`pictures`, {
                uri: vehiclePhotos[i],
                name: `vehiclePhoto_${i}.${vehiclePhotos[i].split('.').pop()}`,
                type: `image/${vehiclePhotos[i].split('.').pop()}`
            } as any);
        }

        try {
            console.log('formData2', formData)
            console.log('vehicleId', vehicleId)
            await updateVehicle(vehicleId, formData).then(res => {
                console.log('res', res)
                navigate('pendingApproval', { driverId });
            }).catch(error => {
                console.log('error', error);
                toastHelper.error('Erro ao atualizar cadastro', 'Tente novamente mais tarde.');
            })
            toastHelper.success('Sucesso', 'Cadastro atualizado com sucesso!');
        } catch (error) {
            console.log('error', error)
            toastHelper.error('Erro ao atualizar cadastro', 'Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Dados do motorista (somente visualização) */}
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={`${driverData.name} ${driverData.lastName}`}
                    editable={false}
                />
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={driverData.email}
                    editable={false}
                />
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={driverData.phone}
                    editable={false}
                />
                <Text style={styles.label}>CPF</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={driverData.cpf}
                    editable={false}
                />
                <Text style={styles.label}>Data de Nascimento</Text>
                <TextInput
                    style={[styles.input, styles.readOnlyInput]}
                    value={driverData.birthDate}
                    editable={false}
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

                {/* Dados do veículo (edição permitida) */}
                <CarBrandPicker
                    setBrand={setBrand}
                    setModel={setModel}
                />
                <Text style={styles.label}>Ano</Text>
                <TextInput
                    style={styles.input}
                    value={year}
                    onChangeText={setYear}
                />
                <Text style={styles.label}>Cor</Text>
                <TextInput
                    style={styles.input}
                    value={color}
                    onChangeText={setColor}
                />
                <Text style={styles.label}>Placa</Text>
                <TextInput
                    style={styles.input}
                    value={plate}
                    onChangeText={setPlate}
                />
                <Text style={styles.label}>Renavam</Text>
                <TextInput
                    style={styles.input}
                    value={renavam}
                    onChangeText={setRenavam}
                />

                {/* Fotos do veículo */}

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
                <Button title="Atualizar Cadastro" onPress={handleUpdateDriver} color="#44EAC3" />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    photoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    scrollContainer: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#44EAC3',
        padding: 10,
        marginBottom: 20,
        color: '#fff',
    },
    readOnlyInput: {
        backgroundColor: '#333',
    },
    label: {
        color: '#fff',
        marginBottom: 5,
    },
    photo: {
        width: 100,
        height: 100,
        margin: 5,
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
        marginBottom: 20,
    },
    photoText: {
        color: '#ccc',
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 50,
    },
});
