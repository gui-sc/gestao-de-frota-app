import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { RouteList } from '@/utils/stackParamRouteList';
import { getLastTravels } from '../../api/routes';
import LoadingIndicator from '../../components/Loading';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import BottomTabs from '../../components/BottomTabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { navigate } from '../rootNavigation';

export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<RouteList>();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return navigate('login');
    }
    setLoading(true);
    getLastTravels(user.id, 'passenger')
      .then((trips) => {
        setTrips(trips);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleNewTrip = () => {
    navigate('chooseDestination');
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  const routes = [
    { label: 'Home', icon: <Icon name="home" size={24} color="#44EAC3" />, route: 'passenger' },
    { label: 'Conversas', icon: <Icon name="chat" size={24} color="#44EAC3" />, route: 'passengerChatTab' },
    { label: 'Perfil', icon: <Icon name="person" size={24} color="#44EAC3" />, route: 'passengerProfile' },
  ];

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
  },
});
