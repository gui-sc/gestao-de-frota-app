import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { createContext, useState } from 'react';
import { RouteList } from '../utils/stackParamRouteList';
type User = {
    id: number;
    type: 'passenger' | 'driver';
    email: string;
    name: string;
    last_name: string;
    birth_date: string;
    cpf: string;
    phone: string;
    active: boolean;
    avatar?: string;
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
        if (userData.active === false) {
            navigation.navigate('pendingApproval');
            return;
        }
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
