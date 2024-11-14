import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteList } from '../utils/stackParamRouteList';
import { navigate } from './rootNavigation';

export default function PendingApprovalScreen() {
    const navigation = useNavigation<RouteList>();

    const handleLogout = () => {
        // Implementação de logout
        navigate('login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Cadastro Pendente</Text>
                    <Text style={styles.message}>
                        Seu cadastro está em análise. Entraremos em contato assim que ele for aprovado.
                    </Text>
                    <Button title="Sair" onPress={handleLogout} color="#44EAC3" />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#44EAC3',
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
});
