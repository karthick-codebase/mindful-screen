import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function AccountEditScreen({ navigation }: any) {
  const { tokens, themeName } = useTheme();
  const { user, updateUserProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    occupation: user?.occupation || '',
    interests: user?.interests?.join(', ') || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && formData.phone.length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Website validation (optional but if provided, must be valid)
    if (formData.website && formData.website.length > 0) {
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL (include http:// or https://)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below and try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Process interests
      const interests = formData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      const updatedData = {
        ...formData,
        interests,
        updatedAt: new Date(),
      };

      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update user profile (this would typically update the auth context)
      if (updateUserProfile) {
        await updateUserProfile(updatedData);
      }

      Alert.alert(
        'Success!', 
        'Your profile has been updated successfully.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes?',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };

  const renderInput = (
    key: keyof typeof formData,
    label: string,
    placeholder: string,
    options: {
      multiline?: boolean;
      keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      maxLength?: number;
    } = {}
  ) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: tokens.text,
        marginBottom: 8,
      }}>
        {label}
      </Text>
      <TextInput
        style={{
          backgroundColor: tokens.surface,
          borderWidth: 2,
          borderColor: errors[key] ? tokens.error : tokens.border,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: options.multiline ? 16 : 14,
          fontSize: 16,
          color: tokens.text,
          textAlignVertical: options.multiline ? 'top' : 'center',
          minHeight: options.multiline ? 100 : 48,
        }}
        value={formData[key]}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, [key]: text }));
          if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
          }
        }}
        placeholder={placeholder}
        placeholderTextColor={tokens.muted}
        multiline={options.multiline}
        keyboardType={options.keyboardType || 'default'}
        autoCapitalize={options.autoCapitalize || 'sentences'}
        maxLength={options.maxLength}
      />
      {errors[key] && (
        <Text style={{
          fontSize: 14,
          color: tokens.error,
          marginTop: 4,
        }}>
          {errors[key]}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: tokens.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <TouchableOpacity
          onPress={handleCancel}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
          }}
        >
          <Text style={{
            fontSize: 16,
            color: tokens.error,
            fontWeight: '600',
          }}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: tokens.text,
        }}>
          Edit Profile
        </Text>
        
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={{
            backgroundColor: tokens.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <Text style={{
            fontSize: 16,
            color: '#ffffff',
            fontWeight: '600',
          }}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          alignItems: 'center',
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: tokens.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 36,
              color: '#ffffff',
              fontWeight: 'bold',
            }}>
              {formData.name.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={{
              backgroundColor: tokens.surface,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: tokens.border,
            }}
            onPress={() => Alert.alert('Photo Upload', 'Photo upload feature coming soon!')}
          >
            <Text style={{
              fontSize: 14,
              color: tokens.text,
              fontWeight: '600',
            }}>
              📷 Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
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
            Basic Information
          </Text>

          {renderInput('name', 'Full Name *', 'Enter your full name', {
            autoCapitalize: 'words',
            maxLength: 50,
          })}

          {renderInput('email', 'Email Address *', 'Enter your email address', {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            maxLength: 100,
          })}

          {renderInput('phone', 'Phone Number', 'Enter your phone number', {
            keyboardType: 'phone-pad',
            maxLength: 20,
          })}

          {renderInput('occupation', 'Occupation', 'What do you do for work?', {
            autoCapitalize: 'words',
            maxLength: 50,
          })}
        </View>

        {/* Additional Information */}
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
            Additional Information
          </Text>

          {renderInput('bio', 'Bio', 'Tell us about yourself...', {
            multiline: true,
            maxLength: 200,
          })}

          {renderInput('location', 'Location', 'City, Country', {
            autoCapitalize: 'words',
            maxLength: 50,
          })}

          {renderInput('website', 'Website', 'https://yourwebsite.com', {
            keyboardType: 'url',
            autoCapitalize: 'none',
            maxLength: 100,
          })}

          {renderInput('interests', 'Interests', 'Productivity, Technology, Health (comma separated)', {
            autoCapitalize: 'words',
            maxLength: 200,
          })}
        </View>

        {/* Account Status */}
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
            marginBottom: 16,
          }}>
            Account Status
          </Text>
          
          <View style={{
            backgroundColor: tokens.surface,
            borderRadius: 16,
            padding: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
              }}>
                Account Type
              </Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.primary,
              }}>
                {user?.role || 'Free User'}
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
              }}>
                Member Since
              </Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.text,
              }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
              }}>
                Profile Completion
              </Text>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.success,
              }}>
                {Math.round((Object.values(formData).filter(v => v.length > 0).length / Object.keys(formData).length) * 100)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Help Text */}
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
            💡 Profile Tips
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            lineHeight: 20,
          }}>
            • Complete your profile to unlock all features{'\n'}
            • Add interests to get personalized recommendations{'\n'}
            • Your email is used for important notifications{'\n'}
            • Profile information helps connect with like-minded users
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
