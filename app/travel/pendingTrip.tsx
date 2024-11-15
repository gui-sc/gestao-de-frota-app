import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/AntDesign';
import { UserContext } from '../../contexts/UserContext';
import { RouteList } from '../../utils/stackParamRouteList';
import { cancelTravel, finishTravel, getChatByTravel, getLocation, getTripDriver, getUnreadMessagesCount, initTravel, updateLocation } from '../../api/routes';
import toastHelper from '../../utils/toast';
import { navigate } from '../../utils/rootNavigation';
import LoadingIndicator from '../../components/Loading';
import UnreadBadge from '../../components/UnreadBadge';
import { API_KEY } from '../../constants/Env';

type PendingTripProp = RouteProp<{
    pendingTrip: {
        pickupCoordinates: {
            latitude: number;
            longitude: number;
        };
        destinationCoordinates: {
            latitude: number;
            longitude: number;
        };
        driverLocation?: {
            latitude: number;
            longitude: number;
        };
        passenger: {
            name: string;
            avatar?: string;
        };
        driver?: {
            name: string;
            avatar?: string;
        }
        tripId: number;
        destination: string;
    }
}, 'pendingTrip'>;

const PendingTrip = () => {
    const { user } = useContext(UserContext);
    const route = useRoute<PendingTripProp>();
    const { tripId, destinationCoordinates, pickupCoordinates, passenger, destination, driver, driverLocation } = route.params;
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [otherLocation, setOtherLocation] = useState<{ latitude: number; longitude: number } | undefined>();
    const [loading, setLoading] = useState(true);
    const [isTripStarted, setIsTripStarted] = useState(false);
    const [role, setRole] = useState<'passenger' | 'driver' | null>(null); // Exemplo para distinguir entre motorista e passageiro
    const [isDriverAssigned, setIsDriverAssigned] = useState<boolean>(role === 'driver' || driver !== undefined);
    const [tripTime, setTripTime] = useState(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const [otherUserInfo, setOtherUserInfo] = useState<{ name: string; avatar?: string } | undefined>();
    const navigation = useNavigation<RouteList>();
    const [messageSearch, setMessageSearch] = useState('Procurando motorista');
    const [chatId, setChatId] = useState(0);
    const [unreadCountMessages, setUnreadCountMessages] = useState(0);
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
        if (user) {
            console.log('User:', user);
            setRole(user.type === 'driver' ? 'driver' : 'passenger')
            setIsDriverAssigned(user.type === 'driver' || driver !== undefined)
            setOtherUserInfo(user.type === 'driver' ? passenger : driver)
            setOtherLocation(user.type === 'driver' ? pickupCoordinates : driverLocation)
            console.log(passenger)
        }
    }, [user])

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
        if (chatId && user?.id) {
            getUnreadMessagesCount(chatId, user.id).then((res) => {
                console.log('Mensagens não lidas:', res.unreadMessagesCount);
                setUnreadCountMessages(res.unreadMessagesCount)
            }).catch((err) => {
                console.error('Erro ao buscar mensagens não lidas:', err);
                toastHelper.error('Erro ao buscar mensagens não lidas', 'Tente novamente mais tarde');
            })
        }
    }, [chatId]);

    useEffect(() => {
        getChatByTravel(tripId).then((chat) => {
            setChatId(chat.id);
            console.log('Chat:', chat.id);
        }).catch((err) => {
            console.error('Erro ao buscar chat:', err);
            toastHelper.error('Erro ao buscar chat', 'Tente novamente mais tarde');
        });
        getCurrentLocation();
        const interval = setInterval(() => {
            checkTripStatus();
        }, 5000); // Verifica o status da viagem a cada 5 segundos

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let locationInterval: NodeJS.Timeout;
        console.log('isDriverAssigned:', isDriverAssigned);
        console.log('isTripStarted:', isTripStarted);
        if (isDriverAssigned && isTripStarted) {
            console.log('Iniciando a atualização das localizações...');
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
            if (userLocation && role) {
                await updateLocation(tripId, userLocation.latitude, userLocation.longitude, role);
            }
        } catch (error) {
            console.error('Erro ao atualizar a localização:', error);
        }
    };

    const updateLocations = async () => {
        try {
            if (role === 'passenger') {
                const driverLoc = await getLocation(tripId, 'driver').catch(err => {
                    console.error('Erro ao buscar a localização do motorista:', err);
                    throw err;
                }); // Função que busca a localização do motorista
                console.log('Localização do motorista:', driverLoc);
                if (driverLoc.canceled) {
                    toastHelper.info('Viagem cancelada', 'O motorista cancelou a viagem');
                    setIsDriverAssigned(false);
                    setIsTripStarted(false);
                    setOtherLocation(undefined);
                    return;
                }
                setOtherLocation(driverLoc);
            } else {
                const passengerLoc = await getLocation(tripId, 'passenger').catch(err => {
                    console.error('Erro ao buscar a localização do passageiro:', err);
                    throw err;
                }); // Função que busca a localização do passageiro
                console.log('Localização do passageiro:', passengerLoc);
                if (passengerLoc.canceled) {
                    toastHelper.info('Viagem cancelada', 'O passageiro cancelou a viagem');
                    navigate('driver');
                    return;
                }
                setOtherLocation(passengerLoc);
            }
            console.log('Localização do outro usuário atualizada');
        } catch (error) {
            console.error('Erro ao atualizar a localização:', error);
        }
    };

    const checkTripStatus = async () => {
        try {
            console.log('Verificando status da viagem...');
            console.log('isDriverAssigned:', isDriverAssigned);
            console.log('isTripStarted:', isTripStarted);
            if (isDriverAssigned) return;
            console.log('Buscando motorista...', tripId);
            const { driver: tripDriver } = await getTripDriver(tripId);
            console.log('Motorista atribuído:', tripDriver);
            if (tripDriver) {
                setIsDriverAssigned(true);
                console.log('Motorista atribuído:', tripDriver);
                setOtherUserInfo({
                    name: tripDriver.name,
                    avatar: tripDriver.avatarURL,
                });
                console.log('Motorista atribuído:', tripDriver);

                // Atualiza a localização imediatamente após a atribuição do motorista
                updateLocations();
            }
        } catch (error) {
            console.error('Erro ao verificar o status da viagem:', error);
        }
    };

    const calculateRegion = () => {
        const points = [userLocation, pickupCoordinates, destinationCoordinates];

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
    const handleInitTrip = async () => {
        await initTravel(tripId).then(() => {
            setIsTripStarted(true);
            toastHelper.success('Sucesso', 'Viagem iniciada com sucesso');
        }).catch(() => {
            toastHelper.error('Erro', 'Erro ao iniciar a viagem');
        })
    }

    const handleFinishTrip = async () => {
        await finishTravel(tripId).then(() => {
            setIsTripStarted(false);
            toastHelper.success('Sucesso', 'Viagem finalizada com sucesso');
        }).catch(() => {
            toastHelper.error('Erro', 'Erro ao finalizar a viagem');
        })
    }

    const handleCancelTrip = async (tripId: number) => {
        await cancelTravel(tripId, role!).then(() => {
            toastHelper.success('Sucesso', 'Viagem cancelada com sucesso');
            navigate(user?.type ?? 'login');
        }).catch(() => {
            toastHelper.error('Erro', 'Erro ao cancelar a viagem');
        })

        return;
    }

    if (loading) return <LoadingIndicator />;

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho com nome e foto do motorista */}
            {otherUserInfo && (
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        {otherUserInfo.avatar &&
                            <Image source={{ uri: otherUserInfo.avatar }} style={styles.avatar} />
                        }
                        <Text style={styles.userName}>{otherUserInfo.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigate('chat', {
                        chatId,
                        passengerName: otherUserInfo.name,
                        passengerPhoto: otherUserInfo.avatar,
                    })} style={styles.chatContainer}>
                        <Icon name="message1" size={24} color="#fff" />  {/* Ícone de chat */}
                        {unreadCountMessages > 0 && (
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>
                                    <UnreadBadge count={unreadCountMessages} />
                                </Text>
                            </View>
                        )}
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
                <Marker coordinate={destinationCoordinates}
                    title={role === 'passenger' ? 'Seu destino' : `Destino de ${route.params.passenger.name}`}
                    description={destination}
                />
                {userLocation && (
                    <Marker coordinate={userLocation} title="Você" />
                )}
                {otherLocation && (
                    <Marker coordinate={otherLocation} title={role === 'passenger' ? 'Motorista' : 'Passageiro'} />
                )}

                {userLocation && otherLocation && role == 'driver' && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={isTripStarted ? otherLocation : pickupCoordinates}
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
                {/* Contador de tempo de viagem */}
                {isTripStarted && (
                    <View style={styles.tripTimeContainer}>
                        <Text style={styles.tripTimeText}>Tempo de viagem: {Math.floor(tripTime / 60)}:{tripTime % 60 < 10 ? `0${tripTime % 60}` : tripTime % 60}</Text>
                    </View>
                )}
                {role === 'driver' && (
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
                )}
                {!isTripStarted &&
                    <TouchableOpacity
                        style={styles.cancelTripButton}
                        onPress={() => {
                            handleCancelTrip(tripId);
                        }}>
                        <Text style={styles.buttonText}>
                            {role === 'driver' ? 'Cancelar Viagem' : 'Cancelar Corrida'}
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    badgeContainer: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'transparent', // Manter transparente se o UnreadBadge tiver seu próprio estilo
    },
    chatContainer: {
        position: 'relative',
    },
    badgeText: {
        color: '#fff',
    },
    passengerPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
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
