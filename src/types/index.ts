// Type definitions for Mindful Screen App

export type UserRole = 'student' | 'mentor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  skills: string[];
  joinedCommunities: string[];
  createdAt: Date;
  updatedAt: Date;
  stats: UserStats;
  profilePicture?: string;
  bio?: string;
  mentorInfo?: MentorInfo;
}

export interface UserStats {
  totalFocusTime: number; // in minutes
  focusSessionsCount: number;
  communitiesJoined: number;
  skillsLearned: number;
  gamesPlayed: number;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: Date;
}

export interface MentorInfo {
  expertise: string[];
  experience: string;
  rating: number;
  studentsHelped: number;
  communitiesCreated: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  createdBy: string; // mentor ID
  moderators: string[];
  members: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  leaderboard: LeaderboardEntry[];
  rules?: string[];
  tags: string[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  focusTime: number;
  contributions: number;
  rank: number;
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  category: string;
  goal?: string;
  completed: boolean;
  distractions: number;
  apps?: AppUsage[];
}

export interface AppUsage {
  appName: string;
  packageName: string;
  timeSpent: number; // in minutes
  openCount: number;
}

export interface Skill {
  id: string;
  userId: string;
  domain: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number; // 0-100
  xp: number;
  startedAt: Date;
  lastPracticed: Date;
  milestones: SkillMilestone[];
}

export interface SkillMilestone {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
}

export interface ChatMessage {
  id: string;
  communityId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: Date;
  edited: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface Game {
  id: string;
  type: 'word' | 'logic' | 'trivia' | 'puzzle';
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: any; // Game-specific content
  rewards: GameReward;
  playCount: number;
  averageScore: number;
}

export interface GameReward {
  xp: number;
  coins?: number;
  badge?: string;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number; // in seconds
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'focus_reminder' | 'community_activity' | 'skill_milestone' | 'game_challenge';
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface ScreenTimeData {
  date: string;
  totalScreenTime: number; // in minutes
  apps: AppUsage[];
  focusTime: number;
  distractionTime: number;
  pickupCount: number;
}

// Theme types
export type ThemeName = 'light' | 'dark';

export interface ThemeTokens {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  // Cyberpunk theme additions
  neon?: string;
  glow?: string;
  cyber?: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  FocusTimer: undefined;
  Community: { communityId?: string };
  CommunityChat: { communityId: string };
  Leaderboard: { communityId?: string };
  SkillLearning: undefined;
  SkillDetail: { skillId: string };
  Chatbot: undefined;
  Games: undefined;
  GamePlay: { gameId: string };
  Notifications: undefined;
  ScreenTime: undefined;
};
