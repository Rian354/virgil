import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(logout()); // Dispatch logout action when component mounts
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You have been logged out.</Text>
      <Button mode="contained" onPress={() => router.replace('/')} style={styles.button}>
        Go to Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  button: { marginTop: 10 },
});
