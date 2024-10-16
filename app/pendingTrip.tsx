import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { API_KEY } from '../constants/Env';
import MapViewDirections from 'react-native-maps-directions';
import { updateLocation, getLocation, getTripDriver } from '../api/routes';
import LoadingIndicator from '../components/Loading';
import { RouteList } from '../utils/stackParamRouteList';
import Icon from 'react-native-vector-icons/AntDesign';

type PendingTripProp = RouteProp<{ pendingTrip: { tripId: number } }, 'pendingTrip'>;

const PendingTrip = () => {
    const route = useRoute<PendingTripProp>();
    const { tripId } = route.params;
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [otherLocation, setOtherLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'passenger' | 'driver'>('passenger'); // Exemplo para distinguir entre motorista e passageiro
    const [isDriverAssigned, setIsDriverAssigned] = useState<boolean>(role === 'driver');
    const [otherUserInfo, setOtherUserInfo] = useState<{ name: string; avatarUrl: string } | null>(role == 'driver' ? {
        name: 'Motorista',
        avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
    } : null);
    const navigation = useNavigation<RouteList>();
    const [messageSearch, setMessageSearch] = useState('Procurando motorista');
    useEffect(() => {
        const interval = setInterval(() => {
            setMessageSearch((prev) => {
                if (prev === 'Procurando motorista...') {
                    return 'Procurando motorista';
                }
                return prev + '.';
            });
        }, 500);
        return () => clearInterval(interval);
    })

    useEffect(() => {
        getCurrentLocation();
        const interval = setInterval(() => {
            checkTripStatus();
        }, 5000); // Verifica o status da viagem a cada 5 segundos

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let locationInterval: NodeJS.Timeout;
        if (isDriverAssigned) {
            // Inicia a atualização das localizações somente quando o motorista for atribuído
            locationInterval = setInterval(() => {
                updateLocations();
                setTimeout(() => {
                    getCurrentLocation().then(() => updateSelfLocation());
                }, 3000);
            }, 5000); // Atualiza a cada 5 segundos

            return () => clearInterval(locationInterval);
        }
    }, [isDriverAssigned, userLocation]);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Permita o uso da localização.');
            return;
        }

        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
            setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
            setLoading(false);
        }
    };

    const updateSelfLocation = async () => {
        try {
            if (userLocation) {
                // await updateLocation(tripId, userLocation.latitude, userLocation.longitude, role);
            }
        } catch (error) {
            console.error('Erro ao atualizar a localização:', error);
        }
    };

    const updateLocations = async () => {
        try {
            if (role === 'passenger') {
                // const driverLoc = await getLocation(tripId, 'driver'); // Função que busca a localização do motorista
                setOtherLocation({ latitude: -29.11037478534928, longitude: -49.62256924856739 });
            } else {
                // const passengerLoc = await getLocation(tripId, 'passenger'); // Função que busca a localização do passageiro
                setOtherLocation({ latitude: 19.2949123, longitude: -99.1503933 });
            }
            console.log('Localização do outro usuário atualizada');
        } catch (error) {
            console.error('Erro ao atualizar a localização:', error);
        }
    };

    const checkTripStatus = async () => {
        try {
            if (isDriverAssigned) return;
            const tripDriver = await getTripDriver(tripId);
            if (tripDriver) {
                setIsDriverAssigned(true);
                setOtherUserInfo({
                    name: tripDriver.name,
                    avatarUrl: tripDriver.avatarUrl,
                });
                // Atualiza a localização imediatamente após a atribuição do motorista
                updateLocations();
            }
        } catch (error) {
            console.error('Erro ao verificar o status da viagem:', error);
        }
    };

    const calculateRegion = () => {
        if (!userLocation || !otherLocation) return null;

        const latitudes = [userLocation.latitude, otherLocation.latitude];
        const longitudes = [userLocation.longitude, otherLocation.longitude];

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

    if (loading) return <LoadingIndicator />;

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho com nome e foto do motorista */}
            {otherUserInfo && (
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: otherUserInfo.avatarUrl }} style={styles.avatar} />
                        <Text style={styles.userName}>{otherUserInfo.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('chat', { chatId: 1 })}>
                        <Text>
                            <Icon name="message1" size={24} color="#fff" />  {/* Botão de Voltar */}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <MapView
                style={styles.map}
                region={calculateRegion() || {
                    latitude: userLocation?.latitude || 0,
                    longitude: userLocation?.longitude || 0,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                loadingEnabled={true}
            >
                {userLocation && (
                    <Marker coordinate={userLocation} title="Você" />
                )}
                {otherLocation && (
                    <Marker coordinate={otherLocation} title={role === 'passenger' ? 'Motorista' : 'Passageiro'} />
                )}

                {userLocation && otherLocation && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={otherLocation}
                        strokeWidth={4}
                        strokeColor='#111111'
                        apikey={API_KEY}
                    />
                )}
            </MapView>

            {!isDriverAssigned && (
                <View style={styles.driverSearchContainer}>
                    <Text style={styles.driverSearchText}>{messageSearch}</Text>
                </View>
            )}

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelTripButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Cancelar Viagem</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    driverSearchContainer: {
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    driverSearchText: {
        color: '#fff',
        fontSize: 18,
    },
    searchingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    headerContainer: {
        position: 'absolute',
        top: 10,
        left: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
    },
    searchingText: {
        marginTop: 20,
        color: '#fff',
        fontSize: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#222',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
    },
    chatButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    map: {
        flex: 1,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 80, // Ajustado para ficar mais acima
        left: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelTripButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default PendingTrip;
