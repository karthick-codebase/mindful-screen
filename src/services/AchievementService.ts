import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from './NotificationService';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'focus' | 'learning' | 'community' | 'streak' | 'milestone';
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedDate?: Date;
  xpReward: number;
  badge?: string;
}

export interface UserStats {
  totalFocusMinutes: number;
  totalBreakMinutes: number;
  focusSessionsCompleted: number;
  currentFocusStreak: number;
  longestFocusStreak: number;
  skillsStarted: number;
  skillsCompleted: number;
  totalLearningHours: number;
  communitiesJoined: number;
  messagesPosted: number;
  totalXP: number;
  level: number;
  achievementsUnlocked: number;
  lastActiveDate: Date;
}

class AchievementService {
  private achievements: Achievement[] = [
    // Focus Achievements
    {
      id: 'first_focus',
      title: 'First Focus',
      description: 'Complete your first focus session',
      icon: '🎯',
      category: 'focus',
      requirement: 1,
      currentProgress: 0,
      unlocked: false,
      xpReward: 50
    },
    {
      id: 'focus_warrior',
      title: 'Focus Warrior',
      description: 'Complete 10 focus sessions',
      icon: '⚔️',
      category: 'focus',
      requirement: 10,
      currentProgress: 0,
      unlocked: false,
      xpReward: 200
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      description: 'Complete 50 focus sessions',
      icon: '🧙‍♂️',
      category: 'focus',
      requirement: 50,
      currentProgress: 0,
      unlocked: false,
      xpReward: 500
    },
    {
      id: 'marathon_focuser',
      title: 'Marathon Focuser',
      description: 'Focus for 10 hours total',
      icon: '🏃‍♂️',
      category: 'focus',
      requirement: 600, // 10 hours in minutes
      currentProgress: 0,
      unlocked: false,
      xpReward: 300
    },
    {
      id: 'deep_work_champion',
      title: 'Deep Work Champion',
      description: 'Complete a 2-hour focus session',
      icon: '🏆',
      category: 'focus',
      requirement: 120, // 2 hours in minutes
      currentProgress: 0,
      unlocked: false,
      xpReward: 400
    },

    // Learning Achievements
    {
      id: 'lifelong_learner',
      title: 'Lifelong Learner',
      description: 'Start your first skill course',
      icon: '📚',
      category: 'learning',
      requirement: 1,
      currentProgress: 0,
      unlocked: false,
      xpReward: 75
    },
    {
      id: 'skill_collector',
      title: 'Skill Collector',
      description: 'Start 5 different skill courses',
      icon: '🎓',
      category: 'learning',
      requirement: 5,
      currentProgress: 0,
      unlocked: false,
      xpReward: 250
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Complete 20 hours of learning',
      icon: '🔍',
      category: 'learning',
      requirement: 20,
      currentProgress: 0,
      unlocked: false,
      xpReward: 350
    },
    {
      id: 'course_completer',
      title: 'Course Completer',
      description: 'Complete your first skill course',
      icon: '✅',
      category: 'learning',
      requirement: 1,
      currentProgress: 0,
      unlocked: false,
      xpReward: 300
    },

    // Community Achievements
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Join your first community',
      icon: '🦋',
      category: 'community',
      requirement: 1,
      currentProgress: 0,
      unlocked: false,
      xpReward: 100
    },
    {
      id: 'community_builder',
      title: 'Community Builder',
      description: 'Join 5 communities',
      icon: '🏗️',
      category: 'community',
      requirement: 5,
      currentProgress: 0,
      unlocked: false,
      xpReward: 200
    },
    {
      id: 'helpful_member',
      title: 'Helpful Member',
      description: 'Post 10 messages in communities',
      icon: '🤝',
      category: 'community',
      requirement: 10,
      currentProgress: 0,
      unlocked: false,
      xpReward: 150
    },

