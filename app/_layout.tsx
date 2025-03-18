import { Stack } from 'expo-router';
import { Slot } from 'expo-router';
import { store } from '@/redux/store';
import { Provider } from "react-redux";

export default function RootLayout() {

  return (
  <Provider store={store}> {/* Wrap Redux Provider */}
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade', animationType: 'fade', animationDuration: 200 }} />
      <Stack.Screen name="+not-found" />
    </Stack>
   </Provider>
  );
}