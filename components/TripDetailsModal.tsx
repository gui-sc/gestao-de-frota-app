import { Trip } from '@/types/trip';
import { useNavigation } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, Image } from 'react-native';
import { RouteList } from '../utils/stackParamRouteList';
import { API_KEY } from '../constants/Env';
import { acceptTravel } from '../api/routes';
import { UserContext } from '../contexts/UserContext';
import toastHelper from '../utils/toast';

const TripDetailsModal = ({
    visible,
    trip,
    onClose
}: {
    visible: boolean,
    trip: Trip | null,
    onClose: () => void
}) => {
    const navigation = useNavigation<RouteList>();

    const { user } = useContext(UserContext);
    if (!trip || !user) return null;

    const handleAcceptTrip = async () => {
        await acceptTravel(trip.id, user.id).then(() => {
            navigation.navigate('pendingTrip', {
                tripId: trip.id,
                pickupCoordinates: trip.pickupCoordinates,
                destinationCoordinates: trip.dropoffCoordinates,
                passenger: {
                    name: trip.passengerName,
                    avatar: trip.passengerPhoto,
                }
            });
        }).catch(err => {
            console.log('error', err);
            toastHelper.error('Erro ao aceitar viagem', 'Tente novamente mais tarde');
        });
        onClose();
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Detalhes da Viagem</Text>

                    {/* Foto e nome do passageiro */}
                    <View style={styles.passengerInfo}>
                        <Image source={{ uri: trip.passengerPhoto }} style={styles.passengerPhoto} />
                        <Text style={styles.passengerName}>{trip.passengerName}</Text>
                    </View>

                    {/* Valor da viagem */}
                    <Text style={styles.modalText}>Valor: {trip.fare}</Text>

                    {/* Mapa (substitua pelo URI do mapa correspondente) */}
                    <Image
                        source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${trip.pickupCoordinates.latitude},${trip.pickupCoordinates.longitude}&zoom=14&size=400x200&markers=color:red%7Clabel:P%7C${trip.pickupCoordinates.latitude},${trip.pickupCoordinates.longitude}&key=${API_KEY}` }}
                        style={styles.mapImage}
                    />

                    <Button title="Aceitar Viagem" onPress={handleAcceptTrip} color="#44EAC3" />
                    <Button title="Fechar" onPress={onClose} color="#FF0000" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#222',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 24,
        color: '#44EAC3',
        marginBottom: 10,
        textAlign: 'center', // Centralizando o título
    },
    passengerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
    },
    modalText: {
        color: '#fff',
        marginBottom: 10,
    },
    mapImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default TripDetailsModal;
