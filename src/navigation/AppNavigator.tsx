import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';

// Import main screens
import DashboardScreen from '../screens/DashboardScreen';
import FocusTimerScreen from '../screens/FocusTimerScreen';
import ScreenTimeScreen from '../screens/ScreenTimeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import SkillLearningScreen from '../screens/SkillLearningScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import additional screens
import CommunityChatScreen from '../screens/CommunityChatScreen';
import AccountEditScreen from '../screens/AccountEditScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import GamesScreen from '../screens/GamesScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator Component
function TabNavigator() {
  const { tokens, themeName } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.card,
          borderTopColor: tokens.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          ...(themeName === 'dark' && {
            shadowColor: tokens.neon,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 12,
          }),
        },
        tabBarActiveTintColor: tokens.primary,
        tabBarInactiveTintColor: tokens.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${tokens.primary}20` : 'transparent',
            }}>
              <Text style={{ 
                fontSize: 20, 
                color,
                ...(themeName === 'dark' && focused && {
                  textShadowColor: tokens.neon,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }),
              }}>
                🏠
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Focus"
        component={FocusTimerScreen}
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${tokens.primary}20` : 'transparent',
            }}>
              <Text style={{ 
                fontSize: 20, 
                color,
                ...(themeName === 'dark' && focused && {
                  textShadowColor: tokens.neon,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }),
              }}>
                ⏰
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Analytics"
        component={ScreenTimeScreen}
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${tokens.primary}20` : 'transparent',
            }}>
              <Text style={{ 
                fontSize: 20, 
                color,
                ...(themeName === 'dark' && focused && {
                  textShadowColor: tokens.neon,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }),
              }}>
                📊
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${tokens.primary}20` : 'transparent',
            }}>
              <Text style={{ 
                fontSize: 20, 
                color,
                ...(themeName === 'dark' && focused && {
                  textShadowColor: tokens.neon,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }),
              }}>
                👥
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Skills"
        component={SkillLearningScreen}
        options={{
          title: 'Skills',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${tokens.primary}20` : 'transparent',
            }}>
              <Text style={{ 
                fontSize: 20, 
                color,
                ...(themeName === 'dark' && focused && {
                  textShadowColor: tokens.neon,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }),
              }}>
                📚
              </Text>
            </View>
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: focused ? `${tokens.primary}20` : 'transparent',
            }}>
              <Text style={{ 
                fontSize: 20, 
                color,
                ...(themeName === 'dark' && focused && {
                  textShadowColor: tokens.neon,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }),
              }}>
                👤
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator with Stack
export default function AppNavigator() {
  const { tokens } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* Modal/Detail Screens */}
      <Stack.Screen name="CommunityChat" component={CommunityChatScreen} />
      <Stack.Screen name="AccountEdit" component={AccountEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="Games" component={GamesScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      
      {/* Alias screens for compatibility */}
      <Stack.Screen name="Learning" component={SkillLearningScreen} />
      <Stack.Screen name="ScreenTime" component={ScreenTimeScreen} />
    </Stack.Navigator>
  );
}
