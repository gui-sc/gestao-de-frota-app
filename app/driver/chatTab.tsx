import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import UnreadBadge from '../../components/UnreadBadge';
import dayjs from 'dayjs';
import { useNavigation } from 'expo-router';
import { RouteList } from '../../utils/stackParamRouteList';
import { getChatByDriver } from '../../api/routes';
import LoadingIndicator from '../../components/Loading';

interface Chat {
  id: string;
  passengerName: string;
  passengerPhoto: string;
  lastMessage: string;
  unreadMessageCount: number;
  last_message_time: dayjs.Dayjs; // Ex.: '15:30'
  unread: boolean; // Indicador de mensagens não lidas
}

export default function ChatTabScreen() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getChatByDriver('1').then((chats) => {
      console.log("chats", chats);
      setChats(chats);
    }).finally(() => setLoading(false));
  }, []);
  const navigation = useNavigation<RouteList>();

  if (loading) return <LoadingIndicator />;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Conversas</Text>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('chat', { chatId: item.chat_id })}
            >
              <Image source={{ uri: item.passengerPhoto }} style={styles.photo} />
              <View style={styles.chatDetails}>
                <Text style={[styles.passengerName, item.unread_count && styles.unread]}>
                  {item.passengerName}
                </Text>
                <Text style={[styles.lastMessage, item.unread_count && styles.unread]}>{item.lastMessage}</Text>
              </View>
              <View style={styles.messageConfig}>
                <Text style={styles.last_message_time}>{dayjs(item.last_message_time).format('HH:mm')}</Text>
                {item.unread_count && <UnreadBadge count={Number(item.unread_count)} />}
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
  last_message_time: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center', // Centraliza o horário na coluna
  },
  messageConfig: {
    flexDirection: 'column', // Alinha o horário e o número em coluna
    alignItems: 'center', // Centraliza horizontalmente
  },
});


