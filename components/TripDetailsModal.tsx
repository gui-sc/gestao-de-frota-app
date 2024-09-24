import { Trip } from '@/types/trip';
import React, { useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, Image } from 'react-native';

const TripDetailsModal = ({
    visible,
    trip,
    onClose
}: {
    visible: boolean,
    trip: Trip | null,
    onClose: () => void
}) => {
    if (!trip) return null;

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
                        source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${trip.pickupCoordinates.latitude},${trip.pickupCoordinates.longitude}&zoom=14&size=400x200&markers=color:red%7Clabel:P%7C${trip.pickupCoordinates.latitude},${trip.pickupCoordinates.longitude}&key=${process.env.API_KEY}` }}
                        style={styles.mapImage}
                    />

                    <Button title="Aceitar Viagem" onPress={onClose} color="#44EAC3" />
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
