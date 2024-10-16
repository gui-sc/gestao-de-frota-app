import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from 'expo-router';
import { RouteList } from '@/utils/stackParamRouteList';
import { getLastTravels } from '../../api/routes';
import LoadingIndicator from '../../components/Loading';
import dayjs from 'dayjs';
export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<RouteList>();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLastTravels('1', 'passenger').then((trips) => {
      setTrips(trips);
    }).catch(err => console.log(err)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  const handleNewTrip = () => {
    navigation.navigate('chooseDestination');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Olá, Usuario!</Text>
        <Text style={styles.sectionTitle}>Últimas Viagens</Text>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemText}>{item.destination}</Text>
              <Text style={styles.itemText}>
                {dayjs(item.finalTime).format('DD/MM/YYYY')} às {dayjs(item.finalTime).format('HH:mm')}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity onPress={handleNewTrip} style={styles.button}>
          <Text style={styles.buttonText}>Nova Viagem</Text>
        </TouchableOpacity>

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
  itemText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#44EAC3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  }
});
