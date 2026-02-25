import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StatusBar, Dimensions, TextInput, Modal, FlatList } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string;
  moderators: string[];
  members: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  leaderboard: any[];
  tags: string[];
}

// Mock data for communities
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Productivity Masters',
    description: 'Share tips and techniques for maximum productivity',
    category: 'Productivity',
    createdBy: 'mentor1',
    moderators: ['mentor1'],
    members: ['user1', 'user2', 'user3'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 156,
    leaderboard: [],
    tags: ['productivity', 'focus', 'tips'],
  },
  {
    id: '2',
    name: 'Study Group - Computer Science',
    description: 'CS students helping each other learn and grow',
    category: 'Education',
    createdBy: 'mentor2',
    moderators: ['mentor2'],
    members: ['user1', 'user4', 'user5'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 89,
    leaderboard: [],
    tags: ['computer-science', 'study', 'programming'],
  },
  {
    id: '3',
    name: 'Mindfulness & Mental Health',
    description: 'Supporting each other in mental wellness journey',
    category: 'Wellness',
    createdBy: 'mentor3',
    moderators: ['mentor3'],
    members: ['user2', 'user6'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 234,
    leaderboard: [],
    tags: ['mindfulness', 'mental-health', 'wellness'],
  },
  {
    id: '4',
    name: 'Early Risers Club',
    description: 'Join fellow early birds for morning motivation and accountability',
    category: 'Lifestyle',
    createdBy: 'mentor4',
    moderators: ['mentor4'],
    members: ['user1', 'user3', 'user7', 'user8'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 127,
    leaderboard: [],
    tags: ['morning', 'habits', 'accountability'],
  },
  {
    id: '5',
    name: 'Creative Writers Circle',
    description: 'Share your stories, get feedback, and improve your writing skills',
    category: 'Creative',
    createdBy: 'mentor5',
    moderators: ['mentor5', 'mentor6'],
    members: ['user2', 'user4', 'user9', 'user10'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 78,
    leaderboard: [],
    tags: ['writing', 'creativity', 'feedback'],
  },
  {
    id: '6',
    name: 'Fitness Enthusiasts',
    description: 'Workout plans, nutrition tips, and fitness motivation',
    category: 'Health',
    createdBy: 'mentor7',
    moderators: ['mentor7'],
    members: ['user1', 'user5', 'user11', 'user12'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 203,
    leaderboard: [],
    tags: ['fitness', 'health', 'workout'],
  },
  {
    id: '7',
    name: 'Language Learning Hub',
    description: 'Practice languages with native speakers and fellow learners',
    category: 'Education',
    createdBy: 'mentor8',
    moderators: ['mentor8', 'mentor9'],
    members: ['user3', 'user6', 'user13', 'user14'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 145,
    leaderboard: [],
    tags: ['languages', 'learning', 'culture'],
  },
  {
    id: '8',
    name: 'Entrepreneurs Network',
    description: 'Connect with fellow entrepreneurs, share ideas and get advice',
    category: 'Business',
    createdBy: 'mentor10',
    moderators: ['mentor10'],
    members: ['user4', 'user7', 'user15', 'user16'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 92,
    leaderboard: [],
    tags: ['entrepreneurship', 'business', 'networking'],
  },
  {
    id: '9',
    name: 'Digital Detox Support',
    description: 'Help each other reduce screen time and live more mindfully',
    category: 'Wellness',
    createdBy: 'mentor11',
    moderators: ['mentor11'],
    members: ['user2', 'user8', 'user17', 'user18'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 167,
    leaderboard: [],
    tags: ['digital-detox', 'mindfulness', 'balance'],
  },
  {
    id: '10',
    name: 'Photography Masters',
    description: 'Share your photos, learn techniques, and get inspired',
    category: 'Creative',
    createdBy: 'mentor12',
    moderators: ['mentor12'],
    members: ['user1', 'user9', 'user19', 'user20'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 134,
    leaderboard: [],
    tags: ['photography', 'art', 'creativity'],
  },
  {
    id: '11',
    name: 'Remote Work Warriors',
    description: 'Tips and support for successful remote work and productivity',
    category: 'Productivity',
    createdBy: 'mentor13',
    moderators: ['mentor13'],
    members: ['user5', 'user10', 'user21', 'user22'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 189,
    leaderboard: [],
    tags: ['remote-work', 'productivity', 'work-life-balance'],
  },
  {
    id: '12',
    name: 'Book Club Discussions',
    description: 'Monthly book discussions and reading recommendations',
    category: 'Education',
    createdBy: 'mentor14',
    moderators: ['mentor14', 'mentor15'],
    members: ['user3', 'user11', 'user23', 'user24'],
    isPrivate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    memberCount: 98,
    leaderboard: [],
    tags: ['reading', 'books', 'discussion'],
  },
];

export default function CommunityScreen({ navigation }: any) {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'active'>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { name: 'All', icon: '🌟' },
    { name: 'Productivity', icon: '⚡' },
    { name: 'Education', icon: '📚' },
    { name: 'Wellness', icon: '🧘' },
    { name: 'Lifestyle', icon: '🌱' },
    { name: 'Creative', icon: '🎨' },
    { name: 'Health', icon: '💪' },
    { name: 'Business', icon: '💼' },
  ];

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const joinCommunity = (communityId: string) => {
    Alert.alert(
      'Join Community',
      'Would you like to join this community?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            // Here you would implement the actual join logic
            Alert.alert('Success', 'You have joined the community!');
          }
        }
      ]
    );
  };

  const createCommunity = () => {
    if (user?.role !== 'mentor') {
      Alert.alert(
        'Mentor Required',
        'Only mentors can create communities. Would you like to become a mentor?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Learn More', onPress: () => {
            // Navigate to mentor application
            Alert.alert('Info', 'Mentor application feature coming soon!');
          }}
        ]
      );
      return;
    }
    
    // Navigate to create community screen
    Alert.alert('Info', 'Create community feature coming soon!');
  };

  const CommunityCard = ({ community }: { community: Community }) => {
    const getCategoryIcon = (category: string) => {
      const categoryMap: { [key: string]: string } = {
        'Productivity': '⚡',
        'Education': '📚',
        'Wellness': '🧘',
        'Lifestyle': '🌱',
        'Creative': '🎨',
        'Health': '💪',
        'Business': '💼',
      };
      return categoryMap[category] || '🌟';
    };

    return (
      <TouchableOpacity
        style={{
          backgroundColor: tokens.card,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: tokens.primary,
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }),
        }}
        onPress={() => navigation.navigate('CommunityChat', { communityId: community.id })}
      >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
      }}>
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>
              {getCategoryIcon(community.category)}
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: tokens.text,
            }}>
              {community.name}
            </Text>
          </View>
          <Text style={{
            fontSize: 12,
            color: tokens.primary,
            backgroundColor: tokens.surface,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            alignSelf: 'flex-start',
            fontWeight: '600',
          }}>
            {community.category}
          </Text>
        </View>
        <Text style={{
          fontSize: 12,
          color: tokens.textSecondary,
        }}>
          {community.memberCount} members
        </Text>
      </View>
      
      <Text style={{
        fontSize: 14,
        color: tokens.textSecondary,
        marginBottom: 12,
        lineHeight: 20,
      }}>
        {community.description}
      </Text>
      
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 1,
        }}>
          {community.tags.slice(0, 3).map((tag, index) => (
            <Text
              key={index}
              style={{
                fontSize: 10,
                color: tokens.muted,
                backgroundColor: tokens.surface,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 3,
                marginRight: 4,
                marginBottom: 4,
              }}
            >
              #{tag}
            </Text>
          ))}
        </View>
        
        <TouchableOpacity
          style={{
            backgroundColor: tokens.primary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
          onPress={() => joinCommunity(community.id)}
        >
          <Text style={{
            color: '#ffffff',
            fontSize: 12,
            fontWeight: '600',
          }}>
            Join
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
      {/* Header */}
      <View style={{
        backgroundColor: tokens.primary,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        ...(themeName === 'dark' && {
          shadowColor: tokens.neon,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 10,
        }),
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
          }}>
            Communities
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
            onPress={createCommunity}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 12,
              fontWeight: '600',
            }}>
              ➕ Create
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TextInput
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 16,
            color: tokens.text,
          }}
          placeholder="Search communities..."
          placeholderTextColor={tokens.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <View style={{
        backgroundColor: tokens.surface,
        paddingVertical: 16,
      }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 20,
            alignItems: 'center',
          }}
          style={{ flexGrow: 0 }}
        >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={{
              backgroundColor: selectedCategory === category.name ? tokens.primary : tokens.card,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 25,
              marginRight: 12,
              borderWidth: 2,
              borderColor: selectedCategory === category.name ? tokens.primary : tokens.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 100, // Fixed minimum width
              height: 44, // Fixed height
              ...(themeName === 'dark' && selectedCategory === category.name && {
                shadowColor: tokens.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 4,
              }),
            }}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text style={{
              fontSize: 16,
              marginRight: 6,
              lineHeight: 16, // Fixed line height
            }}>
              {category.icon}
            </Text>
            <Text style={{
              color: selectedCategory === category.name ? '#ffffff' : tokens.text,
              fontSize: 14,
              fontWeight: '600',
              lineHeight: 16, // Fixed line height
              textAlign: 'center',
            }}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Communities List */}
      <FlatList
        data={filteredCommunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommunityCard community={item} />}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
          }}>
            <Text style={{
              fontSize: 18,
              color: tokens.textSecondary,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              No communities found
            </Text>
            <Text style={{
              fontSize: 14,
              color: tokens.muted,
              textAlign: 'center',
            }}>
              Try adjusting your search or category filter
            </Text>
          </View>
        }
      />

      {/* Floating Action Button for Mentors */}
      {user?.role === 'mentor' && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: tokens.secondary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            ...(themeName === 'dark' && {
              shadowColor: tokens.glow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.6,
              shadowRadius: 12,
              elevation: 12,
            }),
          }}
          onPress={createCommunity}
        >
          <Text style={{
            color: '#ffffff',
            fontSize: 24,
            fontWeight: 'bold',
          }}>
            +
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
