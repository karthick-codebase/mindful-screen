import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  duration: number;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  lessons: Lesson[];
  estimatedHours: number;
  completedHours: number;
  category: string;
  description?: string;
}

// Mock skills data
const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Time Management Mastery',
    level: 'intermediate',
    progress: 65,
    lessons: [
      { id: '1', title: 'Pomodoro Technique Fundamentals', completed: true, duration: 15 },
      { id: '2', title: 'Eisenhower Priority Matrix', completed: true, duration: 20 },
      { id: '3', title: 'Time Blocking & Calendar Management', completed: false, duration: 25 },
      { id: '4', title: 'Delegation & Outsourcing', completed: false, duration: 30 },
      { id: '5', title: 'Energy Management vs Time Management', completed: false, duration: 22 },
      { id: '6', title: 'Digital Minimalism & Focus', completed: false, duration: 18 },
    ],
    estimatedHours: 12,
    completedHours: 7.8,
    category: 'productivity'
  },
  {
    id: '2',
    name: 'React Native Development',
    level: 'advanced',
    progress: 30,
    lessons: [
      { id: '1', title: 'Components & Props Deep Dive', completed: true, duration: 45 },
      { id: '2', title: 'State Management with Hooks', completed: false, duration: 60 },
      { id: '3', title: 'React Navigation Mastery', completed: false, duration: 40 },
      { id: '4', title: 'API Integration & Async Operations', completed: false, duration: 50 },
      { id: '5', title: 'Performance Optimization', completed: false, duration: 55 },
      { id: '6', title: 'Testing & Debugging', completed: false, duration: 35 },
    ],
    estimatedHours: 28,
    completedHours: 8.5,
    category: 'technology'
  },
  {
    id: '3',
    name: 'Mindfulness & Meditation',
    level: 'beginner',
    progress: 80,
    lessons: [
      { id: '1', title: 'Mindful Breathing Techniques', completed: true, duration: 10 },
      { id: '2', title: 'Progressive Body Scan', completed: true, duration: 15 },
      { id: '3', title: 'Walking Meditation Practice', completed: true, duration: 20 },
      { id: '4', title: 'Loving Kindness Meditation', completed: false, duration: 25 },
      { id: '5', title: 'Mindful Eating & Daily Activities', completed: false, duration: 18 },
    ],
    estimatedHours: 8,
    completedHours: 6.4,
    category: 'health'
  },
  {
    id: '4',
    name: 'Leadership & Communication',
    level: 'intermediate',
    progress: 45,
    lessons: [
      { id: '1', title: 'Effective Communication Skills', completed: true, duration: 30 },
      { id: '2', title: 'Team Building & Motivation', completed: true, duration: 35 },
      { id: '3', title: 'Strategic Decision Making', completed: false, duration: 40 },
      { id: '4', title: 'Conflict Resolution Techniques', completed: false, duration: 45 },
      { id: '5', title: 'Emotional Intelligence', completed: false, duration: 38 },
    ],
    estimatedHours: 16,
    completedHours: 7.2,
    category: 'business'
  },
  {
    id: '5',
    name: 'Digital Marketing Fundamentals',
    level: 'beginner',
    progress: 20,
    lessons: [
      { id: '1', title: 'SEO Basics & Keyword Research', completed: true, duration: 40 },
      { id: '2', title: 'Social Media Strategy', completed: false, duration: 35 },
      { id: '3', title: 'Content Marketing', completed: false, duration: 45 },
      { id: '4', title: 'Email Marketing Campaigns', completed: false, duration: 30 },
      { id: '5', title: 'Analytics & Performance Tracking', completed: false, duration: 50 },
    ],
    estimatedHours: 18,
    completedHours: 3.6,
    category: 'business'
  },
  {
    id: '6',
    name: 'Creative Writing & Storytelling',
    level: 'beginner',
    progress: 15,
    lessons: [
      { id: '1', title: 'Story Structure & Plot Development', completed: false, duration: 50 },
      { id: '2', title: 'Character Development', completed: false, duration: 45 },
      { id: '3', title: 'Dialogue Writing', completed: false, duration: 40 },
      { id: '4', title: 'Editing & Revision Techniques', completed: false, duration: 35 },
    ],
    estimatedHours: 15,
    completedHours: 2.3,
    category: 'creative'
  },
  {
    id: '7',
    name: 'Financial Literacy & Investment',
    level: 'intermediate',
    progress: 55,
    lessons: [
      { id: '1', title: 'Budgeting & Expense Tracking', completed: true, duration: 25 },
      { id: '2', title: 'Emergency Fund Planning', completed: true, duration: 20 },
      { id: '3', title: 'Investment Basics & Portfolio', completed: true, duration: 60 },
      { id: '4', title: 'Risk Management & Insurance', completed: false, duration: 40 },
      { id: '5', title: 'Retirement Planning', completed: false, duration: 45 },
    ],
    estimatedHours: 14,
    completedHours: 7.7,
    category: 'business'
  },
  {
    id: '8',
    name: 'Fitness & Nutrition',
    level: 'beginner',
    progress: 35,
    lessons: [
      { id: '1', title: 'Workout Planning & Form', completed: true, duration: 30 },
      { id: '2', title: 'Nutrition Fundamentals', completed: true, duration: 35 },
      { id: '3', title: 'Meal Prep & Planning', completed: false, duration: 25 },
      { id: '4', title: 'Recovery & Rest', completed: false, duration: 20 },
      { id: '5', title: 'Habit Formation', completed: false, duration: 30 },
    ],
    estimatedHours: 12,
    completedHours: 4.2,
    category: 'health'
  },
  {
    id: '9',
    name: 'Data Science & Analytics',
    level: 'advanced',
    progress: 25,
    lessons: [
      { id: '1', title: 'Python for Data Science', completed: true, duration: 60 },
      { id: '2', title: 'Statistical Analysis Fundamentals', completed: false, duration: 45 },
      { id: '3', title: 'Data Visualization with Matplotlib', completed: false, duration: 40 },
      { id: '4', title: 'Machine Learning Basics', completed: false, duration: 80 },
      { id: '5', title: 'SQL Database Management', completed: false, duration: 50 },
      { id: '6', title: 'Big Data Processing', completed: false, duration: 65 },
    ],
    estimatedHours: 32,
    completedHours: 8.0,
    category: 'technology'
  },
  {
    id: '10',
    name: 'Public Speaking & Presentation',
    level: 'intermediate',
    progress: 40,
    lessons: [
      { id: '1', title: 'Overcoming Stage Fright', completed: true, duration: 25 },
      { id: '2', title: 'Structuring Your Message', completed: true, duration: 30 },
      { id: '3', title: 'Body Language & Voice Control', completed: false, duration: 35 },
      { id: '4', title: 'Visual Aids & Slide Design', completed: false, duration: 40 },
      { id: '5', title: 'Audience Engagement Techniques', completed: false, duration: 45 },
    ],
    estimatedHours: 15,
    completedHours: 6.0,
    category: 'business'
  },
  {
    id: '11',
    name: 'Photography & Visual Arts',
    level: 'beginner',
    progress: 30,
    lessons: [
      { id: '1', title: 'Camera Basics & Composition', completed: true, duration: 40 },
      { id: '2', title: 'Lighting Techniques', completed: true, duration: 35 },
      { id: '3', title: 'Portrait Photography', completed: false, duration: 45 },
      { id: '4', title: 'Landscape & Nature Photography', completed: false, duration: 50 },
      { id: '5', title: 'Photo Editing with Lightroom', completed: false, duration: 60 },
      { id: '6', title: 'Building Your Portfolio', completed: false, duration: 30 },
    ],
    estimatedHours: 22,
    completedHours: 6.6,
    category: 'creative'
  },
  {
    id: '12',
    name: 'Cybersecurity Fundamentals',
    level: 'intermediate',
    progress: 50,
    lessons: [
      { id: '1', title: 'Network Security Basics', completed: true, duration: 45 },
      { id: '2', title: 'Encryption & Cryptography', completed: true, duration: 50 },
      { id: '3', title: 'Ethical Hacking Principles', completed: true, duration: 55 },
      { id: '4', title: 'Incident Response Planning', completed: false, duration: 40 },
      { id: '5', title: 'Security Auditing', completed: false, duration: 45 },
    ],
    estimatedHours: 20,
    completedHours: 10.0,
    category: 'technology'
  },
  {
    id: '13',
    name: 'Yoga & Flexibility Training',
    level: 'beginner',
    progress: 70,
    lessons: [
      { id: '1', title: 'Basic Yoga Poses & Alignment', completed: true, duration: 30 },
      { id: '2', title: 'Sun Salutation Sequence', completed: true, duration: 25 },
      { id: '3', title: 'Breathing Techniques (Pranayama)', completed: true, duration: 20 },
      { id: '4', title: 'Flexibility & Stretching Routines', completed: false, duration: 35 },
      { id: '5', title: 'Meditation & Relaxation', completed: false, duration: 30 },
    ],
    estimatedHours: 10,
    completedHours: 7.0,
    category: 'health'
  },
  {
    id: '14',
    name: 'Entrepreneurship & Startup',
    level: 'advanced',
    progress: 35,
    lessons: [
      { id: '1', title: 'Business Model Canvas', completed: true, duration: 40 },
      { id: '2', title: 'Market Research & Validation', completed: true, duration: 45 },
      { id: '3', title: 'Funding & Investment Strategies', completed: false, duration: 60 },
      { id: '4', title: 'Product Development & MVP', completed: false, duration: 55 },
      { id: '5', title: 'Marketing & Customer Acquisition', completed: false, duration: 50 },
      { id: '6', title: 'Scaling & Growth Strategies', completed: false, duration: 65 },
    ],
    estimatedHours: 28,
    completedHours: 9.8,
    category: 'business'
  },
  {
    id: '15',
    name: 'Music Production & Audio',
    level: 'intermediate',
    progress: 20,
    lessons: [
      { id: '1', title: 'Digital Audio Workstation (DAW) Basics', completed: true, duration: 50 },
      { id: '2', title: 'Recording Techniques', completed: false, duration: 45 },
      { id: '3', title: 'Mixing & Mastering', completed: false, duration: 60 },
      { id: '4', title: 'Sound Design & Synthesis', completed: false, duration: 55 },
      { id: '5', title: 'Music Theory for Producers', completed: false, duration: 40 },
    ],
    estimatedHours: 21,
    completedHours: 4.2,
    category: 'creative'
  },
  {
    id: '16',
    name: 'Sustainable Living & Eco-Friendly Practices',
    level: 'beginner',
    progress: 60,
    lessons: [
      { id: '1', title: 'Reducing Carbon Footprint', completed: true, duration: 25 },
      { id: '2', title: 'Zero Waste Lifestyle', completed: true, duration: 30 },
      { id: '3', title: 'Sustainable Fashion & Consumption', completed: true, duration: 35 },
      { id: '4', title: 'Renewable Energy at Home', completed: false, duration: 40 },
      { id: '5', title: 'Organic Gardening & Composting', completed: false, duration: 45 },
    ],
    estimatedHours: 14,
    completedHours: 8.4,
    category: 'lifestyle'
  },
  {
    id: '17',
    name: 'Game Development with Unity',
    level: 'advanced',
    progress: 15,
    lessons: [
      { id: '1', title: 'Unity Interface & Basics', completed: true, duration: 60 },
      { id: '2', title: 'C# Programming for Games', completed: false, duration: 80 },
      { id: '3', title: '2D Game Development', completed: false, duration: 70 },
      { id: '4', title: '3D Modeling & Animation', completed: false, duration: 90 },
      { id: '5', title: 'Game Physics & AI', completed: false, duration: 85 },
      { id: '6', title: 'Publishing & Monetization', completed: false, duration: 45 },
    ],
    estimatedHours: 35,
    completedHours: 5.25,
    category: 'technology'
  },
  {
    id: '18',
    name: 'Psychology & Mental Health',
    level: 'intermediate',
    progress: 45,
    lessons: [
      { id: '1', title: 'Understanding Mental Health', completed: true, duration: 35 },
      { id: '2', title: 'Stress Management Techniques', completed: true, duration: 30 },
      { id: '3', title: 'Cognitive Behavioral Therapy Basics', completed: true, duration: 40 },
      { id: '4', title: 'Building Resilience', completed: false, duration: 35 },
      { id: '5', title: 'Emotional Regulation', completed: false, duration: 30 },
    ],
    estimatedHours: 13,
    completedHours: 5.85,
    category: 'health'
  },
  {
    id: '19',
    name: 'Content Creation & Social Media',
    level: 'beginner',
    progress: 55,
    lessons: [
      { id: '1', title: 'Content Strategy & Planning', completed: true, duration: 30 },
      { id: '2', title: 'Video Creation & Editing', completed: true, duration: 45 },
      { id: '3', title: 'Instagram & TikTok Growth', completed: true, duration: 35 },
      { id: '4', title: 'YouTube Channel Management', completed: false, duration: 50 },
      { id: '5', title: 'Monetizing Your Content', completed: false, duration: 40 },
    ],
    estimatedHours: 16,
    completedHours: 8.8,
    category: 'creative'
  },
  {
    id: '20',
    name: 'Advanced Excel & Data Analysis',
    level: 'intermediate',
    progress: 75,
    lessons: [
      { id: '1', title: 'Advanced Formulas & Functions', completed: true, duration: 40 },
      { id: '2', title: 'Pivot Tables & Data Modeling', completed: true, duration: 45 },
      { id: '3', title: 'VBA Programming Basics', completed: true, duration: 50 },
      { id: '4', title: 'Dashboard Creation', completed: true, duration: 35 },
      { id: '5', title: 'Power BI Integration', completed: false, duration: 30 },
    ],
    estimatedHours: 16,
    completedHours: 12.0,
    category: 'business'
  },
];

