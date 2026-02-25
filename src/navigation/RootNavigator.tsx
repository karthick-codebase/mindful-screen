import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { View, Text, ActivityIndicator } from 'react-native';
import MainNavigator from './MainNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  const { tokens } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: tokens.background 
    }}>
      <ActivityIndicator size="large" color={tokens.primary} />
      <Text style={{ 
        marginTop: 16, 
        fontSize: 16, 
        color: tokens.text,
        textAlign: 'center',
      }}>
        Loading Mindful Screen...
      </Text>
      <Text style={{ 
        marginTop: 8, 
        fontSize: 14, 
        color: tokens.textSecondary,
        textAlign: 'center',
      }}>
        Setting up Firebase & Authentication
      </Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { tokens } = useTheme();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: tokens.card,
          },
          headerTintColor: tokens.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // Authenticated screens
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          // Authentication screens
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                title: 'Sign In',
                headerStyle: {
                  backgroundColor: tokens.primary,
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                title: 'Create Account',
                headerStyle: {
                  backgroundColor: tokens.primary,
                },
                headerTintColor: '#ffffff',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
