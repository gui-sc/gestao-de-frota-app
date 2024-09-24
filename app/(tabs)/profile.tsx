import React, { useEffect, useState, useContext } from 'react';
import { Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import InputPicture from '@/components/InputPicture';
import { maskToCpf, maskToDate } from '@/utils/mask';
import toast from '../../utils/toast'

export default function TabFourScreen() {
    const { user } = useContext(UserContext);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('');
    const [foto, setFoto] = useState<string | null>(null);
    const [cnh, setCnh] = useState<string | null>(null);
    const [identidade, setIdentidade] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            // Simulação de chamada à API para buscar os dados do usuário
            const fetchUserData = async () => {
                // Aqui você deve substituir pela chamada real à sua API
                const response = await fetch(`https://api.exemplo.com/users/${user.username}`);
                const data = await response.json();
                setNomeCompleto(data.nomeCompleto);
                setDataNascimento(data.dataNascimento);
                setCpf(data.cpf);
                setFoto(data.foto);
            };

            fetchUserData();
        }
    }, [user]);


    const handleSave = async () => {
        // Simulação de chamada à API para salvar os dados alterados
        try {
            if (user) {
                const response = await fetch(`https://api.exemplo.com/users/${user.username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nomeCompleto,
                        dataNascimento,
                        cpf,
                        foto,
                    }),
                });

                if (response.ok) {
                    toast.success('Sucesso', 'Informações salvas com sucesso!');
                } else {
                    throw new Error('Erro ao salvar informações.');
                }
            }
        } catch (error: any) {
            toast.error('Erro', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Perfil do Usuário</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                />
                <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="Data de Nascimento (DD/MM/AAAA)"
                    value={dataNascimento}
                    onChangeText={(e) => { setDataNascimento(maskToDate(e)) }}
                />
                <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="CPF"
                    value={cpf}
                    onChangeText={(e) => { setCpf(maskToCpf(e)) }}
                />

                <TextInput
                    style={styles.input}
                    inputMode='email'
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                />

                <InputPicture label="CNH" onChange={setCnh} />
                <InputPicture label="Identidade" onChange={setIdentidade} />

                <Button title="Salvar" onPress={handleSave} color="#44EAC3" />
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
    input: {
        height: 40,
        borderColor: '#44EAC3',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: '#fff',
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 15,
    },
});
