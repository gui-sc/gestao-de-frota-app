import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { getMessages, readMessages, sendMessage } from '../api/routes';
import { UserContext } from '../contexts/UserContext';
import LoadingIndicator from '../components/Loading';
import toastHelper from '../utils/toast';
import { navigate } from './rootNavigation';

interface Message {
    id: string;
    text: string;
    sender: number;
    timestamp: number;
}

type ChatScreenRouteProp = RouteProp<{
    chat: {
        chatId: number,
        passengerName: string,
        passengerPhoto?: string,
    }
}>

export default function ChatScreen() {
    const { user } = useContext(UserContext);
    const route = useRoute<ChatScreenRouteProp>();
    const { chatId, passengerName, passengerPhoto } = route.params;
    const [loading, setLoading] = React.useState(true);
    const [seconds, setSeconds] = React.useState(0);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [newMessage, setNewMessage] = React.useState('');
    const handleSendMessage = () => {
        if (!user) {
            toastHelper.info('Ops', 'Você precisa estar logado para enviar mensagens');
            return navigate('index');
        }
        if (newMessage.trim()) {
            sendMessage(chatId, newMessage, user.id).then(() => {
                console.log("message sent");
                getMessagesAsync();
            }).catch(err => console.log(err));
            setNewMessage('');
        }
    };

    const getMessagesAsync = async () => {
        console.log("getting messages", chatId);
        getMessages(chatId).then((messages) => {
            console.log("messages", messages);
            setMessages(messages);
        }).catch(err => console.log(err)).finally(() => setLoading(false));
    }

    useEffect(() => {
        if (!user) return;
        readMessages(chatId, user.id).catch(err => {
            console.log(err);
            toastHelper.error('Erro ao marcar mensagens como lidas', 'Tente novamente mais tarde');
        });
        if (seconds % 5 === 0) {
            getMessagesAsync();
        }
        new Promise<void>((resolve) => setTimeout(() => {
            setSeconds(seconds + 1);
            resolve();
        }, 1000));

    }, [seconds])

    if (!user) {
        navigate('index');
        return
    }

    if (loading) return <LoadingIndicator />;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <View style={styles.headerContainer}>
                    {passengerPhoto && <Image source={{ uri: passengerPhoto }} style={styles.passengerPhoto} />}
                    <Text style={styles.passengerName}>{passengerName}</Text>
                </View>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={item.sender === user.id ? styles.myMessage : styles.theirMessage}>
                            <Text style={item.sender === user.id ? styles.myMessageText : styles.theirMessageText}>{item.content}</Text>
                            <Text style={item.sender === user.id ? styles.myMessageTime : styles.theirMessageTime}>
                                {dayjs(item.updatedAt).format('HH:mm')}
                            </Text>
                        </View>
                    )}
                    style={styles.messagesList}
                    keyboardShouldPersistTaps="handled" // Para garantir a interação correta com o teclado
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        style={styles.input}
                        placeholder="Digite sua mensagem"
                        placeholderTextColor="#ccc"
                        multiline // Permitir quebra de linha // Limitar o crescimento do input
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.button}>
                        <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    passengerPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    passengerName: {
        fontSize: 24,
        color: '#44EAC3',
    },
    messagesList: {
        flex: 1,
        paddingEnd: 8
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#44EAC3',
        color: '#000',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '70%',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#444',
        padding: 10,
        color: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '70%',
    },
    myMessageText: {
        color: '#000',
        textAlign: 'left',
    },
    theirMessageText: {
        color: '#fff',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    button: {
        backgroundColor: '#44EAC3',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    theirMessageTime: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    myMessageTime: {
        color: '#000',
        fontSize: 12,
        marginTop: 5,
        alignSelf: 'flex-start',
    },
});
