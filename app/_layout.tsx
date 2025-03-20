import { Stack, useSegments, useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';
import { useEffect } from 'react';

function RootLayoutNav() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  const segments = useSegments();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to login if not logged in and not already in auth group
      router.replace('/');
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to home if logged in and still in auth group
      router.replace('/virgil');
    }
  }, [isLoggedIn, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.default,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationType: 'fade',
          animationDuration: 200
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          animation: 'fade',
          animationType: 'fade',
          animationDuration: 200
        }}
      />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <RootLayoutNav />
      </PaperProvider>
    </Provider>
  );
}