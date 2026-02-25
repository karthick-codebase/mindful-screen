import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StatusBar, Animated, Dimensions, Easing, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AchievementService from '../services/AchievementService';
import NotificationService from '../services/NotificationService';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen: string;
  color: string;
  status: 'active' | 'coming-soon';
}

interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function DashboardScreen() {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  
  // State for daily tasks
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: '1', title: 'Complete morning meditation', completed: false, priority: 'high' },
    { id: '2', title: 'Review weekly goals', completed: true, priority: 'medium' },
    { id: '3', title: 'Read for 30 minutes', completed: false, priority: 'medium' },
    { id: '4', title: 'Exercise or walk', completed: false, priority: 'high' },
    { id: '5', title: 'Plan tomorrow\'s priorities', completed: false, priority: 'low' },
  ]);
  
  // AI Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Welcome animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setDailyTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // AI Chatbot responses
  const getAIResponse = (message: string): string => {
    const responses = {
      greeting: [
        "Hello! I'm here to help you stay motivated and productive! 🌟",
        "Hey there, productivity champion! Ready to conquer your goals? 💪",
        "Welcome back! Let's make today amazing together! ✨"
      ],
      motivation: [
        "You're doing great! Every small step counts towards your bigger goals. Keep going! 🚀",
        "Remember, progress isn't about perfection - it's about consistency. You've got this! 💫",
        "Your future self will thank you for the effort you put in today. Stay focused! 🎯"
      ],
      productivity: [
        "Try the Pomodoro technique: 25 minutes of focused work, then a 5-minute break! ⏰",
        "Break big tasks into smaller, manageable chunks. It makes everything less overwhelming! 📝",
        "Start with your most important task when your energy is highest! 🌅"
      ],
      goals: [
        "Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound! 🎯",
        "Write down your goals and review them daily. Visualization is powerful! 📋",
        "Celebrate small wins along the way - they fuel your motivation! 🎉"
      ],
      default: [
        "That's a great question! Focus on what you can control and take it one step at a time. 🌱",
        "I believe in your ability to overcome challenges. Stay positive and keep moving forward! 🌈",
        "Every expert was once a beginner. Be patient with yourself and keep learning! 📚"
      ]
    };
    
    const lowerMessage = message.toLowerCase();
    let category = 'default';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      category = 'greeting';
    } else if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('encourage')) {
      category = 'motivation';
    } else if (lowerMessage.includes('product') || lowerMessage.includes('focus') || lowerMessage.includes('work')) {
      category = 'productivity';
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('achieve')) {
      category = 'goals';
    }
    
    const categoryResponses = responses[category as keyof typeof responses];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };
  
  // Send chat message
  const sendMessage = () => {
    if (chatInput.trim()) {
      const userMessage = { text: chatInput, isUser: true };
      const aiResponse = { text: getAIResponse(chatInput), isUser: false };
      
      setChatMessages(prev => [...prev, userMessage, aiResponse]);
      setChatInput('');
    }
  };
  
  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  // Calculate task completion percentage
  const completedTasksCount = dailyTasks.filter(task => task.completed).length;
  const completionPercentage = Math.round((completedTasksCount / dailyTasks.length) * 100);

  const features: FeatureCard[] = [
    {
      id: '1',
      title: 'Focus Timer',
      description: 'Pomodoro technique with customizable intervals',
      icon: '⏰',
      screen: 'Focus',
      color: tokens.primary,
      status: 'active'
    },
    {
      id: '2',
      title: 'Screen Time Analytics',
      description: 'Track and analyze your digital wellness',
      icon: '📱',
      screen: 'ScreenTime',
      color: tokens.info,
      status: 'active'
    },
    {
      id: '3',
      title: 'Community Hub',
      description: 'Join productivity communities and challenges',
      icon: '👥',
      screen: 'Community',
      color: tokens.success,
      status: 'active'
    },
    {
      id: '4',
      title: 'Skill Learning',
      description: 'Curated learning paths with progress tracking',
      icon: '📚',
      screen: 'Learning',
      color: tokens.warning,
      status: 'active'
    },
    {
      id: '5',
      title: 'AI Coach',
      description: 'Personal productivity assistant and mentor',
      icon: '🤖',
      screen: 'Chat',
      color: tokens.accent,
      status: 'active'
    },
    {
      id: '6',
      title: 'Brain Games',
      description: 'Cognitive training and mental exercises',
      icon: '🧠',
      screen: 'Games',
      color: tokens.error,
      status: 'active'
    },
    {
      id: '7',
      title: 'Leaderboards',
      description: 'Compete with friends and community',
      icon: '🏆',
      screen: 'Leaderboard',
      color: tokens.primary,
      status: 'active'
    },
    {
      id: '8',
      title: 'Smart Notifications',
      description: 'Intelligent reminders and insights',
      icon: '🔔',
      screen: 'Notifications',
      color: tokens.info,
      status: 'active'
    }
  ];

  const handleFeaturePress = (feature: FeatureCard) => {
    if (feature.status === 'active') {
      // Handle AI Coach specially since it's built into the dashboard
      if (feature.screen === 'Chat') {
        setShowChatbot(true);
        return;
      }
      
      // Handle other screens that don't exist yet
      if (['Games', 'Leaderboard', 'Notifications'].includes(feature.screen)) {
        Alert.alert(
          `${feature.title}`,
          `${feature.description}\n\nComing soon in the next update!`,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }
      
      // Navigate to existing screens
      (navigation as any).navigate(feature.screen);
    }
  };

  const getProgressData = () => {
    return {
      focusTime: user?.stats?.totalFocusTime || 0,
      level: user?.stats?.level || 1,
      xp: user?.stats?.xp || 0,
      streak: user?.stats?.streak || 0,
      completedSessions: user?.stats?.focusSessionsCount || 0
    };
  };

  const progress = getProgressData();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      <StatusBar 
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={tokens.background} 
      />
      
      {/* Animated Header */}
      <Animated.View style={{
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: tokens.background,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: tokens.text,
          textAlign: 'center',
        }}>
          Mindful Screen
        </Text>
      </Animated.View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingBottom: 120,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Welcome Card */}
        <Animated.View style={{
          backgroundColor: tokens.primary,
          borderRadius: 24,
          padding: 32,
          marginBottom: 24,
          opacity: welcomeAnim,
          transform: [{ scale: scaleAnim }],
          ...(themeName === 'dark' && {
            shadowColor: tokens.neon,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 8,
          }}>
            {getTimeBasedGreeting()}, {user?.name}! 👋
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#ffffff',
            opacity: 0.9,
            marginBottom: 20,
          }}>
            Ready to make today productive and mindful?
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
                {progress.focusTime}h
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#ffffff',
                opacity: 0.8,
              }}>
                Focus Time
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
                {progress.level}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#ffffff',
                opacity: 0.8,
              }}>
                Level
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
                {progress.streak}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#ffffff',
                opacity: 0.8,
              }}>
                Day Streak
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Daily Tasks Section */}
        <Animated.View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          ...(themeName === 'dark' && {
            shadowColor: tokens.success,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }),
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: tokens.text,
            }}>
              📋 Daily Tasks
            </Text>
            <View style={{
              backgroundColor: tokens.success,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#ffffff',
              }}>
                {completionPercentage}% Complete
              </Text>
            </View>
          </View>
          
          {dailyTasks.map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: tokens.surface,
                borderRadius: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: task.completed ? tokens.success : tokens.border,
              }}
              onPress={() => toggleTask(task.id)}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: task.completed ? tokens.success : 'transparent',
                borderWidth: 2,
                borderColor: task.completed ? tokens.success : tokens.muted,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                {task.completed && (
                  <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>
                    ✓
                  </Text>
                )}
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: task.completed ? tokens.textSecondary : tokens.text,
                  textDecorationLine: task.completed ? 'line-through' : 'none',
                }}>
                  {task.title}
                </Text>
              </View>
              
              <View style={{
                backgroundColor: task.priority === 'high' ? tokens.error : 
                              task.priority === 'medium' ? tokens.warning : tokens.muted,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
              }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}>
                  {task.priority}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={{
          flexDirection: 'row',
          gap: 16,
          marginBottom: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <View style={{
            flex: 1,
            backgroundColor: tokens.card,
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            ...(themeName === 'dark' && {
              shadowColor: tokens.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }),
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: tokens.success,
              marginBottom: 4,
            }}>
              {progress.completedSessions}
            </Text>
            <Text style={{
              fontSize: 12,
              color: tokens.textSecondary,
              textAlign: 'center',
            }}>
              Sessions Today
            </Text>
          </View>
          
          <View style={{
            flex: 1,
            backgroundColor: tokens.card,
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            ...(themeName === 'dark' && {
              shadowColor: tokens.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }),
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: tokens.accent,
              marginBottom: 4,
            }}>
              {progress.xp}
            </Text>
            <Text style={{
              fontSize: 12,
              color: tokens.textSecondary,
              textAlign: 'center',
            }}>
              Total XP
            </Text>
          </View>
        </Animated.View>

        {/* Header */}
        <View style={{
          paddingTop: 60,
          paddingHorizontal: 24,
          paddingBottom: 20,
          backgroundColor: tokens.background,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: tokens.text,
                marginBottom: 4,
              }}>
                Welcome back! 👋
              </Text>
              <Text style={{
                fontSize: 16,
                color: tokens.textSecondary,
              }}>
                {user?.name || 'User'} • Ready to be productive?
              </Text>
            </View>
            
            <View style={{
              backgroundColor: tokens.card,
              borderRadius: 50,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              ...(themeName === 'dark' && {
                shadowColor: tokens.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }),
            }}>
              <Text style={{ fontSize: 24 }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
              </Text>
            </View>
          </View>
        </View>

        {/* Features Grid */}
        <Animated.View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: tokens.text,
            marginBottom: 20,
          }}>
            🚀 Features
          </Text>
          
          <View style={{
            gap: 16,
          }}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={feature.id}
                style={{
                  backgroundColor: tokens.surface,
                  borderRadius: 24,
                  padding: 24,
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: feature.id === 'focus' ? tokens.primary : 
                              feature.id === 'analytics' ? tokens.accent : 
                              feature.id === 'community' ? tokens.success : tokens.warning,
                  ...(themeName === 'dark' && {
                    shadowColor: feature.id === 'focus' ? tokens.primary : 
                                feature.id === 'analytics' ? tokens.accent : 
                                feature.id === 'community' ? tokens.success : tokens.warning,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8,
                  }),
                }}
                onPress={() => Alert.alert(feature.title, `Navigate to ${feature.title} screen`)}
              >
                <View style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: feature.id === 'focus' ? tokens.primary : 
                                  feature.id === 'analytics' ? tokens.accent : 
                                  feature.id === 'community' ? tokens.success : tokens.warning,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 20,
                  ...(themeName === 'dark' && {
                    shadowColor: feature.id === 'focus' ? tokens.primary : 
                                feature.id === 'analytics' ? tokens.accent : 
                                feature.id === 'community' ? tokens.success : tokens.warning,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 6,
                  }),
                }}>
                  <Text style={{
                    fontSize: 36,
                    color: '#ffffff',
                  }}>
                    {feature.icon}
                  </Text>
                </View>
                
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: tokens.text,
                    marginBottom: 8,
                  }}>
                    {feature.title}
                  </Text>
                  <Text style={{
                    fontSize: 15,
                    color: tokens.textSecondary,
                    lineHeight: 22,
                    flexWrap: 'wrap',
                  }}>
                    {feature.description}
                  </Text>
                </View>
                
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: tokens.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                    →
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Achievements */}
        <Animated.View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          ...(themeName === 'dark' && {
            shadowColor: tokens.success,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: tokens.text,
            }}>
              🏆 Recent Achievements
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Achievements', 'View all achievements feature coming soon!')}
            >
              <Text style={{
                fontSize: 14,
                color: tokens.primary,
                fontWeight: '600',
              }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[
                { icon: '🎯', title: 'First Focus', desc: 'Completed first session' },
                { icon: '📚', title: 'Lifelong Learner', desc: 'Started learning journey' },
                { icon: '⚔️', title: 'Focus Warrior', desc: '10 sessions completed' },
                { icon: '🦋', title: 'Social Butterfly', desc: 'Joined first community' },
              ].map((achievement, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: tokens.surface,
                    borderRadius: 20,
                    padding: 20,
                    width: 160,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: tokens.success,
                    ...(themeName === 'dark' && {
                      shadowColor: tokens.success,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }),
                  }}
                >
                  <View style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: tokens.success,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <Text style={{ fontSize: 28 }}>
                      {achievement.icon}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: tokens.text,
                    textAlign: 'center',
                    marginBottom: 6,
                  }}>
                    {achievement.title}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: tokens.textSecondary,
                    textAlign: 'center',
                    lineHeight: 18,
                  }}>
                    {achievement.desc}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Weekly Analytics */}
        <Animated.View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: tokens.text,
            marginBottom: 20,
          }}>
            📊 This Week's Progress
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 28,
            gap: 16,
          }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: tokens.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                ...(themeName === 'dark' && {
                  shadowColor: tokens.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }),
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: '#ffffff',
                }}>
                  12
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.text,
                textAlign: 'center',
                marginBottom: 2,
              }}>
                Focus Sessions
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                This Week
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: tokens.success,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                ...(themeName === 'dark' && {
                  shadowColor: tokens.success,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }),
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '800',
                  color: '#ffffff',
                }}>
                  8.5h
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.text,
                textAlign: 'center',
                marginBottom: 2,
              }}>
                Learning Time
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Total Hours
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: tokens.accent,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                ...(themeName === 'dark' && {
                  shadowColor: tokens.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }),
              }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '800',
                  color: '#ffffff',
                }}>
                  5
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.text,
                textAlign: 'center',
                marginBottom: 2,
              }}>
                Day Streak
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Current
              </Text>
            </View>
          </View>

          {/* Weekly Progress Chart */}
          <View style={{
            backgroundColor: tokens.surface,
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: tokens.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: tokens.text,
              marginBottom: 16,
            }}>
              📈 Daily Focus Minutes
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 100,
              paddingHorizontal: 8,
            }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const heights = [60, 45, 70, 55, 80, 35, 50];
                const minutes = [45, 30, 60, 40, 75, 25, 35];
                return (
                  <View key={day} style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{
                      fontSize: 10,
                      color: tokens.textSecondary,
                      marginBottom: 4,
                      fontWeight: '600',
                    }}>
                      {minutes[index]}m
                    </Text>
                    <View style={{
                      width: 24,
                      height: heights[index],
                      backgroundColor: tokens.primary,
                      borderRadius: 6,
                      marginBottom: 12,
                      ...(themeName === 'dark' && {
                        shadowColor: tokens.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.4,
                        shadowRadius: 4,
                        elevation: 4,
                      }),
                    }} />
                    <Text style={{
                      fontSize: 12,
                      color: tokens.text,
                      fontWeight: '600',
                    }}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Smart Suggestions */}
        <Animated.View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          ...(themeName === 'dark' && {
            shadowColor: tokens.accent,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: tokens.text,
            marginBottom: 20,
          }}>
            💡 Smart Suggestions
          </Text>

          {[
            {
              icon: '🌅',
              title: 'Morning Boost',
              description: 'Start your day with a 25-minute focus session',
              action: 'Start Focus'
            },
            {
              icon: '📚',
              title: 'Skill Building',
              description: 'Continue your "Time Management" course',
              action: 'Continue Learning'
            },
            {
              icon: '🧘',
              title: 'Mindful Break',
              description: 'Take a 5-minute meditation break',
              action: 'Start Meditation'
            }
          ].map((suggestion, index) => (
            <View
              key={index}
              style={{
                backgroundColor: tokens.surface,
                borderRadius: 20,
                padding: 20,
                marginBottom: index < 2 ? 16 : 0,
                borderWidth: 1,
                borderColor: tokens.border,
              }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: tokens.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                  ...(themeName === 'dark' && {
                    shadowColor: tokens.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }),
                }}>
                  <Text style={{ fontSize: 24 }}>
                    {suggestion.icon}
                  </Text>
                </View>
                
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: tokens.text,
                    marginBottom: 6,
                  }}>
                    {suggestion.title}
                  </Text>
                  <Text style={{
                    fontSize: 15,
                    color: tokens.textSecondary,
                    lineHeight: 22,
                    flexWrap: 'wrap',
                  }}>
                    {suggestion.description}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={{
                  backgroundColor: tokens.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  ...(themeName === 'dark' && {
                    shadowColor: tokens.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 6,
                  }),
                }}
                onPress={() => Alert.alert('Action', `${suggestion.action} feature coming soon!`)}
              >
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '700',
                }}>
                  {suggestion.action}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* AI Chatbot Floating Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 24,
          width: 56,
          height: 56,
          backgroundColor: tokens.accent,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          ...(themeName === 'dark' && {
            shadowColor: tokens.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
          }),
        }}
        onPress={() => setShowChatbot(true)}
      >
        <Text style={{ fontSize: 24 }}>🤖</Text>
      </TouchableOpacity>

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: tokens.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            maxHeight: '70%',
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.text,
              }}>
                🤖 AI Motivation Coach
              </Text>
              <TouchableOpacity
                onPress={() => setShowChatbot(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: tokens.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, color: tokens.textSecondary }}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>
              {chatMessages.length === 0 && (
                <View style={{
                  backgroundColor: tokens.surface,
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}>
                  <Text style={{
                    color: tokens.textSecondary,
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                    Hi! I'm your AI motivation coach. Ask me anything about productivity, goals, or motivation! 🌟
                  </Text>
                </View>
              )}
              
              {chatMessages.map((message, index) => (
                <View
                  key={index}
                  style={{
                    alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                    backgroundColor: message.isUser ? tokens.primary : tokens.surface,
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 8,
                    maxWidth: '80%',
                  }}
                >
                  <Text style={{
                    color: message.isUser ? '#ffffff' : tokens.text,
                    fontSize: 14,
                  }}>
                    {message.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={{
              flexDirection: 'row',
              gap: 12,
            }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: tokens.surface,
                  borderWidth: 1,
                  borderColor: tokens.border,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 14,
                  color: tokens.text,
                }}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask me about productivity..."
                placeholderTextColor={tokens.muted}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: tokens.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={sendMessage}
              >
                <Text style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
