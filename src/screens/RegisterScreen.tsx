import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export default function RegisterScreen({ navigation }: any) {
  const { tokens } = useTheme();
  const { registerWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, displayName, role, interests);
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will happen automatically via AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: tokens.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            color: tokens.primary,
            marginBottom: 8,
          }}>
            Mindful Screen
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: tokens.textSecondary,
            textAlign: 'center',
          }}>
            Join the productivity revolution
          </Text>
        </View>

        {/* Register Form */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 16,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: tokens.text,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            Create Account
          </Text>

          {/* Display Name Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: tokens.text,
              marginBottom: 8,
            }}>
              Full Name
            </Text>
            <TextInput
              style={{
                backgroundColor: tokens.background,
                borderWidth: 1,
                borderColor: tokens.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: tokens.text,
              }}
              placeholder="Enter your full name"
              placeholderTextColor={tokens.muted}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: tokens.text,
              marginBottom: 8,
            }}>
              Email Address
            </Text>
            <TextInput
              style={{
                backgroundColor: tokens.background,
                borderWidth: 1,
                borderColor: tokens.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: tokens.text,
              }}
              placeholder="Enter your email"
              placeholderTextColor={tokens.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: tokens.text,
              marginBottom: 8,
            }}>
              Password
            </Text>
            <TextInput
              style={{
                backgroundColor: tokens.background,
                borderWidth: 1,
                borderColor: tokens.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: tokens.text,
              }}
              placeholder="Create a password (min 6 characters)"
              placeholderTextColor={tokens.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: tokens.text,
              marginBottom: 8,
            }}>
              Confirm Password
            </Text>
            <TextInput
              style={{
                backgroundColor: tokens.background,
                borderWidth: 1,
                borderColor: tokens.border,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: tokens.text,
              }}
              placeholder="Confirm your password"
              placeholderTextColor={tokens.muted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={{
              backgroundColor: loading ? tokens.muted : tokens.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 16,
            }}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={{ 
              color: '#ffffff', 
              fontSize: 16, 
              fontWeight: '600',
            }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ alignItems: 'center' }}
          >
            <Text style={{ color: tokens.textSecondary }}>
              Already have an account?{' '}
              <Text style={{ color: tokens.primary, fontWeight: '600' }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
