import React, { useState, useEffect, useContext } from 'react';
import { Alert, StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { UserContext } from '../../contexts/UserContext';
import { RouteList } from '../../utils/stackParamRouteList';
import { finishTravel, initTravel } from '../../api/routes';
import toastHelper from '../../utils/toast';
import LoadingIndicator from '../../components/Loading';
import { navigate } from '../../utils/rootNavigation';
import { API_KEY } from '../../constants/Env';

type MapScreenRouteProp = RouteProp<{
    map: {
        pickupCoordinates: {
            latitude: number;
            longitude: number;
        };
        destinationCoordinates: {
            latitude: number;
            longitude: number;
        };
        user: {
            name: string;
            photo: string;
        },
        routeId: number;
    };
}>
const MapScreen = () => {

    const route = useRoute<MapScreenRouteProp>();
    const { pickupCoordinates, destinationCoordinates, user: tripUser, routeId } = route.params;
    const { user } = useContext(UserContext)
    const [isTripStarted, setIsTripStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Carregando...');
    const [displayDestinationAddress, setDisplayDestinationAddress] = useState('Carregando...');
    const [displayPickupAddress, setDisplayPickupAddress] = useState('Carregando...');
    const navigation = useNavigation<RouteList>();
    const [tripTime, setTripTime] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);

    useEffect(() => {
        if (isTripStarted) {
            const id = setInterval(() => {
                setTripTime(prev => prev + 1);  // Incrementa o tempo da viagem a cada segundo
            }, 1000);
            setIntervalId(id);
        } else if (!isTripStarted && intervalId) {
            clearInterval(intervalId as unknown as number);
        }
    }, [isTripStarted]);

    useEffect(() => {
        Promise.all([
            getCurrentLocation(),
            getDestinationAddress(),
            getPickupAddress(),
        ]).finally(() => setLoading(false));
    }, []);


    const calculateRegion = () => {
        const points = [location, pickupCoordinates, destinationCoordinates];
        const latitudes = points.map(point => point?.latitude).filter(Boolean) as number[];
        const longitudes = points.map(point => point?.longitude).filter(Boolean) as number[];

        const minLatitude = Math.min(...latitudes);
        const maxLatitude = Math.max(...latitudes);
        const minLongitude = Math.min(...longitudes);
        const maxLongitude = Math.max(...longitudes);

        // Ajuste no multiplicador para adicionar mais margem
        const latitudeDelta = (maxLatitude - minLatitude) + (maxLatitude - minLatitude) * 0.2;
        const longitudeDelta = (maxLongitude - minLongitude) + (maxLongitude - minLongitude) * 0.2;

        return {
            latitude: (minLatitude + maxLatitude) / 2,
            longitude: (minLongitude + maxLongitude) / 2,
            latitudeDelta,
            longitudeDelta
        };
    };



    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Allow the app to use the location services', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK' },
            ]);
        }

        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
            const { latitude, longitude } = coords;
            setLocation({ latitude, longitude });

            let response = await Location.reverseGeocodeAsync({ latitude, longitude });
            for (let item of response) {
                let address = `${item.street},${item.district ? ` ${item.district} -` : ''} ${item.city}`;
                setDisplayCurrentAddress(address);
            }
        }
    };

    const getDestinationAddress = async () => {
        let response = await Location.reverseGeocodeAsync(destinationCoordinates);
        for (let item of response) {

            let address = `${item.street},${item.district ? ` ${item.district} -` : ''} ${item.city}`;
            setDisplayDestinationAddress(address);
        }
    };

    const getPickupAddress = async () => {
        let response = await Location.reverseGeocodeAsync(pickupCoordinates);
        for (let item of response) {

            let address = `${item.street},${item.district ? ` ${item.district} -` : ''} ${item.city}`;
            setDisplayPickupAddress(address);
        }
    };

    const handleInitTrip = async () => {
        await initTravel(routeId).then(() => {
            toastHelper.success('Sucesso', 'Viagem iniciada com sucesso');
        }).catch(() => {
            toastHelper.error('Erro', 'Erro ao iniciar a viagem');
        })
    }

    const handleFinishTrip = async () => {
        await finishTravel(routeId).then(() => {
            toastHelper.success('Sucesso', 'Viagem finalizada com sucesso');
        }).catch(() => {
            toastHelper.error('Erro', 'Erro ao finalizar a viagem');
        })
    }

    if (loading) return <LoadingIndicator />;

    return (
        <View style={styles.container}>
            {/* Informações do passageiro */}
            <View style={styles.passengerInfo}>
                <TouchableOpacity onPress={() => navigate(user?.type ?? 'login')}>
                    <Text>
                        <Icon name="arrow-left" size={24} color="#fff" />  {/* Botão de Voltar */}
                    </Text>
                </TouchableOpacity>
                <Image source={{ uri: tripUser.photo }} style={styles.passengerPhoto} />
                <Text style={styles.passengerName}>{tripUser.name}</Text>
            </View>

            {location && (
                <MapView
                    style={styles.map}
                    region={calculateRegion()}
                    loadingEnabled={true}
                    toolbarEnabled={true}
                    zoomControlEnabled={true}>

                    {/* Marcadores */}
                    <Marker coordinate={location}
                        title="Sua localização"
                        image={user?.avatar ? { uri: user.avatar } : undefined}
                        description={displayCurrentAddress}
                    />
                    {!isTripStarted && (
                        <Marker coordinate={pickupCoordinates}
                            title={route.params.user.name}
                            style={styles.passengerPhoto}
                            description={displayPickupAddress}
                        />

                    )}
                    <Marker coordinate={destinationCoordinates}
                        title={`Destino de ${route.params.user.name}`}
                        description={displayDestinationAddress}
                    />

                    {/* Direções */}
                    <MapViewDirections
                        origin={location}
                        destination={isTripStarted ? destinationCoordinates : pickupCoordinates}
                        strokeWidth={4}
                        strokeColor='#111111'
                        apikey={API_KEY}
                    />
                </MapView>
            )}


            {/* Botões na parte inferior */}

            <View style={styles.buttonsContainer}>
                {/* Contador de tempo de viagem */}
                {isTripStarted && (
                    <View style={styles.tripTimeContainer}>
                        <Text style={styles.tripTimeText}>Tempo de viagem: {Math.floor(tripTime / 60)}:{tripTime % 60 < 10 ? `0${tripTime % 60}` : tripTime % 60}</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={isTripStarted ? styles.finishTripButton : styles.startTripButton}
                    onPress={() => {
                        if (!isTripStarted) {
                            handleInitTrip()
                        } else {
                            handleFinishTrip()
                        }
                        setIsTripStarted(!isTripStarted)
                    }}>
                    <Text style={styles.buttonText}>
                        {isTripStarted ? 'Finalizar Viagem' : 'Iniciar Viagem'}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    passengerInfo: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 10,
        gap: 10,
    },
    tripTimeContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    tripTimeText: {
        color: '#fff',
        fontSize: 16,
    },
    passengerPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    passengerName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
        marginTop: 100, // Ajusta o mapa para não sobrepor as informações do passageiro
    },
    mapFullScreen: {
        ...StyleSheet.absoluteFillObject,
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
    backButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    fullScreenButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    startTripButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    finishTripButton: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
});

export default MapScreen;