    // Streak Achievements
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Maintain a 7-day focus streak',
      icon: '👑',
      category: 'streak',
      requirement: 7,
      currentProgress: 0,
      unlocked: false,
      xpReward: 400
    },
    {
      id: 'habit_master',
      title: 'Habit Master',
      description: 'Maintain a 30-day focus streak',
      icon: '🎖️',
      category: 'streak',
      requirement: 30,
      currentProgress: 0,
      unlocked: false,
      xpReward: 1000
    },
    {
      id: 'dedication_legend',
      title: 'Dedication Legend',
      description: 'Maintain a 100-day focus streak',
      icon: '🌟',
      category: 'streak',
      requirement: 100,
      currentProgress: 0,
      unlocked: false,
      xpReward: 2500
    },

    // Milestone Achievements
    {
      id: 'level_up',
      title: 'Level Up!',
      description: 'Reach level 5',
      icon: '⬆️',
      category: 'milestone',
      requirement: 5,
      currentProgress: 0,
      unlocked: false,
      xpReward: 200
    },
    {
      id: 'xp_collector',
      title: 'XP Collector',
      description: 'Earn 1000 XP',
      icon: '💎',
      category: 'milestone',
      requirement: 1000,
      currentProgress: 0,
      unlocked: false,
      xpReward: 300
    },
    {
      id: 'productivity_guru',
      title: 'Productivity Guru',
      description: 'Reach level 20',
      icon: '🧘‍♂️',
      category: 'milestone',
      requirement: 20,
      currentProgress: 0,
      unlocked: false,
      xpReward: 1000
    }
  ];

  private userStats: UserStats = {
    totalFocusMinutes: 0,
    totalBreakMinutes: 0,
    focusSessionsCompleted: 0,
    currentFocusStreak: 0,
    longestFocusStreak: 0,
    skillsStarted: 0,
    skillsCompleted: 0,
    totalLearningHours: 0,
    communitiesJoined: 0,
    messagesPosted: 0,
    totalXP: 0,
    level: 1,
    achievementsUnlocked: 0,
    lastActiveDate: new Date()
  };

  constructor() {
    this.loadData();
  }

  // Load achievements and stats from storage
  async loadData(): Promise<void> {
    try {
      const [achievementsData, statsData] = await Promise.all([
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('user_stats')
      ]);

      if (achievementsData) {
        const stored = JSON.parse(achievementsData);
        this.achievements = this.achievements.map(achievement => {
          const storedAchievement = stored.find((a: Achievement) => a.id === achievement.id);
          return storedAchievement ? { ...achievement, ...storedAchievement } : achievement;
        });
      }

      if (statsData) {
        this.userStats = { ...this.userStats, ...JSON.parse(statsData) };
      }
    } catch (error) {
      console.error('Error loading achievement data:', error);
    }
  }

  // Save achievements and stats to storage
  async saveData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem('achievements', JSON.stringify(this.achievements)),
        AsyncStorage.setItem('user_stats', JSON.stringify(this.userStats))
      ]);
    } catch (error) {
      console.error('Error saving achievement data:', error);
    }
  }

  // Update focus session completion
  async updateFocusSession(durationMinutes: number): Promise<Achievement[]> {
    this.userStats.totalFocusMinutes += durationMinutes;
    this.userStats.focusSessionsCompleted += 1;
    this.userStats.currentFocusStreak += 1;
    this.userStats.longestFocusStreak = Math.max(
      this.userStats.longestFocusStreak,
      this.userStats.currentFocusStreak
    );
    this.userStats.lastActiveDate = new Date();

    // Update achievement progress
    const newlyUnlocked = await this.checkAchievements([
      { type: 'focus_sessions', value: this.userStats.focusSessionsCompleted },
      { type: 'focus_minutes', value: this.userStats.totalFocusMinutes },
      { type: 'focus_streak', value: this.userStats.currentFocusStreak },
      { type: 'single_session', value: durationMinutes }
    ]);

    await this.saveData();
    return newlyUnlocked;
  }

  // Update skill learning progress
  async updateSkillProgress(action: 'start' | 'complete', hoursSpent: number = 0): Promise<Achievement[]> {
    if (action === 'start') {
      this.userStats.skillsStarted += 1;
    } else if (action === 'complete') {
      this.userStats.skillsCompleted += 1;
    }
    
    this.userStats.totalLearningHours += hoursSpent;
    this.userStats.lastActiveDate = new Date();

    const newlyUnlocked = await this.checkAchievements([
      { type: 'skills_started', value: this.userStats.skillsStarted },
      { type: 'skills_completed', value: this.userStats.skillsCompleted },
      { type: 'learning_hours', value: this.userStats.totalLearningHours }
    ]);

    await this.saveData();
    return newlyUnlocked;
  }

  // Update community participation
  async updateCommunityActivity(action: 'join' | 'post'): Promise<Achievement[]> {
    if (action === 'join') {
      this.userStats.communitiesJoined += 1;
    } else if (action === 'post') {
      this.userStats.messagesPosted += 1;
    }
    
    this.userStats.lastActiveDate = new Date();

    const newlyUnlocked = await this.checkAchievements([
      { type: 'communities_joined', value: this.userStats.communitiesJoined },
      { type: 'messages_posted', value: this.userStats.messagesPosted }
    ]);

    await this.saveData();
    return newlyUnlocked;
  }

  // Check and unlock achievements
  private async checkAchievements(updates: { type: string; value: number }[]): Promise<Achievement[]> {
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of this.achievements) {
      if (achievement.unlocked) continue;

      let shouldUnlock = false;

      // Check focus achievements
      if (achievement.id === 'first_focus' && this.userStats.focusSessionsCompleted >= 1) {
        shouldUnlock = true;
      } else if (achievement.id === 'focus_warrior' && this.userStats.focusSessionsCompleted >= 10) {
        shouldUnlock = true;
      } else if (achievement.id === 'focus_master' && this.userStats.focusSessionsCompleted >= 50) {
        shouldUnlock = true;
      } else if (achievement.id === 'marathon_focuser' && this.userStats.totalFocusMinutes >= 600) {
        shouldUnlock = true;
      } else if (achievement.id === 'deep_work_champion') {
        const singleSessionUpdate = updates.find(u => u.type === 'single_session');
        if (singleSessionUpdate && singleSessionUpdate.value >= 120) {
          shouldUnlock = true;
        }
      }

      // Check learning achievements
      else if (achievement.id === 'lifelong_learner' && this.userStats.skillsStarted >= 1) {
        shouldUnlock = true;
      } else if (achievement.id === 'skill_collector' && this.userStats.skillsStarted >= 5) {
        shouldUnlock = true;
      } else if (achievement.id === 'knowledge_seeker' && this.userStats.totalLearningHours >= 20) {
        shouldUnlock = true;
      } else if (achievement.id === 'course_completer' && this.userStats.skillsCompleted >= 1) {
        shouldUnlock = true;
      }

      // Check community achievements
      else if (achievement.id === 'social_butterfly' && this.userStats.communitiesJoined >= 1) {
        shouldUnlock = true;
      } else if (achievement.id === 'community_builder' && this.userStats.communitiesJoined >= 5) {
        shouldUnlock = true;
      } else if (achievement.id === 'helpful_member' && this.userStats.messagesPosted >= 10) {
        shouldUnlock = true;
      }

      // Check streak achievements
      else if (achievement.id === 'consistency_king' && this.userStats.currentFocusStreak >= 7) {
        shouldUnlock = true;
      } else if (achievement.id === 'habit_master' && this.userStats.currentFocusStreak >= 30) {
        shouldUnlock = true;
      } else if (achievement.id === 'dedication_legend' && this.userStats.currentFocusStreak >= 100) {
        shouldUnlock = true;
      }

      // Check milestone achievements
      else if (achievement.id === 'level_up' && this.userStats.level >= 5) {
        shouldUnlock = true;
      } else if (achievement.id === 'xp_collector' && this.userStats.totalXP >= 1000) {
        shouldUnlock = true;
      } else if (achievement.id === 'productivity_guru' && this.userStats.level >= 20) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date();
        achievement.currentProgress = achievement.requirement;
        
        // Award XP
        this.userStats.totalXP += achievement.xpReward;
        this.userStats.achievementsUnlocked += 1;
        
        // Check for level up
        this.updateLevel();
        
        newlyUnlocked.push(achievement);
        
        // Send notification
        NotificationService.scheduleAchievementNotification(
          achievement.title,
          achievement.description
        );
      } else {
        // Update progress for tracking
        this.updateAchievementProgress(achievement, updates);
      }
    }

    return newlyUnlocked;
  }

  // Update achievement progress for display
  private updateAchievementProgress(achievement: Achievement, updates: { type: string; value: number }[]): void {
    switch (achievement.id) {
      case 'focus_warrior':
      case 'focus_master':
        achievement.currentProgress = this.userStats.focusSessionsCompleted;
        break;
      case 'marathon_focuser':
        achievement.currentProgress = this.userStats.totalFocusMinutes;
        break;
      case 'skill_collector':
        achievement.currentProgress = this.userStats.skillsStarted;
        break;
      case 'knowledge_seeker':
        achievement.currentProgress = this.userStats.totalLearningHours;
        break;
      case 'community_builder':
        achievement.currentProgress = this.userStats.communitiesJoined;
        break;
      case 'helpful_member':
        achievement.currentProgress = this.userStats.messagesPosted;
        break;
      case 'consistency_king':
      case 'habit_master':
      case 'dedication_legend':
        achievement.currentProgress = this.userStats.currentFocusStreak;
        break;
      case 'level_up':
      case 'productivity_guru':
        achievement.currentProgress = this.userStats.level;
        break;
      case 'xp_collector':
        achievement.currentProgress = this.userStats.totalXP;
        break;
    }
  }

  // Update user level based on XP
  private updateLevel(): void {
    // XP required for each level increases exponentially
    const xpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));
    
    let newLevel = 1;
    let totalXpRequired = 0;
    
    while (totalXpRequired <= this.userStats.totalXP) {
      newLevel++;
      totalXpRequired += xpForLevel(newLevel);
    }
    
    this.userStats.level = newLevel - 1;
  }

  // Get all achievements
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  // Get user stats
  getUserStats(): UserStats {
    return this.userStats;
  }

  // Get achievements by category
  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category);
  }

  // Get recent achievements (last 7 days)
  getRecentAchievements(): Achievement[] {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.achievements.filter(
      achievement => 
        achievement.unlocked && 
        achievement.unlockedDate && 
        achievement.unlockedDate > sevenDaysAgo
    );
  }

  // Get progress towards next level
  getNextLevelProgress(): { currentXP: number; requiredXP: number; progress: number } {
    const xpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));
    const requiredXP = xpForLevel(this.userStats.level + 1);
    
    // Calculate XP already earned for current level
    let xpForCurrentLevel = 0;
    for (let i = 1; i < this.userStats.level; i++) {
      xpForCurrentLevel += xpForLevel(i);
    }
    
    const currentLevelXP = this.userStats.totalXP - xpForCurrentLevel;
    const progress = Math.min(100, (currentLevelXP / requiredXP) * 100);
    
    return {
      currentXP: currentLevelXP,
      requiredXP,
      progress
    };
  }

  // Reset streak (called when user misses a day)
  resetStreak(): void {
    this.userStats.currentFocusStreak = 0;
    this.saveData();
  }
}

export default new AchievementService();
