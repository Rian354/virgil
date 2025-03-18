import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
       <Tabs
         screenOptions={{
           tabBarActiveTintColor: '#ffd33d',
           headerStyle: {
             backgroundColor: '#25292e',
           },
           headerShadowVisible: false,
           headerTintColor: '#fff',
           tabBarStyle: {
           backgroundColor: '#25292e',
           },
         }}
       >

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
       {isLoggedIn && (
              <Tabs.Screen
                name="chat"
                options={{
                  title: "Chat",
                  tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} color={color} size={24} />
                  ),
                }}
              />
            )}
    </Tabs>
  );
}
