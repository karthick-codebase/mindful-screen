import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StatusBar,
  Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsState {
  notifications: {
    pushNotifications: boolean;
    sessionReminders: boolean;
    soundEffects: boolean;
    emailNotifications: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  preferences: {
    autoStartTimer: boolean;
    showProgressBadges: boolean;
    dailyGoalReminders: boolean;
    weeklyReports: boolean;
  };
}

const defaultSettings: SettingsState = {
  notifications: {
    pushNotifications: true,
    sessionReminders: true,
    soundEffects: false,
    emailNotifications: true,
  },
  privacy: {
    dataCollection: true,
    analytics: true,
    crashReporting: true,
  },
  preferences: {
    autoStartTimer: false,
    showProgressBadges: true,
    dailyGoalReminders: true,
    weeklyReports: true,
  },
};

export default function SettingsScreen({ navigation }: any) {
  const { tokens, themeName, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const updateSetting = (category: keyof SettingsState, key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const resetAllSettings = () => {
    Alert.alert(
      'Reset All Settings',
      'Are you sure you want to reset all settings to default? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => saveSettings(defaultSettings),
        },
      ]
    );
  };

  const clearAppData = () => {
    Alert.alert(
      'Clear App Data',
      'This will delete all your progress, settings, and data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'App data cleared successfully. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear app data.');
            }
          },
        },
      ]
    );
  };

  const renderToggleItem = (
    category: keyof SettingsState,
    key: string,
    title: string,
    description: string,
    icon: string
  ) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.divider,
    }}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: tokens.text,
          }}>
            {title}
          </Text>
        </View>
        <Text style={{
          fontSize: 14,
          color: tokens.textSecondary,
          marginLeft: 32,
        }}>
          {description}
        </Text>
      </View>
      <Switch
        value={settings[category][key as keyof typeof settings[typeof category]]}
        onValueChange={(value) => updateSetting(category, key, value)}
        trackColor={{ 
          false: tokens.disabled, 
          true: `${tokens.primary}40` 
        }}
        thumbColor={settings[category][key as keyof typeof settings[typeof category]] ? tokens.primary : tokens.muted}
        ios_backgroundColor={tokens.disabled}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: tokens.background, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Text style={{ color: tokens.text, fontSize: 16 }}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <StatusBar 
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={tokens.background} 
      />
      
      {/* Header */}
      <View style={{
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: tokens.background,
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: tokens.text,
          textAlign: 'center',
        }}>
          Settings
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Settings */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 20,
          }}>
            Appearance
          </Text>
          
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 16,
            }}
            onPress={toggleTheme}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>
                  {themeName === 'dark' ? '🌙' : '☀️'}
                </Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  {themeName === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Switch to {themeName === 'dark' ? 'light' : 'dark'} theme
              </Text>
            </View>
            <View style={{
              backgroundColor: tokens.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
              }}>
                Switch
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 20,
          }}>
            Notifications
          </Text>

          {renderToggleItem(
            'notifications',
            'pushNotifications',
            'Push Notifications',
            'Get notified about important updates',
            '🔔'
          )}

          {renderToggleItem(
            'notifications',
            'sessionReminders',
            'Session Reminders',
            'Remind me about scheduled focus sessions',
            '⏰'
          )}

          {renderToggleItem(
            'notifications',
            'soundEffects',
            'Sound Effects',
            'Play sounds for notifications and timers',
            '🔊'
          )}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
          }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>📧</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Email Notifications
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Receive weekly progress reports via email
              </Text>
            </View>
            <Switch
              value={settings.notifications.emailNotifications}
              onValueChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
              trackColor={{ 
                false: tokens.disabled, 
                true: `${tokens.primary}40` 
              }}
              thumbColor={settings.notifications.emailNotifications ? tokens.primary : tokens.muted}
              ios_backgroundColor={tokens.disabled}
            />
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 20,
          }}>
            Privacy & Security
          </Text>

          {renderToggleItem(
            'privacy',
            'dataCollection',
            'Data Collection',
            'Allow us to collect usage data to improve the app',
            '📊'
          )}

          {renderToggleItem(
            'privacy',
            'analytics',
            'Analytics',
            'Help improve the app with anonymous usage analytics',
            '📈'
          )}

          {renderToggleItem(
            'privacy',
            'crashReporting',
            'Crash Reporting',
            'Automatically send crash reports to help fix bugs',
            '🐛'
          )}

          <TouchableOpacity
            style={{
              backgroundColor: tokens.surface,
              borderRadius: 16,
              padding: 16,
              marginTop: 16,
              borderWidth: 2,
              borderColor: tokens.border,
            }}
            onPress={() => Alert.alert('Export Data', 'Data export feature coming soon!')}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: tokens.text,
              textAlign: 'center',
            }}>
              📤 Export My Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 20,
          }}>
            App Preferences
          </Text>

          {renderToggleItem(
            'preferences',
            'autoStartTimer',
            'Auto-Start Timer',
            'Automatically start the next focus session',
            '▶️'
          )}

          {renderToggleItem(
            'preferences',
            'showProgressBadges',
            'Progress Badges',
            'Show achievement badges and progress indicators',
            '🏆'
          )}

          {renderToggleItem(
            'preferences',
            'dailyGoalReminders',
            'Daily Goal Reminders',
            'Remind me about my daily focus goals',
            '🎯'
          )}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
          }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>📊</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Weekly Reports
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Generate weekly productivity reports
              </Text>
            </View>
            <Switch
              value={settings.preferences.weeklyReports}
              onValueChange={(value) => updateSetting('preferences', 'weeklyReports', value)}
              trackColor={{ 
                false: tokens.disabled, 
                true: `${tokens.primary}40` 
              }}
              thumbColor={settings.preferences.weeklyReports ? tokens.primary : tokens.muted}
              ios_backgroundColor={tokens.disabled}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          borderWidth: 2,
          borderColor: tokens.error,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.error,
            marginBottom: 20,
          }}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: tokens.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: tokens.border,
            }}
            onPress={resetAllSettings}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: tokens.warning,
              textAlign: 'center',
            }}>
              🔄 Reset All Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: tokens.error,
              borderRadius: 16,
              padding: 16,
            }}
            onPress={clearAppData}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#ffffff',
              textAlign: 'center',
            }}>
              🗑️ Clear All Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          borderLeftWidth: 4,
          borderLeftColor: tokens.info,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            📱 App Information
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            lineHeight: 20,
          }}>
            Mindful Screen v1.0{'\n'}
            Built with React Native & Expo{'\n'}
            Demo Mode Active{'\n'}
            All settings are saved locally
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
