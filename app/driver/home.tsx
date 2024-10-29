import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { getImportantDates, getLastTravels } from '../../api/routes';
import LoadingIndicator from '../../components/Loading';
import dayjs from 'dayjs';
import { useNavigation } from 'expo-router';
import { RouteList } from '../../utils/stackParamRouteList';
export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const [trips, setTrips] = useState<any[]>([]);
  const [importantDates, setImportantDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<RouteList>();


  useEffect(() => {
    setLoading(true);
    if (!user) {
      return;
    }
    Promise.all([
      getLastTravels(user.id, 'driver').then((trips) => {
        console.log("trips", trips);
        setTrips(trips);
      }).catch(err => console.log("err in trips", err)),
      getImportantDates(user.id).then((dates) => {
        console.log("dates", dates);
        setImportantDates(dates);
      }).catch(err => console.log("err in dates", err))
    ]).catch(err => console.log(err)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('user', user)
    if (!user || user.type !== 'driver') {
      return navigation.navigate('index');
    }
  }, [])

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Olá, {user?.nome}!</Text>

        <Text style={styles.sectionTitle}>Últimas Viagens</Text>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.destination}</Text>
              <Text style={styles.itemText}>
                {dayjs(item.finalTime).format('DD/MM/YYYY')} às {dayjs(item.finalTime).format('HH:mm')}
              </Text>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Datas Importantes</Text>
        <FlatList
          data={importantDates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>
                {dayjs(item.date).format('DD/MM/YYYY')} às {dayjs(item.date).format('HH:mm')}
              </Text>
            </View>
          )}
        />

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
});
