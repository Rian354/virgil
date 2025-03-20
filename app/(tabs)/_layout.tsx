import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getColors } from '@/theme/colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function TabLayout() {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const colors = getColors(isDarkMode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.default,
          borderTopWidth: 1,
          borderTopColor: colors.background.dark,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
                  name="index"
                  options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                      <Ionicons
                        name={focused ? 'home' : 'home-outline'}
                        color={color}
                        size={24}
                      />
                    ),
                  }}
                />
      <Tabs.Screen
        name="virgil"
        options={{
          title: 'Virgil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'medkit' : 'medkit-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