export default function SkillLearningScreen({ navigation }: any) {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Productivity', 'Technology', 'Health', 'Business', 'Creative', 'Lifestyle'];

  const filteredSkills = selectedCategory === 'All' 
    ? mockSkills 
    : mockSkills.filter(skill => skill.category === selectedCategory.toLowerCase());

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return tokens.success;
      case 'intermediate': return tokens.warning;
      case 'advanced': return tokens.error;
      default: return tokens.muted;
    }
  };

  const handleSkillPress = (skill: Skill) => {
    Alert.alert(
      skill.name,
      `Progress: ${skill.progress}%\nLevel: ${skill.level}\n\nLessons: ${skill.lessons.length}\nEstimated: ${skill.estimatedHours}h\nCompleted: ${skill.completedHours}h`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue Learning', onPress: () => Alert.alert('Learning', 'Lesson content coming soon!') }
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
          Skills
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Overview */}
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
            textAlign: 'center',
          }}>
            📚 Your Learning Progress
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.primary,
                marginBottom: 4,
              }}>
                {mockSkills.length}
              </Text>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Skills Enrolled
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.success,
                marginBottom: 4,
              }}>
                {mockSkills.reduce((sum, skill) => sum + skill.completedHours, 0).toFixed(1)}h
              </Text>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Hours Completed
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.accent,
                marginBottom: 4,
              }}>
                {Math.round(mockSkills.reduce((sum, skill) => sum + skill.progress, 0) / mockSkills.length)}%
              </Text>
              <Text style={{
                fontSize: 14,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Average Progress
              </Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            🏷️ Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={{
                    backgroundColor: selectedCategory === category ? tokens.primary : tokens.surface,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: selectedCategory === category ? tokens.primary : tokens.border,
                  }}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={{
                    color: selectedCategory === category ? '#ffffff' : tokens.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Skills List */}
        {filteredSkills.map((skill, index) => (
          <TouchableOpacity
            key={skill.id}
            style={{
              backgroundColor: tokens.card,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
              ...(themeName === 'dark' && {
                shadowColor: getLevelColor(skill.level),
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }),
            }}
            onPress={() => handleSkillPress(skill)}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: tokens.text,
                  marginBottom: 4,
                }}>
                  {skill.name}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: tokens.textSecondary,
                  marginBottom: 12,
                }}>
                  {skill.lessons.length} lessons • Level: {skill.level}
                </Text>
                
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <View style={{
                    backgroundColor: getLevelColor(skill.level),
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: '#ffffff',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      {skill.level}
                    </Text>
                  </View>
                  
                  <Text style={{
                    fontSize: 14,
                    color: tokens.textSecondary,
                  }}>
                    {skill.category} • {skill.estimatedHours}h
                  </Text>
                </View>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: tokens.primary,
                  marginBottom: 8,
                }}>
                  {skill.progress}%
                </Text>
                <View style={{
                  width: 80,
                  height: 6,
                  backgroundColor: tokens.surface,
                  borderRadius: 3,
                }}>
                  <View style={{
                    width: `${skill.progress}%`,
                    height: '100%',
                    backgroundColor: tokens.primary,
                    borderRadius: 3,
                  }} />
                </View>
              </View>
            </View>

            {/* Lessons Progress */}
            <View style={{
              backgroundColor: tokens.surface,
              borderRadius: 12,
              padding: 16,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: tokens.text,
                marginBottom: 8,
              }}>
                Lessons ({skill.lessons.filter(l => l.completed).length}/{skill.lessons.length})
              </Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {skill.lessons.map((lesson, idx) => (
                  <View
                    key={lesson.id}
                    style={{
                      flex: 1,
                      height: 4,
                      backgroundColor: lesson.completed ? tokens.success : tokens.border,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Quick Actions */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 16,
          }}>
            Quick Actions
          </Text>
          
          <View style={{
            flexDirection: 'row',
            gap: 12,
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: tokens.primary,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
              }}
              onPress={() => Alert.alert('Browse Skills', 'Skill catalog coming soon!')}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '600',
              }}>
                🔍 Browse All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: tokens.success,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: 'center',
              }}
              onPress={() => Alert.alert('My Progress', 'Detailed progress tracking coming soon!')}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '600',
              }}>
                📈 My Progress
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
