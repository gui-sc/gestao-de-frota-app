import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
    login: undefined;
    index: undefined;
};

export type RouteList = StackNavigationProp<RootStackParamList>
