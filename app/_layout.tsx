import '@/global.css';
import { Stack } from 'expo-router';
import 'react-native-reanimated';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (

      <Stack initialRouteName="access-code">
        <Stack.Screen name="access-code" options={{ headerShown: false }} />
        <Stack.Screen name="clock-in" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

  );
}
