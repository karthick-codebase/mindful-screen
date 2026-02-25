import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { tokens, toggleTheme, themeName } = useTheme();
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.background }}>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={{ 
          backgroundColor: tokens.card, 
          borderRadius: 16, 
          padding: 20, 
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{ 
            fontSize: 28, 
            fontWeight: 'bold', 
            color: tokens.text,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Welcome to Mindful Screen
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: tokens.textSecondary,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Hello, {user?.name || 'User'}! 👋
          </Text>
          
          {/* Theme Toggle */}
          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                flex: 1,
                backgroundColor: tokens.primary,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>
                {themeName === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                flex: 1,
                backgroundColor: tokens.error,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>
                🚪 Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Grid */}
        <View style={{ 
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginTop: 20,
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }),
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            color: tokens.text,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            🚀 Quick Actions
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between',
            gap: 16,
          }}>
            {[
              { title: 'Focus Timer', icon: '⏱️', color: tokens.primary, screen: 'Focus' },
              { title: 'Analytics', icon: '📊', color: tokens.info, screen: 'ScreenTime' },
              { title: 'AI Assistant', icon: '🤖', color: tokens.accent, screen: 'Chat' },
              { title: 'Community', icon: '👥', color: tokens.success, screen: 'Community' },
            ].map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: tokens.surface,
                  borderRadius: 16,
                  padding: 20,
                  width: (width - 88) / 2, // Perfect calculation for 2 columns with proper spacing
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: feature.color,
                  ...(themeName === 'dark' && {
                    shadowColor: feature.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }),
                }}
                onPress={() => {
                  if (feature.screen === 'Chat') {
                    Alert.alert('AI Assistant', 'AI Assistant coming soon! Use the chatbot on the Dashboard for now.');
                  } else {
                    (navigation as any)?.navigate(feature.screen);
                  }
                }}
              >
                <Text style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</Text>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: tokens.text,
                  textAlign: 'center',
                }}>
                  {feature.title}
                </Text>
                <View style={{
                  width: 30,
                  height: 3,
                  backgroundColor: feature.color,
                  borderRadius: 2,
                  marginTop: 8,
                }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Card */}
        <View style={{ 
          backgroundColor: tokens.card, 
          borderRadius: 16, 
          padding: 20, 
          marginTop: 20,
          borderLeftWidth: 4,
          borderLeftColor: tokens.success,
        }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: tokens.text,
            marginBottom: 8,
          }}>
            🎉 App Status
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: tokens.textSecondary,
            lineHeight: 20,
          }}>
            ✅ Firebase: {user?.id === 'demo-user' ? 'Demo Mode' : 'Connected'}{'\n'}
            ✅ Navigation: Working{'\n'}
            ✅ Themes: Professional & Dark{'\n'}
            ✅ Ready for development!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
