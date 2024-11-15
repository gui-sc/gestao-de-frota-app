import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '../contexts/UserContext'; // Importa UserContext
import Toast from 'react-native-toast-message';
import { navigationRef } from '../utils/rootNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/stackParamRouteList';
import LoginScreen from './login';
import HomeScreenDriver from './driver/home';
import HomeScreenPassenger from './passenger/home';
import ChatScreen from './chat/chat';
import PendingTrip from './travel/pendingTrip';
import ChooseDestination from './travel/chooseDestination';
import MapScreen from './travel/map';
import DriverRegistrationScreen from './driver/driverRegistration';
import PassengerRegistrationScreen from './passenger/passengerRegistration';
import PendingApprovalScreen from './driver/pendingApproval';
import ChatTabScreenDriver from './driver/chatTab';
import ChatTabScreenPassenger from './passenger/chatTab';
import DriverProfileScreen from './driver/profile';
import UserProfileScreen from './passenger/profile';
import TripListScreen from './driver/trips';
import UpdateDriverScreen from './driver/updateDriverRegistration';
const RootStack = createStackNavigator<RootStackParamList>();
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
            <RootStack.Screen name="driver" options={{ headerShown: false }} component={HomeScreenDriver} />
            <RootStack.Screen name='driverChatTab' options={{ headerShown: false }} component={ChatTabScreenDriver} />
            <RootStack.Screen name="driverProfile" options={{ headerShown: false }} component={DriverProfileScreen} />
            <RootStack.Screen name="tripTab" options={{ headerShown: false }} component={TripListScreen} />
            <RootStack.Screen name="passengerChatTab" options={{ headerShown: false }} component={ChatTabScreenPassenger} />
            <RootStack.Screen name="passengerProfile" options={{ headerShown: false }} component={UserProfileScreen} />
            <RootStack.Screen name="passenger" options={{ headerShown: false }} component={HomeScreenPassenger} />
            <RootStack.Screen name="chat" options={{ headerShown: false }} component={ChatScreen} />
            <RootStack.Screen name="pendingTrip" options={{ headerShown: false }} component={PendingTrip} />
            <RootStack.Screen name="chooseDestination" options={{ headerShown: false }} component={ChooseDestination} />
            <RootStack.Screen name="map" options={{ headerShown: false }} component={MapScreen} />
            <RootStack.Screen name="driverRegistration" options={{ headerShown: false }} component={DriverRegistrationScreen} />
            <RootStack.Screen name="passengerRegistration" options={{ headerShown: false }} component={PassengerRegistrationScreen} />
            <RootStack.Screen name="pendingApproval" options={{ headerShown: false }} component={PendingApprovalScreen} />
            <RootStack.Screen name="updateDriverRegistration" options={{ headerShown: false }} component={UpdateDriverScreen} />
          </RootStack.Navigator>
          <Toast />
        </UserProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
