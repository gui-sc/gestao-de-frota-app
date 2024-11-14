import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import UnreadBadge from '../../components/UnreadBadge';
import dayjs from 'dayjs';
import { RouteList } from '../../utils/stackParamRouteList';
import { getChatByPassenger } from '../../api/routes';
import LoadingIndicator from '../../components/Loading';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

interface Chat {
  chat_id: number;
  driver: number;
  passenger: string;
  driver_name: string;
  avatar: string;
  lastMessage: string;
  unread_count: number;
  last_message_time: dayjs.Dayjs; // Ex.: '15:30'
}
export default function ChatTabScreen() {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<RouteList>();
  useEffect(() => {
    if (!user) {
      return navigation.navigate('index');
    }
    setLoading(true);
    getChatByPassenger(user.id).then((chats) => {
      console.log("chats", chats);
      setChats(chats);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Conversas</Text>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chat_id.toString()}
          renderItem={({ item }: { item: Chat }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('chat', { chatId: item.chat_id, passengerName: item.driver_name, passengerPhoto: item.avatar })}
            >
              <Image source={{ uri: item.avatar }} style={styles.photo} />
              <View style={styles.chatDetails}>
                <Text style={[styles.passengerName, item.unread_count > 0 && styles.unread]}>
                  {item.driver_name}
                </Text>
                <Text style={[styles.lastMessage, item.unread_count > 0 && styles.unread]}>{item.lastMessage}</Text>
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


