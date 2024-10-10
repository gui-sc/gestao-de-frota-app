import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { getMessages, sendMessage } from '../api/routes';
import { UserContext } from '../contexts/UserContext';

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: number;
}

type ChatScreenRouteProp = RouteProp<{ chat: { passengerName: string; passengerPhoto: string } }>

export default function ChatScreen() {
    const { user } = useContext(UserContext);
    const route = useRoute<ChatScreenRouteProp>();
    const { passengerName, passengerPhoto } = route.params;

    const [messages, setMessages] = React.useState<Message[]>([
        { id: '2', text: 'Pode me buscar em 10 minutos?', sender: passengerName, timestamp: new Date().getTime() },
    ]);
    const [newMessage, setNewMessage] = React.useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            sendMessage('1', user?.type == 'Driver' ? '1' : '2', newMessage)
            setNewMessage('');
        }
    };

    useEffect(() => {
        getMessages('1').then((messages) => {
            setMessages(messages);
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <View style={styles.headerContainer}>
                    <Image source={{ uri: passengerPhoto }} style={styles.passengerPhoto} />
                    <Text style={styles.passengerName}>{passengerName}</Text>
                </View>

                <FlatList
                    data={messages}
                    inverted // Para começar pela última mensagem
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={item.sender === 'Você' ? styles.myMessage : styles.theirMessage}>
                            <Text style={item.sender === 'Você' ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
                            <Text style={item.sender === "Você" ? styles.myMessageTime : styles.theirMessageTime}>
                                {dayjs(item.timestamp).format('HH:mm')}
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
