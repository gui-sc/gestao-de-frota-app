import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import TripDetailsModal from '../../components/TripDetailsModal'; // Importando o modal
import { Trip } from '@/types/trip';

export default function HomeScreen() {
  const { user, logout } = useContext(UserContext);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const trips = [
    {
      id: '1',
      passengerName: 'Carlos Silva',
      passengerPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
      distanceToPickup: '2 km',
      totalDistance: '10 km',
      fare: 'R$ 30,00',
      pickupCoordinates: { latitude: -22.9068, longitude: -43.1729 },
      dropoffCoordinates: { latitude: -23.5505, longitude: -46.6333 },
    },
    {
      id: '2',
      passengerName: 'Maria Oliveira',
      passengerPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      distanceToPickup: '5 km',
      totalDistance: '15 km',
      fare: 'R$ 45,00',
      pickupCoordinates: { latitude: -22.9083, longitude: -43.1964 },
      dropoffCoordinates: { latitude: -22.2916, longitude: -43.6884 },
    },
    {
      id: '3',
      passengerName: 'João Pereira',
      passengerPhoto: 'https://randomuser.me/api/portraits/men/2.jpg',
      distanceToPickup: '3 km',
      totalDistance: '12 km',
      fare: 'R$ 40,00',
      pickupCoordinates: { latitude: -22.9068, longitude: -43.1729 },
      dropoffCoordinates: { latitude: -22.9083, longitude: -43.1964 },
    },
  ];

  const openModal = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const closeModal = () => {
    setSelectedTrip(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Olá, {user ? user.username : "Motorista"}!</Text>

        <Text style={styles.sectionTitle}>Viagens Solicitadas</Text>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item)}>
              <View style={styles.item}>
                <View style={styles.row}>
                  <Image source={{ uri: item.passengerPhoto }} style={styles.photo} />
                  <Text style={styles.itemText}>{item.passengerName}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.itemText}>Distância até o ponto: {item.distanceToPickup}</Text>
                  <Text style={styles.itemText}>Distância total: {item.totalDistance}</Text>
                  <Text style={styles.itemText}>Valor: {item.fare}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />


        <Button title="Logout" onPress={logout} color="#44EAC3" />

        {/* Modal com detalhes da viagem */}
        {selectedTrip && <TripDetailsModal visible={!!selectedTrip} trip={selectedTrip} onClose={closeModal} />}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    fontSize: 28,
    color: '#44EAC3',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#44EAC3',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomColor: '#44EAC3',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemText: {
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    marginLeft: 50, // Para alinhar melhor com o nome
  },
});
