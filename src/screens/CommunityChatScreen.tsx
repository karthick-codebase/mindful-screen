import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function CommunityChatScreen({ route, navigation }: any) {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  const { communityId } = route.params;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the community chat! 👋',
      userId: 'system',
      userName: 'System',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: '2',
      text: 'Hey everyone! Excited to be part of this community',
      userId: 'user1',
      userName: 'Alex Johnson',
      timestamp: new Date(Date.now() - 1800000),
      isOwn: false,
    },
    {
      id: '3',
      text: 'Great to have you here! Feel free to share your productivity tips',
      userId: 'user2',
      userName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 900000),
      isOwn: false,
    },
    {
      id: '4',
      text: 'I just completed a 2-hour focus session using the Pomodoro technique!',
      userId: user?.id || 'current',
      userName: user?.name || 'You',
      timestamp: new Date(Date.now() - 300000),
      isOwn: true,
    },
  ]);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        userId: user?.uid || 'current',
        userName: user?.name || 'You',
        timestamp: new Date(),
        isOwn: true,
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate a response after 2 seconds
      setTimeout(() => {
        const responses = [
          'That sounds great! Keep up the good work! 💪',
          'Thanks for sharing! Very inspiring 🌟',
          'I should try that technique too!',
          'Awesome progress! How do you stay so motivated?',
          'That\'s exactly what I needed to hear today 🙌',
        ];
        
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          userId: 'community_member',
          userName: 'Community Member',
          timestamp: new Date(),
          isOwn: false,
        };
        
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getCommunityName = (id: string) => {
    const communities = {
      '1': 'Productivity Masters',
      '2': 'Tech Innovators',
      '3': 'Mindful Living',
      '4': 'Study Buddies',
    };
    return communities[id as keyof typeof communities] || 'Community Chat';
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
        paddingBottom: 16,
        backgroundColor: tokens.card,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border,
        flexDirection: 'row',
        alignItems: 'center',
        ...(themeName === 'dark' && {
          shadowColor: tokens.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }),
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: tokens.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Text style={{ fontSize: 18, color: tokens.text }}>←</Text>
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: tokens.text,
          }}>
            {getCommunityName(communityId)}
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
          }}>
            {messages.length} messages • {Math.floor(Math.random() * 50) + 10} online
          </Text>
        </View>
        
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: tokens.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => Alert.alert('Community Info', 'Community details and settings coming soon!')}
        >
          <Text style={{ fontSize: 18, color: tokens.text }}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View
            key={msg.id}
            style={{
              alignSelf: msg.isOwn ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              marginBottom: 12,
            }}
          >
            {!msg.isOwn && (
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                marginBottom: 4,
                marginLeft: 12,
              }}>
                {msg.userName}
              </Text>
            )}
            
            <View style={{
              backgroundColor: msg.isOwn ? tokens.primary : tokens.card,
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 12,
              ...(themeName === 'dark' && {
                shadowColor: msg.isOwn ? tokens.primary : tokens.surface,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }),
            }}>
              <Text style={{
                color: msg.isOwn ? '#ffffff' : tokens.text,
                fontSize: 16,
                lineHeight: 20,
              }}>
                {msg.text}
              </Text>
              
              <Text style={{
                color: msg.isOwn ? 'rgba(255,255,255,0.7)' : tokens.textSecondary,
                fontSize: 11,
                marginTop: 4,
                textAlign: 'right',
              }}>
                {formatTime(msg.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: tokens.card,
        borderTopWidth: 1,
        borderTopColor: tokens.border,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
      }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: tokens.surface,
            borderWidth: 1,
            borderColor: tokens.border,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: tokens.text,
            maxHeight: 100,
          }}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={tokens.muted}
          multiline
          onSubmitEditing={sendMessage}
        />
        
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: message.trim() ? tokens.primary : tokens.muted,
            alignItems: 'center',
            justifyContent: 'center',
            ...(themeName === 'dark' && message.trim() && {
              shadowColor: tokens.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 4,
            }),
          }}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Text style={{ 
            fontSize: 20, 
            color: '#ffffff',
          }}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
