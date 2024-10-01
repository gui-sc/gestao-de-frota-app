import React, { useState, useEffect, useContext } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { UserContext } from '../contexts/UserContext';
import { API_KEY } from '../constants/Env';
import toastHelper from '@/utils/toast';

const ChooseDestinationScreen = () => {
    const { user } = useContext(UserContext);
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [destination, setDestination] = useState('');
    const [destinationCoordinates, setDestinationCoordinates] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [isTripStarted, setIsTripStarted] = useState(false);
    const [driver, setDriver] = useState<{
        name: string;
        photo: string;
        coordinates: {
            latitude: number;
            longitude: number;
        }
    } | null>(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Allow the app to use the location services');
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${API_KEY}`);
            console.log(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${API_KEY}`)
            const data = await response.json();

            if (data.results.length > 0) {
                const { geometry: { location } } = data.results[0];
                setDestinationCoordinates(location);
                Alert.alert("teste",JSON.stringify(location))
            } else {
                Alert.alert('Endereço não encontrado', 'Tente um endereço diferente.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível buscar o endereço.');
        }
    };

    const confirmTrip = () => {
        setIsTripStarted(true);
        // Mock do motorista aceitando a viagem
        setTimeout(() => {
            if (location) {
                setDriver({
                    name: 'Motorista',
                    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
                    coordinates: {
                        latitude: location.latitude + 0.001,
                        longitude: location.longitude + 0.001
                    }
                });
            } else {
                toastHelper.error("Não há localização", "Selecione um local de partida")
            }
        }, 5000);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >

            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker coordinate={location} title="Sua localização" />
                    {destinationCoordinates && (
                        <Marker coordinate={destinationCoordinates} title="Destino" pinColor="blue" />
                    )}
                    {isTripStarted && driver && (
                        <Marker coordinate={driver.coordinates} title={driver.name} image={{ uri: driver.photo }} />
                    )}
                </MapView>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    value={destination}
                    onChangeText={setDestination}
                    style={styles.input}
                    placeholder="Digite sua mensagem"
                    placeholderTextColor="#ccc"
                    multiline // Permitir quebra de linha // Limitar o crescimento do input
                />
                <TouchableOpacity onPress={handleSearch} style={styles.button}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
            </View>

            {destinationCoordinates && !isTripStarted && (
                <TouchableOpacity style={styles.confirmButton} onPress={confirmTrip}>
                    <Text style={styles.buttonText}>Confirmar Viagem</Text>
                </TouchableOpacity>
            )}

            <View style={styles.userInfo}>
                <Image source={{ uri: user?.photo }} style={styles.userPhoto} />
                <Text style={styles.userName}>{user?.username}</Text>
            </View>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        flex: 1,
        marginBottom: 100,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    confirmButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#FF9800',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    userInfo: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ChooseDestinationScreen;
