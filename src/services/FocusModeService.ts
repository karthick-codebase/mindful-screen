import { Alert, AppState, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FocusSession {
  id: string;
  startTime: Date;
  duration: number; // in minutes
  isActive: boolean;
  blockedApps: string[];
  allowedBreaks: number;
  breaksUsed: number;
}

class FocusModeService {
  private currentSession: FocusSession | null = null;
  private sessionTimer: NodeJS.Timeout | null = null;
  private appStateListener: any = null;
  private backHandlerListener: any = null;
  private notificationBlocker: NodeJS.Timeout | null = null;

  // Start a focus session
  async startFocusSession(duration: number, blockedApps: string[] = []): Promise<void> {
    try {
      // End any existing session
      await this.endFocusSession();

      // Create new session
      this.currentSession = {
        id: Date.now().toString(),
        startTime: new Date(),
        duration,
        isActive: true,
        blockedApps,
        allowedBreaks: Math.floor(duration / 25), // 1 break per 25 minutes
        breaksUsed: 0,
      };

      // Save session to storage
      await AsyncStorage.setItem('activeFocusSession', JSON.stringify(this.currentSession));

      // Start monitoring
      this.startMonitoring();

      // Set session timer
      this.sessionTimer = setTimeout(() => {
        this.completeFocusSession();
      }, duration * 60 * 1000);

      console.log('🎯 Focus session started:', this.currentSession);
    } catch (error) {
      console.error('Error starting focus session:', error);
      throw error;
    }
  }

  // End focus session
  async endFocusSession(): Promise<void> {
    try {
      if (this.currentSession) {
        this.currentSession.isActive = false;
        await AsyncStorage.removeItem('activeFocusSession');
      }

      // Clear timers and listeners
      if (this.sessionTimer) {
        clearTimeout(this.sessionTimer);
        this.sessionTimer = null;
      }

      this.stopMonitoring();
      this.currentSession = null;

      console.log('🏁 Focus session ended');
    } catch (error) {
      console.error('Error ending focus session:', error);
    }
  }

  // Complete focus session successfully
  private async completeFocusSession(): Promise<void> {
    if (!this.currentSession) return;

    const session = this.currentSession;
    await this.endFocusSession();

    // Calculate success metrics
    const completionRate = 100; // Full completion
    const focusScore = Math.max(0, 100 - (session.breaksUsed * 10));

    Alert.alert(
      '🎉 Focus Session Complete!',
      `Great job! You completed ${session.duration} minutes of focused work.\n\n` +
      `📊 Focus Score: ${focusScore}/100\n` +
      `⏱️ Breaks Used: ${session.breaksUsed}/${session.allowedBreaks}\n` +
      `🏆 You earned ${Math.floor(session.duration * 2)} XP!`,
      [
        {
          text: 'Continue Focusing',
          onPress: () => this.startFocusSession(session.duration, session.blockedApps)
        },
        { text: 'Take a Break', style: 'default' }
      ]
    );
  }

  // Start monitoring for distractions
  private startMonitoring(): void {
    // Monitor app state changes
    this.appStateListener = AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    // Block back button during focus
    this.backHandlerListener = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));

    // Start notification blocking simulation
    this.startNotificationBlocking();
  }

  // Stop monitoring
  private stopMonitoring(): void {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }

    if (this.backHandlerListener) {
      this.backHandlerListener.remove();
      this.backHandlerListener = null;
    }

    if (this.notificationBlocker) {
      clearInterval(this.notificationBlocker);
      this.notificationBlocker = null;
    }
  }

  // Handle app state changes
  private handleAppStateChange(nextAppState: string): void {
    if (!this.currentSession?.isActive) return;

    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // User tried to leave the app during focus
      this.handleDistraction('App Switch Detected');
    }
  }

  // Handle back button press
  private handleBackPress(): boolean {
    if (!this.currentSession?.isActive) return false;

    Alert.alert(
      '🔒 Focus Mode Active',
      'You\'re in focus mode! Are you sure you want to break your focus session?',
      [
        {
          text: 'Stay Focused',
          style: 'default',
          onPress: () => {} // Do nothing, stay in app
        },
        {
          text: 'Take Break',
          style: 'destructive',
          onPress: () => this.requestBreak()
        },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => this.endFocusSession()
        }
      ]
    );

    return true; // Prevent default back behavior
  }

  // Handle distraction detection
  private handleDistraction(type: string): void {
    if (!this.currentSession?.isActive) return;

    console.log(`🚨 Distraction detected: ${type}`);

    Alert.alert(
      '🚨 Focus Distraction Detected',
      `${type}\n\nStay focused on your goal! You can do this!`,
      [
        {
          text: 'Back to Focus',
          style: 'default'
        },
        {
          text: 'Take Break',
          style: 'destructive',
          onPress: () => this.requestBreak()
        }
      ]
    );
  }

  // Request a break
  private requestBreak(): void {
    if (!this.currentSession) return;

    if (this.currentSession.breaksUsed >= this.currentSession.allowedBreaks) {
      Alert.alert(
        '⏰ No Breaks Left',
        'You\'ve used all your allowed breaks for this session. Stay strong!',
        [{ text: 'Continue Focusing' }]
      );
      return;
    }

    Alert.alert(
      '☕ Break Time',
      'Take a 5-minute break. The timer will continue, but you can step away briefly.',
      [
        {
          text: 'Start Break',
          onPress: () => {
            this.currentSession!.breaksUsed++;
            this.startBreakTimer();
          }
        },
        { text: 'Keep Focusing', style: 'default' }
      ]
    );
  }

  // Start break timer
  private startBreakTimer(): void {
    setTimeout(() => {
      Alert.alert(
        '🔔 Break Over',
        'Time to get back to focused work!',
        [{ text: 'Resume Focus' }]
      );
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Simulate notification blocking
  private startNotificationBlocking(): void {
    this.notificationBlocker = setInterval(() => {
      if (this.currentSession?.isActive) {
        // In a real implementation, this would interface with system notifications
        console.log('🔕 Blocking notifications during focus mode');
      }
    }, 30000); // Check every 30 seconds
  }

  // Get current session
  getCurrentSession(): FocusSession | null {
    return this.currentSession;
  }

  // Check if focus mode is active
  isFocusModeActive(): boolean {
    return this.currentSession?.isActive || false;
  }

  // Get session progress
  getSessionProgress(): { elapsed: number; remaining: number; percentage: number } | null {
    if (!this.currentSession?.isActive) return null;

    const elapsed = Math.floor((Date.now() - this.currentSession.startTime.getTime()) / 1000 / 60);
    const remaining = Math.max(0, this.currentSession.duration - elapsed);
    const percentage = Math.min(100, (elapsed / this.currentSession.duration) * 100);

    return { elapsed, remaining, percentage };
  }

  // Restore session from storage (for app restart)
  async restoreSession(): Promise<void> {
    try {
      const sessionData = await AsyncStorage.getItem('activeFocusSession');
      if (sessionData) {
        const session: FocusSession = JSON.parse(sessionData);
        
        // Check if session is still valid
        const elapsed = (Date.now() - new Date(session.startTime).getTime()) / 1000 / 60;
        if (elapsed < session.duration && session.isActive) {
          this.currentSession = {
            ...session,
            startTime: new Date(session.startTime) // Convert back to Date object
          };
          
          // Resume monitoring
          this.startMonitoring();
          
          // Set remaining timer
          const remaining = (session.duration - elapsed) * 60 * 1000;
          this.sessionTimer = setTimeout(() => {
            this.completeFocusSession();
          }, remaining);
          
          console.log('🔄 Focus session restored');
        } else {
          // Session expired, clean up
          await AsyncStorage.removeItem('activeFocusSession');
        }
      }
    } catch (error) {
      console.error('Error restoring focus session:', error);
    }
  }

  // Get focus statistics
  async getFocusStats(): Promise<{
    totalSessions: number;
    totalFocusTime: number;
    averageSession: number;
    longestSession: number;
  }> {
    try {
      const stats = await AsyncStorage.getItem('focusStats');
      if (stats) {
        return JSON.parse(stats);
      }
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        averageSession: 0,
        longestSession: 0
      };
    } catch (error) {
      console.error('Error getting focus stats:', error);
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        averageSession: 0,
        longestSession: 0
      };
    }
  }

  // Update focus statistics
  async updateFocusStats(sessionDuration: number): Promise<void> {
    try {
      const currentStats = await this.getFocusStats();
      const newStats = {
        totalSessions: currentStats.totalSessions + 1,
        totalFocusTime: currentStats.totalFocusTime + sessionDuration,
        averageSession: Math.round((currentStats.totalFocusTime + sessionDuration) / (currentStats.totalSessions + 1)),
        longestSession: Math.max(currentStats.longestSession, sessionDuration)
      };
      
      await AsyncStorage.setItem('focusStats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error updating focus stats:', error);
    }
  }
}

export default new FocusModeService();
