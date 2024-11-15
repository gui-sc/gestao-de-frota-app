import React, { createContext, useState } from 'react';
import { navigate } from '../utils/rootNavigation';
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

type DeclineMessage = {
    message: string;
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
    login: (userData: User, activeTravel?: ActiveTravel, messages?: DeclineMessage[]) => void;

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
    // Função para logar o  usuário
    const login = (userData: User, activeTravel?: ActiveTravel, messages?: DeclineMessage[]) => {
        setUser(userData);
        if (userData.active === false) {
            navigate('pendingApproval', { messages: [{
                message: 'Mande mais fotos do carro',
            },{
                message: 'A foto da CNH está ilegível',
            }] });
            return;
        }
        if (activeTravel) {
            navigate('pendingTrip', {
                pickupCoordinates: activeTravel.pickupCoordinates,
                destinationCoordinates: activeTravel.dropoffCoordinates,
                passenger: activeTravel.passenger,
                tripId: activeTravel.tripId,
                driver: activeTravel.driver,
                driverLocation: activeTravel.driverLocation
            });
            return;
        }
        if (userData.type == 'driver') navigate('driver');
        if (userData.type == 'passenger') navigate('passenger')
    };

    // Função para deslogar o usuário
    const logout = () => {
        setUser(null);
        navigate('login');
    };

    return <UserContext.Provider value={{ user, login, logout }}>
        {children}
    </UserContext.Provider>;

};
