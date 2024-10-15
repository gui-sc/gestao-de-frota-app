import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    index: undefined;
    chat: { chatId: number };
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
        }
    };
};

export type RouteList = StackNavigationProp<RootStackParamList>
