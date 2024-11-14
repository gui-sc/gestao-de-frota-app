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

type ActiveTravel = {
    pickupCoordinates: {
        latitude: number;
        longitude: number;
    };
    dropoffCoordinates: {
        latitude: number;
        longitude: number;
    };
    driver: {
        name: string;
        avatar?: string;
    };
    driverLocation?: {
        latitude: number;
        longitude: number;
    };
    passenger: {
        name: string;
        avatar?: string;
    };
    tripId: number
}

// Cria o contexto
export const UserContext = createContext<{
    user: User | null;
    login: (userData: User, activeTravel: ActiveTravel | undefined) => void;

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
    const login = (userData: User, activeTravel: ActiveTravel | undefined) => {
        setUser(userData);
        if (userData.active === false) {
            navigation.navigate('pendingApproval');
            return;
        }
        if (activeTravel) {
            navigation.navigate('pendingTrip', {
                pickupCoordinates: activeTravel.pickupCoordinates,
                destinationCoordinates: activeTravel.dropoffCoordinates,
                passenger: activeTravel.passenger,
                tripId: activeTravel.tripId
            });
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
