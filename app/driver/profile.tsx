import React, { useEffect, useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { maskToCpf } from '@/utils/mask';
import toast from '../../utils/toast';
import InputPicture from '../../components/InputPicture';
import dayjs from 'dayjs';

export default function TabFourScreen() {
    const { user, logout } = useContext(UserContext);
    const [dataNascimento, setDataNascimento] = useState<dayjs.Dayjs | null>(dayjs(user?.birth_date));
    const [foto, setFoto] = useState<string>(user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg');

    useEffect(()=>{
        if(user){
            console.log(`O user é ${user.type}`)
        }
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image
                        source={{ uri: foto }}
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
