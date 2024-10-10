import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { getImportantDates, getLastTravels } from '../../api/routes';
export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const [trips, setTrips] = useState<any[]>([]);
  const [importantDates, setImportantDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    getLastTravels('1', 'driver').then((trips) => {
      setTrips(trips);
    });
    getImportantDates('1').then((dates) => {
      setImportantDates(dates);
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Olá, Motorista!</Text>

        <Text style={styles.sectionTitle}>Últimas Viagens</Text>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.destino}</Text>
              <Text style={styles.itemText}>{item.data}</Text>
            </View>
          )}
        />

        <Text style={styles.sectionTitle}>Datas Importantes</Text>
        <FlatList
          data={importantDates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.evento}</Text>
              <Text style={styles.itemText}>{item.data}</Text>
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
