import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { API_KEY } from '../constants/Env';
import MapViewDirections from 'react-native-maps-directions';
import { createTravel } from '../api/routes';
import toastHelper from '../utils/toast';
import LoadingIndicator from '../components/Loading';

const chooseDestination = () => {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [destination, setDestination] = useState<string>('');
    const [destinationCoordinates, setDestinationCoordinates] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [suggestions, setSuggestions] = useState<Array<any>>([]);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Carregando...');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentLocation().finally(() => setLoading(false));
    }, []);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Allow the app to use the location services', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK' },
            ]);
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
            const { latitude, longitude } = coords;
            setLocation({ latitude, longitude });
            console.log('Location:', latitude, longitude);

            let response = await Location.reverseGeocodeAsync({ latitude, longitude });
            for (let item of response) {
                let address = `${item.street}, ${item.city}`;
                setDisplayCurrentAddress(address);
            }
        }
    };

    // Função para integrar com a API do Google e buscar sugestões
    const fetchSuggestions = async (input: string) => {
        if (!input) return;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}&location=${location?.latitude},${location?.longitude}&radius=2000`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'OK') {
                setSuggestions(data.predictions);
            }
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
        }
    };

    // Função ao selecionar um destino da lista
    const handleSelectSuggestion = async (placeId: string) => {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const { lat, lng } = data.result.geometry.location;
            setDestinationCoordinates({ latitude: lat, longitude: lng });
            console.log('Destination:', lat, lng);
            setSuggestions([]); // Limpar as sugestões após a escolha
        } catch (error) {
            console.error('Erro ao buscar detalhes do lugar:', error);
        }
    };
    const handleNewTrip = async () => {
        await createTravel({
            latitudedestination: destinationCoordinates?.latitude || 0,
            longitudedestination: destinationCoordinates?.longitude || 0,
            latitudeorigin: location?.latitude || 0,
            longitudeorigin: location?.longitude || 0,
            passenger: 1,
            value: 0,
            destination,
        }).then(() => {
            toastHelper.success('Sucesso', 'Viagem solicitada com sucesso!');
        }).catch((error) => {
            console.error('Erro ao solicitar viagem:', error);
            toastHelper.error('Ops!', 'Erro ao solicitar viagem. Tente novamente.');
        });
    }
    // Função para calcular a região do mapa com origem e destino
    const calculateRegion = () => {
        if (!location || !destinationCoordinates) return null;

        const latitudes = [location.latitude, destinationCoordinates.latitude];
        const longitudes = [location.longitude, destinationCoordinates.longitude];

        const minLatitude = Math.min(...latitudes);
        const maxLatitude = Math.max(...latitudes);
        const minLongitude = Math.min(...longitudes);
        const maxLongitude = Math.max(...longitudes);

        const latitudeDelta = (maxLatitude - minLatitude) + (maxLatitude - minLatitude) * 0.2;
        const longitudeDelta = (maxLongitude - minLongitude) + (maxLongitude - minLongitude) * 0.2;

        return {
            latitude: (minLatitude + maxLatitude) / 2,
            longitude: (minLongitude + maxLongitude) / 2,
            latitudeDelta,
            longitudeDelta
        };
    };

    if(loading) return <LoadingIndicator />;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    {/* Campo de destino no topo */}
                    <View style={styles.topInputContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text>
                                <Icon name="arrow-left" size={24} color="#fff" />  {/* Botão de Voltar */}
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            value={destination}
                            onChangeText={(text) => {
                                setDestination(text);
                                fetchSuggestions(text); // Buscar sugestões à medida que o texto muda
                            }}
                            style={styles.input}
                            placeholder="Digite seu destino"
                            placeholderTextColor="#ccc"
                        />
                    </View>

                    {/* Lista de sugestões */}
                    {suggestions.length > 0 && (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.place_id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleSelectSuggestion(item.place_id)
                                        setDestination(item.description)
                                    }}
                                    style={styles.suggestionItem}
                                >
                                    <Text style={styles.suggestionText}>{item.description}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.suggestionsList}
                        />
                    )}

                    {/* Mapa */}
                    {location && (
                        <MapView
                            style={styles.map}
                            region={calculateRegion() || {
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            loadingEnabled={true}
                        >
                            {/* Marcador da localização atual */}
                            <Marker coordinate={location} title="Sua localização" description={displayCurrentAddress} />

                            {/* Marcador do destino escolhido */}
                            {destinationCoordinates && (
                                <Marker coordinate={destinationCoordinates}
                                    title="Destino"
                                    description={destination} />
                            )}
                            <MapViewDirections
                                origin={location}
                                destination={destinationCoordinates || location}
                                strokeWidth={4}
                                strokeColor='#111111'
                                apikey={API_KEY}
                            />
                        </MapView>
                    )}
                    {destinationCoordinates &&
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={styles.startTripButton}
                                onPress={handleNewTrip}>
                                <Text style={styles.buttonText}>
                                    {'Solicitar Viagem'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({

    startTripButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    topInputContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#44EAC3',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
    suggestionsList: {
        position: 'absolute',
        top: 80,
        left: 20,
        right: 20,
        zIndex: 11,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    suggestionText: {
        color: '#fff',
    },
    map: {
        flex: 1,
        marginTop: 80, // Ajustar o mapa para não sobrepor os campos
    },
});

export default chooseDestination;
