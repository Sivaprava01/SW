import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#8c7164',
        tabBarStyle: {
          backgroundColor: '#fff8f3',
          borderTopColor: '#f1e0cc',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="money"
        options={{
          title: 'Money',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-balance-wallet" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="explore" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="ads-click" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="benefits"
        options={{
          title: 'Benefits',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="verified-user" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schemes"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
