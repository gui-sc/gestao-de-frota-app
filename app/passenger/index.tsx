import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from 'expo-router';
import { RouteList } from '@/utils/stackParamRouteList';
export default function HomeScreen() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<RouteList>();
  const viagens = [
    { id: '1', destino: 'Rio de Janeiro', data: '12/09/2024' },
    { id: '2', destino: 'São Paulo', data: '08/09/2024' },
    { id: '3', destino: 'Belo Horizonte', data: '02/09/2024' },
  ];

  const handleNewTrip = () => {
    navigation.navigate('chooseDestination');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Olá, {user ? user.username : "undefined"}!</Text>

        <Text style={styles.sectionTitle}>Últimas Viagens</Text>
        <FlatList
          data={viagens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.destino}</Text>
              <Text style={styles.itemText}>{item.data}</Text>
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
