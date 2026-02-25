import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { tokens } = useTheme();
  const { signInWithEmail, signInDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Navigation will happen automatically via AuthContext
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
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
            Focus • Track • Achieve
          </Text>
        </View>

        {/* Login Form */}
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
            Welcome Back
          </Text>

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
          <View style={{ marginBottom: 24 }}>
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
              placeholder="Enter your password"
              placeholderTextColor={tokens.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: loading ? tokens.muted : tokens.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginBottom: 16,
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={{ 
              color: '#ffffff', 
              fontSize: 16, 
              fontWeight: '600',
            }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{ alignItems: 'center' }}
          >
            <Text style={{ color: tokens.textSecondary }}>
              Don't have an account?{' '}
              <Text style={{ color: tokens.primary, fontWeight: '600' }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Mode */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
          borderLeftWidth: 4,
          borderLeftColor: tokens.info,
        }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600',
            color: tokens.text,
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Try Demo Mode
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: tokens.textSecondary,
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 20,
          }}>
            Experience the app without creating an account
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: tokens.secondary,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
            }}
            onPress={signInDemo}
          >
            <Text style={{ 
              color: '#ffffff', 
              fontSize: 14, 
              fontWeight: '600',
            }}>
              Continue with Demo
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
