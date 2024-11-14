import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import TripDetailsModal from '../../components/TripDetailsModal'; // Importando o modal
import { Trip } from '@/types/trip';
import { getByRange } from '../../api/routes';
import * as Location from 'expo-location';
import toastHelper from '../../utils/toast';
import LoadingIndicator from '../../components/Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTabs from '../../components/BottomTabs';

export default function TripListScreen() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [radius, setRadius] = useState<number>(2);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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

    }
  };

  const openModal = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const closeModal = () => {
    setSelectedTrip(null);
  };

  const searchTrip = async () => {
    if (!location) {
      setLoading(true);
      await getCurrentLocation().finally(() => setLoading(false));
    } else {
      setLoading(true);
      await getByRange(location.latitude, location.longitude, radius).then(data => {
        setTrips(data.map((trip: any) => {
          console.log(trip);
          return {
            id: trip.id,
            passengerName: trip.passenger_name,
            passengerPhoto: trip.avatar,
            distanceToPickup: (trip.distance / 1000).toFixed(2) + ' km',
            totalDistance: (trip.total_distance / 1000).toFixed(2) + ' km',
            fare: `R$ ${trip.value.toFixed(2).replace('.', ',')}`,
            pickupCoordinates: { latitude: trip.latitude_origin, longitude: trip.longitude_origin },
            dropoffCoordinates: { latitude: trip.latitude_destination, longitude: trip.longitude_destination },
          }
        }))
      }).catch((error) => {
        console.log(error);
        toastHelper.error('Ops!', 'Erro ao buscar viagens');
      }).finally(() => {
        setLoading(false);
      })
    }
  }

  useEffect(() => {
    searchTrip();
  }, [location, radius]);

  const routes = [
    { label: 'Home', icon: <Icon name="home" size={24} color="#44EAC3" />, route: 'driver' },
    { label: 'Conversas', icon: <Icon name="chat" size={24} color="#44EAC3" />, route: 'driverChatTab' },
    { label: 'Viagens', icon: <Icon name="map" size={24} color="#44EAC3" />, route: 'tripTab' },
    { label: 'Perfil', icon: <Icon name="person" size={24} color="#44EAC3" />, route: 'driverProfile' },
  ];
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Viagens Solicitadas</Text>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
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

        {/* Modal com detalhes da viagem */}
        {selectedTrip && <TripDetailsModal visible={!!selectedTrip} trip={selectedTrip} onClose={closeModal} />}

      </View>
      <BottomTabs routes={routes} />
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
