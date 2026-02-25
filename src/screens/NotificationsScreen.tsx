import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function NotificationsScreen() {
  const { tokens } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.background }}>
      <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: tokens.text,
          marginBottom: 8,
          textAlign: 'center',
        }}>
          Notifications
        </Text>
        <Text style={{
          fontSize: 16,
          color: tokens.textSecondary,
          textAlign: 'center',
        }}>
          Coming Soon! Manage your notification preferences.
        </Text>
      </View>
    </ScrollView>
  );
}
