import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    login: undefined;
    chat: { passengerName: string, passengerPhoto: string };
    index: undefined;
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
        }
    };
};

export type RouteList = StackNavigationProp<RootStackParamList>
