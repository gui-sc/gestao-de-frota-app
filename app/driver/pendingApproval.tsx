import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    SafeAreaView,
    Modal,
    TouchableOpacity,
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { navigate } from '../../utils/rootNavigation';

export type DeclineMessage = {
    message: string;
};

type PendingApprovalScreenProps = RouteProp<{
    pendingApproval: {
        driverId: number,
        messages?: DeclineMessage[];
    };
}>

export default function PendingApprovalScreen() {
    const { user, logout } = useContext(UserContext);

    const route = useRoute<PendingApprovalScreenProps>();
    const { driverId, messages } = route.params;
    const [isMainModalVisible, setMainModalVisible] = useState(false);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    const openMainModal = () => setMainModalVisible(true);
    const closeMainModal = () => setMainModalVisible(false);

    const openDetailModal = () => setDetailModalVisible(true)

    const closeDetailModal = () => {
        setDetailModalVisible(false);
        setCurrentMessageIndex(0);
    };

    useEffect(() => {
        console.log('messages', messages);
        if (messages?.length) {
            openMainModal();
        }
    }, [messages]);

    const handleNextMessage = () => {
        if (currentMessageIndex < (messages?.length ?? 1) - 1) {
            setCurrentMessageIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousMessage = () => {
        if (currentMessageIndex > 0) {
            setCurrentMessageIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleUpdateRegister = () => {
        navigate('updateDriverRegistration', {
            driverId
        });
    }

    if (!user) {
        navigate('login');
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Cadastro Pendente</Text>
                {messages?.length ? (
                    <Text style={styles.message}>
                        Olá, {user.name}! Seu cadastro foi RECUSADO. Clique no botão abaixo para ver os detalhes.
                    </Text>
                ) : (
                    <Text style={styles.message}>
                        Olá, {user.name}! Seu cadastro está em análise. Entraremos em contato assim que ele for aprovado.
                    </Text>
                )}
                {messages?.length &&
                    <View style={styles.containerButtons}>
                        <TouchableOpacity style={styles.button} onPress={openDetailModal}>
                            <Text style={styles.buttonText}>Ver Detalhes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleUpdateRegister}>
                            <Text style={styles.buttonText}>Atualizar Cadastro</Text>
                        </TouchableOpacity>
                    </View>

                }
                <Button title="Sair" onPress={logout} color="#44EAC3" />
            </View>

            {/* Modal Principal */}
            {isMainModalVisible && <Modal visible={isMainModalVisible} animationType="fade" transparent>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalMessage}>
                            Seu cadastro foi recusado, clique aqui para saber mais detalhes.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={openDetailModal}>
                            <Text style={styles.buttonText}>Visualizar Mensagens</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={closeMainModal}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>}

            {/* Modal de Detalhes */}
            {isDetailModalVisible && <Modal visible={isDetailModalVisible} animationType="fade" transparent>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Mensagem {currentMessageIndex + 1}</Text>
                        <Text style={styles.modalMessage}>
                            {messages?.[currentMessageIndex]?.message || 'Nenhuma mensagem disponível.'}
                        </Text>
                        <View style={styles.pagination}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handlePreviousMessage}
                                disabled={currentMessageIndex === 0}
                            >
                                <Text style={styles.buttonText}>Anterior</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleNextMessage}
                                disabled={currentMessageIndex === (messages?.length ?? 1) - 1}
                            >
                                <Text style={styles.buttonText}>Próxima</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={closeDetailModal}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>}
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
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '75%',
    },
    content: {
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#000',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#44EAC3',
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
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#44EAC3',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
    },
    modalMessage: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#44EAC3',
        marginBottom: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 20,
    },
});
