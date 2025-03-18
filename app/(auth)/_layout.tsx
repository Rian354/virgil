import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getColors } from '@/theme/colors';

export default function AuthLayout() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.default,
        },
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
} 