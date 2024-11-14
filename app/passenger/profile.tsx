import React, { useEffect, useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { maskToCpf } from '@/utils/mask';
import toast from '../../utils/toast';
import InputPicture from '../../components/InputPicture';
import dayjs from 'dayjs';
import { updateAvatar } from '../../api/routes';
import toastHelper from '../../utils/toast';
import BottomTabs from '../../components/BottomTabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function UserProfileScreen() {
    const { user, logout } = useContext(UserContext);
    const [dataNascimento, setDataNascimento] = useState<dayjs.Dayjs | null>(dayjs(user?.birth_date));
    const [foto, setFoto] = useState<string | null>(user?.avatar || null);
    useEffect(() => {
        if (!user) return
        const formData = new FormData();
        formData.append('profile_picture', {
            uri: foto,
            name: `profilePhoto.${foto?.split('.').pop()}`,
            type: `image/${foto?.split('.').pop()}`
        } as any)
        updateAvatar(user?.id, formData).then((response) => {
            toastHelper.success('Sucesso', 'Foto de perfil atualizada com sucesso');
        }).catch((error) => {
            toastHelper.error('Erro', 'Erro ao atualizar foto de perfil');
            setFoto(user.avatar || null);
        })
    }, [foto])
    const routes = [
        { label: 'Home', icon: <Icon name="home" size={24} color="#44EAC3" />, route: 'passenger' },
        { label: 'Conversas', icon: <Icon name="chat" size={24} color="#44EAC3" />, route: 'passengerChatTab' },
        { label: 'Perfil', icon: <Icon name="person" size={24} color="#44EAC3" />, route: 'passengerProfile' },
      ];
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: foto || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                        style={styles.image}
                        resizeMode='contain'
                    />
                    <Text style={styles.header}>{user?.name}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <Text style={styles.info}>{user?.name} {user?.last_name}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Data de Nascimento</Text>
                    <Text style={styles.info}>{dataNascimento?.format("DD/MM/YYYY")}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>CPF</Text>
                    <Text style={styles.info}>{maskToCpf(user?.cpf || '')}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>E-mail</Text>
                    <Text style={styles.info}>{user?.email}</Text>
                </View>

                <InputPicture showFile={false} onChange={setFoto} />
                <TouchableOpacity onPress={logout} style={styles.button}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </ScrollView>
            <BottomTabs routes={routes} />
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
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 10,
    },
    changePhotoText: {
        color: '#44EAC3',
        textAlign: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 15,
    },
    label: {
        color: '#44EAC3',
        fontSize: 16,
    },
    info: {
        color: '#fff',
        fontSize: 18,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#44EAC3',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        width: '30%',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    }
});
