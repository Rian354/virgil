import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar, Surface, Text } from 'react-native-paper';
import { getColors } from '@/theme/colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <Surface style={[styles.header, { backgroundColor: colors.background.default }]} elevation={0}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Discover</Text>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: colors.background.paper }]}
          inputStyle={[styles.searchInput, { color: colors.text.primary }]}
          iconColor={colors.text.secondary}
          placeholderTextColor={colors.text.secondary}
          theme={{
            colors: {
              primary: colors.primary.main,
              text: colors.text.primary,
              placeholder: colors.text.secondary,
            },
          }}
        />
      </Surface>
      
      <ScrollView style={styles.content}>
        {/* Add your discover content here */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
}); 