import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { getColors } from '@/theme/colors';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <List.Section>
        <List.Subheader style={{ color: colors.text.secondary }}>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          titleStyle={{ color: colors.text.primary }}
          left={props => <List.Icon {...props} icon="theme-light-dark" color={colors.primary.main} />}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={() => dispatch(toggleTheme())}
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

        <List.Subheader style={{ color: colors.text.secondary }}>Privacy</List.Subheader>
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
        <List.Item
          title="Data Collection"
          titleStyle={{ color: colors.text.primary }}
          left={props => <List.Icon {...props} icon="database" color={colors.primary.main} />}
          right={() => (
            <Switch
              value={true}
              onValueChange={() => {}}
              color={colors.primary.main}
            />
          )}
        />
        <Divider style={{ backgroundColor: colors.background.dark }} />

        <List.Subheader style={{ color: colors.text.secondary }}>About</List.Subheader>
        <List.Item
          title="Version"
          titleStyle={{ color: colors.text.primary }}
          description="1.0.0"
          descriptionStyle={{ color: colors.text.secondary }}
          left={props => <List.Icon {...props} icon="information" color={colors.primary.main} />}
        />
        <List.Item
          title="Terms of Service"
          left={props => <List.Icon {...props} icon="file-document" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Privacy Policy"
          left={props => <List.Icon {...props} icon="shield" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 