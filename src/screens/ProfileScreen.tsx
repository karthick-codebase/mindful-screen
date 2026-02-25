import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch, StatusBar, TextInput, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import OpenAIService from '../services/OpenAIService';

export default function ProfileScreen({ navigation }: any) {
  const { tokens, themeName, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const hasKey = await OpenAIService.hasApiKeyAsync();
      setHasApiKey(hasKey);
    };
    checkApiKey();
  }, []);

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

  const handleSaveApiKey = async () => {
    const trimmedKey = apiKeyInput.trim();
    
    if (!trimmedKey) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    if (!trimmedKey.startsWith('sk-')) {
      Alert.alert('Invalid API Key', 'OpenAI API keys should start with "sk-". Please check your key and try again.');
      return;
    }

    if (trimmedKey.length < 20) {
      Alert.alert('Invalid API Key', 'The API key appears to be too short. Please check your key and try again.');
      return;
    }

    try {
      // Show loading state
      Alert.alert('Testing Connection', 'Validating your API key...', [], { cancelable: false });
      
      await OpenAIService.setApiKey(trimmedKey);
      
      // Test the connection
      const testResult = await OpenAIService.testConnection();
      
      if (testResult.success) {
        setHasApiKey(true);
        setShowApiKeyModal(false);
        setApiKeyInput('');
        Alert.alert(
          '✅ Success!', 
          'OpenAI API key configured successfully! Your chatbot now has enhanced AI capabilities with intelligent responses.',
          [{ text: 'Great!', style: 'default' }]
        );
      } else {
        // Remove the invalid key
        await OpenAIService.removeApiKey();
        Alert.alert(
          '❌ Connection Failed', 
          `Could not connect to OpenAI: ${testResult.error}\n\nPlease check your API key and try again.`,
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key. Please check your internet connection and try again.');
    }
  };

  const handleRemoveApiKey = () => {
    Alert.alert(
      'Remove API Key',
      'Are you sure you want to remove your OpenAI API key? The chatbot will use built-in responses instead.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await OpenAIService.removeApiKey();
            setHasApiKey(false);
            Alert.alert('Removed', 'OpenAI API key has been removed.');
          }
        }
      ]
    );
  };

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
          Profile
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          alignItems: 'center',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: tokens.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{
              fontSize: 32,
              color: '#ffffff',
              fontWeight: 'bold',
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: tokens.text,
            marginBottom: 4,
          }}>
            {user?.name || 'User'}
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: tokens.textSecondary,
            marginBottom: 8,
          }}>
            {user?.email}
          </Text>
          
          <View style={{
            backgroundColor: tokens.primary,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 12,
              fontWeight: '600',
              textTransform: 'capitalize',
            }}>
              {user?.role || 'Student'}
            </Text>
          </View>
        </View>

        {/* Notifications Section */}
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
            marginBottom: 24,
          }}>
            Notifications
          </Text>

          {/* Push Notifications */}
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
                <Text style={{ fontSize: 20, marginRight: 12 }}>🔔</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Push Notifications
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Get notified about important updates
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ 
                false: tokens.disabled, 
                true: `${tokens.primary}40` 
              }}
              thumbColor={pushNotifications ? tokens.primary : tokens.muted}
              ios_backgroundColor={tokens.disabled}
            />
          </View>

          {/* Session Reminders */}
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
                <Text style={{ fontSize: 20, marginRight: 12 }}>⏰</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Session Reminders
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Remind me about scheduled focus sessions
              </Text>
            </View>
            <Switch
              value={sessionReminders}
              onValueChange={setSessionReminders}
              trackColor={{ 
                false: tokens.disabled, 
                true: `${tokens.primary}40` 
              }}
              thumbColor={sessionReminders ? tokens.primary : tokens.muted}
              ios_backgroundColor={tokens.disabled}
            />
          </View>

          {/* Sound Effects */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
          }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>🔊</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Sound Effects
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Play sounds for notifications and timers
              </Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ 
                false: tokens.disabled, 
                true: `${tokens.primary}40` 
              }}
              thumbColor={soundEffects ? tokens.primary : tokens.muted}
              ios_backgroundColor={tokens.disabled}
            />
          </View>
        </View>

        {/* Account Section */}
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
            marginBottom: 24,
          }}>
            Account
          </Text>

          {/* Profile Information */}
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: tokens.divider,
          }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>👤</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Profile Information
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Update your personal information
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: tokens.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
              }}
              onPress={() => navigation?.navigate('AccountEdit')}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
              }}>
                Edit
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* OpenAI API Key */}
          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 16,
            }}
            onPress={() => hasApiKey ? handleRemoveApiKey() : setShowApiKeyModal(true)}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>🤖</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  AI Chatbot Enhancement
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                {hasApiKey 
                  ? 'OpenAI API configured - Enhanced responses active'
                  : 'Configure OpenAI API for smarter responses'
                }
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: hasApiKey ? tokens.error : tokens.success,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
              }}
              onPress={() => hasApiKey ? handleRemoveApiKey() : setShowApiKeyModal(true)}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
              }}>
                {hasApiKey ? 'Remove' : 'Setup'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Privacy Settings */}
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
          }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, marginRight: 12 }}>🛡️</Text>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  Privacy Settings
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                marginLeft: 32,
              }}>
                Manage how your data is used
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: tokens.info,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
              }}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: '600',
              }}>
                Manage
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
        }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
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

        {/* Sign Out */}
        <TouchableOpacity
          style={{
            backgroundColor: tokens.error,
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            marginBottom: 24,
          }}
          onPress={handleSignOut}
        >
          <Text style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
          }}>
            🚪 Sign Out
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* API Key Modal */}
      <Modal
        visible={showApiKeyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApiKeyModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
          <View style={{
            backgroundColor: tokens.card,
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: tokens.text,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              🤖 Setup OpenAI API Key
            </Text>
            
            <Text style={{
              fontSize: 14,
              color: tokens.textSecondary,
              marginBottom: 16,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Enter your OpenAI API key to enable enhanced AI responses in the chatbot.
            </Text>
            
            <View style={{
              backgroundColor: tokens.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: tokens.info,
            }}>
              <Text style={{
                fontSize: 13,
                color: tokens.text,
                fontWeight: '600',
                marginBottom: 8,
              }}>
                📝 How to get your API key:
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                lineHeight: 18,
              }}>
                1. Visit platform.openai.com{'\n'}
                2. Sign up or log in to your account{'\n'}
                3. Go to API Keys section{'\n'}
                4. Create a new API key{'\n'}
                5. Copy and paste it below
              </Text>
            </View>
            
            <TextInput
              style={{
                backgroundColor: tokens.surface,
                borderWidth: 1,
                borderColor: tokens.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: tokens.text,
                marginBottom: 20,
              }}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholder="sk-..."
              placeholderTextColor={tokens.muted}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View style={{
              flexDirection: 'row',
              gap: 12,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: tokens.muted,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={() => {
                  setShowApiKeyModal(false);
                  setApiKeyInput('');
                }}
              >
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: tokens.primary,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                }}
                onPress={handleSaveApiKey}
              >
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
