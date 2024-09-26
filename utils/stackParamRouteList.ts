import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    login: undefined;
    chat: { passengerName: string, passengerPhoto: string };
    index: undefined;
};

export type RouteList = StackNavigationProp<RootStackParamList>
