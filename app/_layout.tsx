import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider, UserContext } from '../contexts/UserContext'; // Importa UserContext
import Toast from 'react-native-toast-message';
import { Stack } from 'expo-router';
import { navigationRef } from './rootNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/stackParamRouteList';
import LoginScreen from './login';
import HomeScreenDriver from './driver/home';
import HomeScreenPassenger from './passenger/home';
import ChatScreen from './chat';
import PendingTrip from './pendingTrip';
import ChooseDestination from './chooseDestination';
import MapScreen from './map';
import DriverRegistrationScreen from './driverRegistration';
import PassengerRegistrationScreen from './passengerRegistration';
import PendingApprovalScreen from './pendingApproval';
import TabLayout from './driver/_layout';
const RootStack = createStackNavigator<RootStackParamList>();
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { user } = useContext(UserContext); // Pega o estado do usuário

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <UserProvider>
          <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'login'}>
            <RootStack.Screen name="login"
              options={{ headerShown: false }}
              component={LoginScreen} />
            <RootStack.Screen name="driver" options={{ headerShown: false }} component={TabLayout} />
            <RootStack.Screen name="passenger" options={{ headerShown: false }} component={HomeScreenPassenger} />
            <RootStack.Screen name="chat" options={{ headerShown: false }} component={ChatScreen} />
            <RootStack.Screen name="pendingTrip" options={{ headerShown: false }} component={PendingTrip} />
            <RootStack.Screen name="chooseDestination" options={{ headerShown: false }} component={ChooseDestination} />
            <RootStack.Screen name="map" options={{ headerShown: false }} component={MapScreen} />
            <RootStack.Screen name="driverRegistration" options={{ headerShown: false }} component={DriverRegistrationScreen} />
            <RootStack.Screen name="passengerRegistration" options={{ headerShown: false }} component={PassengerRegistrationScreen} />
            <RootStack.Screen name="pendingApproval" options={{ headerShown: false }} component={PendingApprovalScreen} />
          </RootStack.Navigator>
          <Toast />
        </UserProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
