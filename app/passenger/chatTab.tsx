import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import UnreadBadge from '../../components/UnreadBadge';
import dayjs from 'dayjs';
import { useNavigation } from 'expo-router';
import { RouteList } from '../../utils/stackParamRouteList';
import { getChatByPassenger } from '../../api/routes';

interface Chat {
  id: string;
  passengerName: string;
  passengerPhoto: string;
  lastMessage: string;
  unreadMessageCount: number;
  lastMessageTime: dayjs.Dayjs; // Ex.: '15:30'
  unread: boolean; // Indicador de mensagens não lidas
}

export default function ChatTabScreen() {
  const [chats, setChats] = useState([])

  useEffect(() => {
    getChatByPassenger('2').then((chats) => {
      console.log("chats", chats);
      setChats(chats);
    })
  }, []);
  const navigation = useNavigation<RouteList>();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Conversas</Text>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Chat }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('chat', { passengerName: item.passengerName, passengerPhoto: item.passengerPhoto })}
            >
              <Image source={{ uri: item.passengerPhoto }} style={styles.photo} />
              <View style={styles.chatDetails}>
                <Text style={[styles.passengerName, item.unread && styles.unread]}>
                  {item.passengerName}
                </Text>
                <Text style={[styles.lastMessage, item.unread && styles.unread]}>{item.lastMessage}</Text>
              </View>
              <View style={styles.messageConfig}>
                <Text style={styles.lastMessageTime}>{item.lastMessageTime.format('HH:mm')}</Text>
                {item.unread && <UnreadBadge count={item.unreadMessageCount} />}
              </View>
            </TouchableOpacity>
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
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#44EAC3',
    borderBottomWidth: 1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 10,
  },
  passengerName: {
    fontSize: 18,
    color: '#fff',
  },
  unread: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#ccc',
  },
  lastMessageTime: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center', // Centraliza o horário na coluna
  },
  messageConfig: {
    flexDirection: 'column', // Alinha o horário e o número em coluna
    alignItems: 'center', // Centraliza horizontalmente
  },
});


