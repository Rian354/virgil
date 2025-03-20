import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, Avatar, List, Switch, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { getColors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);
  
  const handleLogout = () => {
    dispatch(logout());
    router.replace('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Surface style={[styles.header, { backgroundColor: colors.primary.main }]} elevation={0}>
        <Avatar.Icon 
          size={80} 
          icon="account"
          style={[styles.avatar, { backgroundColor: colors.primary.dark }]}
          color={colors.background.paper}
          theme={{ colors: { primary: colors.primary.main } }}
        />
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.background.paper }]}>Rian Atri</Text>
          <Text style={[styles.email, { color: colors.background.paper, opacity: 0.8 }]}>info@rian.fyi</Text>
        </View>
      </Surface>

      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <List.Section>
          <List.Subheader style={{ color: colors.text.secondary }}>Profile Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="account-edit" color={colors.primary.main} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.text.secondary} />}
          />
          <List.Item
            title="Change Password"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="lock" color={colors.primary.main} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.text.secondary} />}
          />
          <Divider style={{ backgroundColor: colors.background.dark }} />

          <List.Subheader style={{ color: colors.text.secondary }}>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.primary.main} />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                color={colors.primary.main}
              />
            )}
          />
          <Divider style={{ backgroundColor: colors.background.dark }} />

          <List.Subheader style={{ color: colors.text.secondary }}>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="bell" color={colors.primary.main} />}
            right={() => (
              <Switch
                value={true}
                onValueChange={() => {}}
                color={colors.primary.main}
              />
            )}
          />
          <List.Item
            title="Email Notifications"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="email" color={colors.primary.main} />}
            right={() => (
              <Switch
                value={true}
                onValueChange={() => {}}
                color={colors.primary.main}
              />
            )}
          />
          <Divider style={{ backgroundColor: colors.background.dark }} />

          <List.Subheader style={{ color: colors.text.secondary }}>Privacy & Security</List.Subheader>
          <List.Item
            title="Privacy Settings"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="shield-account" color={colors.primary.main} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.text.secondary} />}
          />
          <List.Item
            title="Location Services"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="map-marker" color={colors.primary.main} />}
            right={() => (
              <Switch
                value={false}
                onValueChange={() => {}}
                color={colors.primary.main}
              />
            )}
          />
          <Divider style={{ backgroundColor: colors.background.dark }} />

          <List.Subheader style={{ color: colors.text.secondary }}>About</List.Subheader>
          <List.Item
            title="Terms of Service"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="file-document" color={colors.primary.main} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.text.secondary} />}
          />
          <List.Item
            title="Privacy Policy"
            titleStyle={{ color: colors.text.primary }}
            left={props => <List.Icon {...props} icon="shield" color={colors.primary.main} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.text.secondary} />}
          />
          <List.Item
            title="Version"
            titleStyle={{ color: colors.text.primary }}
            description="1.0.0"
            descriptionStyle={{ color: colors.text.secondary }}
            left={props => <List.Icon {...props} icon="information" color={colors.primary.main} />}
          />
        </List.Section>
      </View>

      <View style={styles.logoutContainer}>
        <Button 
          mode="outlined" 
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: colors.error }]}
          contentStyle={styles.logoutButtonContent}
          textColor={colors.error}
          icon={({ size, color }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  avatar: {
    marginBottom: 16,
  },
  headerText: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginTop: 16,
  },
  logoutContainer: {
    padding: 24,
    marginTop: 16,
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
}); 