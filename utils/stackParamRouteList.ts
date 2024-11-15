import { StackNavigationProp } from "@react-navigation/stack";
import { DeclineMessage } from "../app/pendingApproval";

export type RootStackParamList = {
    login: undefined;
    driverChatTab: undefined;
    driverProfile: undefined;
    tripTab: undefined;
    passengerChatTab: undefined;
    passengerProfile: undefined;
    pendingTrip: {
        pickupCoordinates: {
            latitude: number;
            longitude: number;
        };
        destinationCoordinates: {
            latitude: number;
            longitude: number;
        };
        driverLocation?: {
            latitude: number;
            longitude: number;
        };
        driver?: {
            name: string;
            avatar?: string;
        };
        passenger: {
            name: string;
            avatar?: string;
        };
        tripId: number
    };
    chat: {
        chatId: number,
        passengerName: string,
        passengerPhoto?: string,
    };
    driver: undefined;
    passenger: undefined;
    chooseDestination: undefined;
    map: {
        pickupCoordinates: {
            latitude: number;
            longitude: number;
        };
        destinationCoordinates: {
            latitude: number;
            longitude: number;
        };
        user: {
            name: string;
            photo: string;
        };
        routeId: number;
    };
    updateDriverRegistration: {
        driverId?: number;
    };
    driverRegistration: undefined;
    passengerRegistration: undefined;
    pendingApproval: {
        messages?: DeclineMessage[];
    };
};

export type RouteList = StackNavigationProp<RootStackParamList>
