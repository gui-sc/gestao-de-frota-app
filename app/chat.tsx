import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

interface Message {
    id: string;
    text: string;
    sender: string;
}

type ChatScreenRouteProp = RouteProp<{ chat: { passengerName: string; passengerPhoto: string } }>

export default function ChatScreen() {
    const route = useRoute<ChatScreenRouteProp>()
    const { passengerName, passengerPhoto } = route.params;

    const [messages, setMessages] = React.useState<Message[]>([
        { id: '2', text: 'Pode me buscar em 10 minutos?', sender: passengerName },
    ]);
    const [newMessage, setNewMessage] = React.useState('');

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                { id: Date.now().toString(), text: newMessage, sender: 'Você' },
                { id: (Date.now() + 1).toString(), text: "Ok", sender: passengerName }]);
            setNewMessage(''); // Limpar o campo de entrada
        }
    };

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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={item.sender === 'Você' ? styles.myMessage : styles.theirMessage}>
                            <Text style={item.sender === 'Você' ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
                        </View>
                    )}
                    style={styles.messagesList}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        style={styles.input}
                        placeholder="Digite sua mensagem"
                        placeholderTextColor="#ccc"
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.button}>
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
    },
    theirMessageText: {
        color: '#fff',
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
    },
    button: {
        backgroundColor: '#44EAC3',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    }
});
