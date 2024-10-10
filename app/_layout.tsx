import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider, UserContext } from '../contexts/UserContext'; // Importa UserContext
import Toast from 'react-native-toast-message';

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }} initialRouteName={'index'}>
          <Stack.Screen name="index"
            options={{ headerShown: false }} />
          {user?.type === 'Driver' ? (
            <Stack.Screen name="driver" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="passenger" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="chat" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
      </UserProvider>
    </ThemeProvider>
  );
}
