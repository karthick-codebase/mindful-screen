import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import AppNavigator from './AppNavigator';
import AccountEditScreen from '../screens/AccountEditScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default function MainNavigator() {
  return <AppNavigator />;
}
