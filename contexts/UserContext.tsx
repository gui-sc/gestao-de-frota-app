import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { createContext, useState } from 'react';
import { RouteList } from '../utils/stackParamRouteList';
type User = {
    id: number;
    type: 'passenger' | 'driver';
    username: string;
    email: string;
    nome: string;
    photo?: string;
    birthDate: string;
    cpf: string;
};


// Cria o contexto
export const UserContext = createContext<{
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}>({
    user: null,
    login: () => { },
    logout: () => { },
});

// Cria o provider
export const UserProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);
    const navigation = useNavigation<RouteList>();
    // Função para logar o  usuário
    const login = (userData: User) => {
        setUser(userData);
        if (userData.type == 'driver') navigation.navigate('driver');
        if (userData.type == 'passenger') navigation.navigate('passenger')
    };

    // Função para deslogar o usuário
    const logout = () => {
        setUser(null);
        navigation.navigate('index');
    };

    return <UserContext.Provider value={{ user, login, logout }}>
        {children}
    </UserContext.Provider>;

};
