import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Import screens (we'll create these next)
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import { 
  LostItemsScreen, 
  FoundItemsScreen, 
  ChatRoomsScreen, 
  ProfileScreen, 
  AddItemScreen, 
  ItemDetailsScreen, 
  ChatScreen, 
  EditProfileScreen 
} from '../screens';

// Navigation Type Definitions
import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';

// Stack Navigators
const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Auth Navigator
const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Lost':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Found':
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Lost & Found' }}
      />
      <MainTab.Screen 
        name="Lost" 
        component={LostItemsScreen} 
        options={{ title: 'Lost Items' }}
      />
      <MainTab.Screen 
        name="Found" 
        component={FoundItemsScreen} 
        options={{ title: 'Found Items' }}
      />
      <MainTab.Screen 
        name="Chat" 
        component={ChatRoomsScreen} 
        options={{ title: 'Messages' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </MainTab.Navigator>
  );
};

// Root Navigator
const RootNavigator: React.FC = () => {
  const { state } = useAuth();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {state.isAuthenticated ? (
        <>
          <RootStack.Screen name="Main" component={MainTabNavigator} />
          <RootStack.Screen 
            name="AddItem" 
            component={AddItemScreen}
            options={{
              headerShown: true,
              title: 'Report Item',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal',
            }}
          />
          <RootStack.Screen 
            name="ItemDetails" 
            component={ItemDetailsScreen}
            options={{
              headerShown: true,
              title: 'Item Details',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <RootStack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{
              headerShown: true,
              title: 'Chat',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <RootStack.Screen 
            name="EditProfile" 
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: 'Edit Profile',
              headerStyle: { backgroundColor: '#007AFF' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
              presentation: 'modal',
            }}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
