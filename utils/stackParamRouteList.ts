import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    index: undefined;
    pendingTrip: {
        pickupCoordinates: {
            latitude: number;
            longitude: number;
        };
        destinationCoordinates: {
            latitude: number;
            longitude: number;
        };
        passenger: {
            name: string;
            avatar?: string;
        };
        tripId: number
    };
    chat: {
        chatId: number
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
    driverRegistration: undefined;
    passengerRegistration: undefined;
};

export type RouteList = StackNavigationProp<RootStackParamList>
