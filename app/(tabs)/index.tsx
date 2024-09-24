import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, SafeAreaView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import toastHelper from '@/utils/toast';
import Toast from 'react-native-toast-message';
export default function HomeScreen() {
  const { user, logout } = useContext(UserContext);

  const viagens = [
    { id: '1', destino: 'Rio de Janeiro', data: '12/09/2024' },
    { id: '2', destino: 'São Paulo', data: '08/09/2024' },
    { id: '3', destino: 'Belo Horizonte', data: '02/09/2024' },
  ];

  const datasImportantes = [
    { id: '1', evento: 'Vencimento da carteira', data: '15/10/2024' },
    { id: '2', evento: 'Revisão do carro', data: '30/09/2024' },
  ];

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

        <Text style={styles.sectionTitle}>Datas Importantes</Text>
        <FlatList
          data={datasImportantes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.evento}</Text>
              <Text style={styles.itemText}>{item.data}</Text>
            </View>
          )}
        />

        <Button title="Logout" onPress={logout} color="#44EAC3" />
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
