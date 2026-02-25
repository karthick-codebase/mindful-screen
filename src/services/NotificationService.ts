import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSettings {
  focusReminders: boolean;
  breakReminders: boolean;
  dailyGoalReminders: boolean;
  skillLearningReminders: boolean;
  communityUpdates: boolean;
  achievementNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "08:00"
  };
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  type: 'focus' | 'break' | 'goal' | 'skill' | 'community' | 'achievement';
  scheduledTime: Date;
  recurring?: 'daily' | 'weekly' | 'custom';
  data?: any;
}

class NotificationService {
  private settings: NotificationSettings = {
    focusReminders: true,
    breakReminders: true,
    dailyGoalReminders: true,
    skillLearningReminders: true,
    communityUpdates: false,
    achievementNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      startTime: "22:00",
      endTime: "08:00"
    }
  };

  private scheduledNotifications: ScheduledNotification[] = [];

  constructor() {
    this.loadSettings();
  }

  // Load notification settings from storage
  async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notification_settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  // Save notification settings
  async saveSettings(newSettings: Partial<NotificationSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await AsyncStorage.setItem('notification_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return this.settings;
  }

  // Check if notifications are allowed during quiet hours
  private isQuietTime(): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { startTime, endTime } = this.settings.quietHours;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= startTime && currentTime <= endTime;
  }

  // Schedule a focus session reminder
  scheduleFocusReminder(sessionDuration: number): void {
    if (!this.settings.focusReminders || this.isQuietTime()) return;

    const notification: ScheduledNotification = {
      id: `focus_${Date.now()}`,
      title: '🧠 Focus Time!',
      body: `Ready for a ${sessionDuration}-minute focus session? Let's boost your productivity!`,
      type: 'focus',
      scheduledTime: new Date(Date.now() + 5000), // 5 seconds from now for demo
      data: { sessionDuration }
    };

    this.scheduleNotification(notification);
  }

  // Schedule a break reminder
  scheduleBreakReminder(breakDuration: number): void {
    if (!this.settings.breakReminders || this.isQuietTime()) return;

    const notification: ScheduledNotification = {
      id: `break_${Date.now()}`,
      title: '☕ Break Time!',
      body: `Time for a ${breakDuration}-minute break. Stretch, hydrate, and recharge!`,
      type: 'break',
      scheduledTime: new Date(Date.now() + 3000), // 3 seconds from now for demo
      data: { breakDuration }
    };

    this.scheduleNotification(notification);
  }

  // Schedule daily goal reminder
  scheduleDailyGoalReminder(): void {
    if (!this.settings.dailyGoalReminders || this.isQuietTime()) return;

    const notification: ScheduledNotification = {
      id: `goal_${Date.now()}`,
      title: '🎯 Daily Goal Check',
      body: 'How are you progressing with your daily productivity goals?',
      type: 'goal',
      scheduledTime: new Date(Date.now() + 10000), // 10 seconds from now for demo
      recurring: 'daily'
    };

    this.scheduleNotification(notification);
  }

  // Schedule skill learning reminder
  scheduleSkillLearningReminder(skillName: string): void {
    if (!this.settings.skillLearningReminders || this.isQuietTime()) return;

    const notification: ScheduledNotification = {
      id: `skill_${Date.now()}`,
      title: '📚 Continue Learning',
      body: `Ready to continue with "${skillName}"? Keep building your skills!`,
      type: 'skill',
      scheduledTime: new Date(Date.now() + 7000), // 7 seconds from now for demo
      data: { skillName }
    };

    this.scheduleNotification(notification);
  }

  // Schedule achievement notification
  scheduleAchievementNotification(achievement: string, description: string): void {
    if (!this.settings.achievementNotifications) return;

    const notification: ScheduledNotification = {
      id: `achievement_${Date.now()}`,
      title: `🏆 Achievement Unlocked!`,
      body: `${achievement}: ${description}`,
      type: 'achievement',
      scheduledTime: new Date(Date.now() + 1000), // 1 second from now
      data: { achievement, description }
    };

    this.scheduleNotification(notification);
  }

  // Schedule community update notification
  scheduleCommunityUpdate(communityName: string, updateType: string): void {
    if (!this.settings.communityUpdates || this.isQuietTime()) return;

    const notification: ScheduledNotification = {
      id: `community_${Date.now()}`,
      title: '👥 Community Update',
      body: `New ${updateType} in ${communityName}. Check it out!`,
      type: 'community',
      scheduledTime: new Date(Date.now() + 5000),
      data: { communityName, updateType }
    };

    this.scheduleNotification(notification);
  }

  // Generic notification scheduler
  private scheduleNotification(notification: ScheduledNotification): void {
    this.scheduledNotifications.push(notification);
    
    // Simulate notification display (in a real app, you'd use expo-notifications)
    const timeUntilNotification = notification.scheduledTime.getTime() - Date.now();
    
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        this.displayNotification(notification);
      }, timeUntilNotification);
    }
  }

  // Display notification (mock implementation)
  private displayNotification(notification: ScheduledNotification): void {
    console.log('📱 Notification:', notification.title, '-', notification.body);
    
    // In a real app, you would use:
    // - expo-notifications for local notifications
    // - Push notification service for remote notifications
    // - Native alert or toast for immediate feedback
    
    // For demo purposes, we'll just log it
    // You could also show an in-app notification banner
  }

  // Get smart notification suggestions based on user behavior
  getSmartSuggestions(): string[] {
    const suggestions = [];
    const now = new Date();
    const hour = now.getHours();

    // Morning suggestions
    if (hour >= 6 && hour < 12) {
      suggestions.push('🌅 Good morning! Ready to start a productive day?');
      suggestions.push('☕ Consider starting with a 25-minute focus session');
    }

    // Afternoon suggestions
    if (hour >= 12 && hour < 17) {
      suggestions.push('🌞 Afternoon energy boost! Time for a skill learning session?');
      suggestions.push('💪 Take a 5-minute break to stretch and refocus');
    }

    // Evening suggestions
    if (hour >= 17 && hour < 22) {
      suggestions.push('🌆 Evening reflection: How did your productivity goals go today?');
      suggestions.push('📚 Wind down with some light reading or skill practice');
    }

    // Late night suggestions
    if (hour >= 22 || hour < 6) {
      suggestions.push('🌙 Consider preparing for tomorrow and getting good rest');
      suggestions.push('😴 Quality sleep is essential for productivity');
    }

    return suggestions;
  }

  // Clear all scheduled notifications
  clearAllNotifications(): void {
    this.scheduledNotifications = [];
  }

  // Get notification statistics
  getNotificationStats(): { total: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    this.scheduledNotifications.forEach(notification => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
    });

    return {
      total: this.scheduledNotifications.length,
      byType
    };
  }
}

export default new NotificationService();
