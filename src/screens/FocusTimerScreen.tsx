import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Dimensions,
  Animated,
  StatusBar,
  Switch
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import FocusModeService from '../services/FocusModeService';

const { width, height } = Dimensions.get('window');

export default function FocusTimerScreen() {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedTask, setSelectedTask] = useState('');
  const [focusGoal, setFocusGoal] = useState('Complete daily tasks');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(8); // 8 sessions per day
  const [focusModeEnabled, setFocusModeEnabled] = useState(true);
  const [blockNotifications, setBlockNotifications] = useState(true);
  const [blockApps, setBlockApps] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({
    totalSessions: 23,
    totalMinutes: 575,
    streak: 5,
    bestDay: 'Tuesday'
  });
  
  const intervalRef = useRef<any>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    // Animate progress circle
    const progress = 1 - (timeLeft / (duration * 60));
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, duration]);

  // Sync timeLeft when duration changes and timer is not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setIsPaused(false);
    
    // End focus mode restrictions
    if (focusModeEnabled && sessionType === 'focus') {
      await FocusModeService.endFocusSession();
    }
    
    if (sessionType === 'focus') {
      setCompletedSessions(prev => prev + 1);
      Alert.alert(
        '🎉 Focus Session Complete!',
        'Great job! Time for a break.',
        [
          { text: 'Start Break', onPress: startBreak },
          { text: 'New Session', onPress: resetTimer }
        ]
      );
    } else {
      Alert.alert(
        '⏰ Break Time Over!',
        'Ready for another focus session?',
        [
          { text: 'Start Focus', onPress: startFocus },
          { text: 'Finish', onPress: resetTimer }
        ]
      );
    }
  };

  const startTimer = async () => {
    setIsActive(true);
    setIsPaused(false);
    
    // Start focus mode restrictions if enabled
    if (focusModeEnabled && sessionType === 'focus') {
      try {
        const blockedApps = blockApps ? [
          'com.facebook.katana',
          'com.instagram.android', 
          'com.twitter.android',
          'com.whatsapp',
          'com.snapchat.android',
          'com.tiktok'
        ] : [];
        
        await FocusModeService.startFocusSession(duration, blockedApps);
        
        Alert.alert(
          '🔒 Focus Mode Activated',
          `Distractions blocked for ${duration} minutes!\n\n` +
          `• App switching restricted\n` +
          `• Back button blocked\n` +
          `${blockNotifications ? '• Notifications silenced\n' : ''}` +
          `${blockApps ? '• Social apps blocked\n' : ''}` +
          `\nStay focused! You've got this! 💪`,
          [{ text: 'Start Focusing', style: 'default' }]
        );
      } catch (error) {
        console.error('Failed to start focus mode:', error);
        Alert.alert('Focus Mode', 'Could not activate all restrictions, but timer will still work!');
      }
    }
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = async () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setSessionType('focus');
    
    // End focus mode restrictions
    if (focusModeEnabled) {
      await FocusModeService.endFocusSession();
    }
  };

  const startBreak = async () => {
    // End focus mode first
    if (focusModeEnabled) {
      await FocusModeService.endFocusSession();
    }
    
    setSessionType('break');
    setDuration(5); // 5 minute break
    setTimeLeft(5 * 60);
    setIsActive(true);
    setIsPaused(false);
  };

  const startFocus = async () => {
    setSessionType('focus');
    setDuration(25); // 25 minute focus
    setTimeLeft(25 * 60);
    setIsActive(true);
    setIsPaused(false);
    
    // Start focus mode restrictions if enabled
    if (focusModeEnabled) {
      try {
        const blockedApps = blockApps ? [
          'com.facebook.katana',
          'com.instagram.android', 
          'com.twitter.android',
          'com.whatsapp',
          'com.snapchat.android',
          'com.tiktok'
        ] : [];
        
        await FocusModeService.startFocusSession(25, blockedApps);
      } catch (error) {
        console.error('Failed to start focus mode:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const presetDurations = [15, 25, 45, 60]; // minutes

  const taskOptions = [
    'Deep Work Session',
    'Study & Learning',
    'Creative Project',
    'Email & Communication',
    'Planning & Organization',
    'Reading & Research',
    'Writing & Documentation',
    'Problem Solving'
  ];

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
          Focus Session
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Task Selection */}
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
            🎯 What are you focusing on?
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {taskOptions.map((task) => (
                <TouchableOpacity
                  key={task}
                  style={{
                    backgroundColor: selectedTask === task ? tokens.primary : tokens.surface,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedTask === task ? tokens.primary : tokens.border,
                  }}
                  onPress={() => setSelectedTask(task)}
                >
                  <Text style={{
                    color: selectedTask === task ? '#ffffff' : tokens.text,
                    fontSize: 14,
                    fontWeight: '500',
                  }}>
                    {task}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Main Timer Card */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 24,
          padding: 32,
          marginBottom: 24,
          alignItems: 'center',
          ...(themeName === 'dark' && {
            shadowColor: sessionType === 'focus' ? tokens.primary : tokens.success,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }),
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 8,
          }}>
            {sessionType === 'focus' ? '🧠 Focus Mode' : '☕ Break Time'}
          </Text>
          
          {selectedTask && (
            <Text style={{
              fontSize: 14,
              color: tokens.textSecondary,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              {selectedTask}
            </Text>
          )}

          {/* Circular Timer */}
          <View style={{
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: tokens.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            borderWidth: 8,
            borderColor: sessionType === 'focus' ? tokens.primary : tokens.success,
            ...(themeName === 'dark' && {
              shadowColor: sessionType === 'focus' ? tokens.primary : tokens.success,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }),
          }}>
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: tokens.text,
              marginBottom: 8,
            }}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={{
              fontSize: 16,
              color: tokens.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {sessionType === 'focus' ? 'FOCUS' : 'BREAK'}
            </Text>
            
            {/* Progress indicator */}
            <View style={{
              position: 'absolute',
              bottom: 20,
              width: 60,
              height: 4,
              backgroundColor: tokens.border,
              borderRadius: 2,
            }}>
              <View style={{
                width: `${((duration * 60 - timeLeft) / (duration * 60)) * 100}%`,
                height: '100%',
                backgroundColor: sessionType === 'focus' ? tokens.primary : tokens.success,
                borderRadius: 2,
              }} />
            </View>
          </View>

          {/* Control Buttons */}
          <View style={{
            flexDirection: 'row',
            gap: 16,
            marginBottom: 24,
            width: '100%',
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: isActive ? tokens.warning : tokens.primary,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 16,
                flex: 1,
                alignItems: 'center',
                minHeight: 56,
                justifyContent: 'center',
                ...(themeName === 'dark' && {
                  shadowColor: isActive ? tokens.warning : tokens.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }),
              }}
              onPress={isActive ? pauseTimer : startTimer}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                {isActive ? (isPaused ? '▶️ Resume' : '⏸️ Pause') : '▶️ Start'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: tokens.muted,
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 16,
                flex: 1,
                alignItems: 'center',
                minHeight: 56,
                justifyContent: 'center',
                ...(themeName === 'dark' && {
                  shadowColor: tokens.muted,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }),
              }}
              onPress={resetTimer}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                🔄 Reset
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration Presets */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          ...(themeName === 'dark' && {
            shadowColor: tokens.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }),
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 16,
            textAlign: 'center',
          }}>
            ⏱️ Quick Durations
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {presetDurations.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={{
                  backgroundColor: duration === preset ? tokens.primary : tokens.surface,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: duration === preset ? tokens.primary : tokens.border,
                  flex: 1,
                  minWidth: 70,
                  alignItems: 'center',
                  opacity: isActive ? 0.6 : 1,
                  ...(themeName === 'dark' && duration === preset && {
                    shadowColor: tokens.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    elevation: 4,
                  }),
                }}
                onPress={() => setDuration(preset)}
                disabled={isActive}
              >
                <Text style={{
                  color: duration === preset ? '#ffffff' : tokens.text,
                  fontSize: 16,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                  {preset}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Session Stats */}
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
            📊 Today's Progress
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.primary,
                marginBottom: 4,
              }}>
                {completedSessions}
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Sessions
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.success,
                marginBottom: 4,
              }}>
                {Math.round((completedSessions * duration) / 60 * 10) / 10}h
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Focus Time
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.accent,
                marginBottom: 4,
              }}>
                {Math.round((completedSessions / dailyGoal) * 100)}%
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Daily Goal
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={{
            width: '100%',
            height: 8,
            backgroundColor: tokens.surface,
            borderRadius: 4,
            marginBottom: 8,
          }}>
            <View style={{
              width: `${Math.min((completedSessions / dailyGoal) * 100, 100)}%`,
              height: '100%',
              backgroundColor: tokens.primary,
              borderRadius: 4,
            }} />
          </View>
          
          <Text style={{
            fontSize: 12,
            color: tokens.textSecondary,
            textAlign: 'center',
          }}>
            {dailyGoal - completedSessions > 0 
              ? `${dailyGoal - completedSessions} more sessions to reach daily goal`
              : '🎉 Daily goal achieved!'
            }
          </Text>
        </View>

        {/* Weekly Overview */}
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
            📈 Weekly Overview
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.primary,
                marginBottom: 4,
              }}>
                {weeklyStats.totalSessions}
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Total Sessions
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.success,
                marginBottom: 4,
              }}>
                {Math.round(weeklyStats.totalMinutes / 60)}h
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Total Hours
              </Text>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: tokens.accent,
                marginBottom: 4,
              }}>
                {weeklyStats.streak}
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
                textAlign: 'center',
              }}>
                Day Streak
              </Text>
            </View>
          </View>
          
          <View style={{
            backgroundColor: tokens.surface,
            padding: 12,
            borderRadius: 12,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 14,
              color: tokens.textSecondary,
            }}>
              🏆 Best day this week: {weeklyStats.bestDay}
            </Text>
          </View>
        </View>

        {/* Quick Settings */}
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
            ⚙️ Quick Settings
          </Text>
          
          <View style={{ gap: 12 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                color: tokens.text,
              }}>
                🔊 Sound Notifications
              </Text>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: soundEnabled ? tokens.primary : tokens.muted,
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
                onPress={() => setSoundEnabled(!soundEnabled)}
              >
                <View style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: '#ffffff',
                  alignSelf: soundEnabled ? 'flex-end' : 'flex-start',
                }} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                color: tokens.text,
              }}>
                ⏯️ Auto-start Breaks
              </Text>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: autoStartBreaks ? tokens.primary : tokens.muted,
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
                onPress={() => setAutoStartBreaks(!autoStartBreaks)}
              >
                <View style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: '#ffffff',
                  alignSelf: autoStartBreaks ? 'flex-end' : 'flex-start',
                }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Focus Mode Settings */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          borderLeftWidth: 4,
          borderLeftColor: tokens.primary,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 16,
          }}>
            🔒 Focus Mode Settings
          </Text>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: tokens.text,
                marginBottom: 4,
              }}>
                Enable Focus Mode
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Block distractions during focus sessions
              </Text>
            </View>
            <Switch
              value={focusModeEnabled}
              onValueChange={setFocusModeEnabled}
              trackColor={{ false: tokens.muted, true: tokens.primary }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: tokens.text,
                marginBottom: 4,
              }}>
                Block Notifications
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Silence notifications during focus
              </Text>
            </View>
            <Switch
              value={blockNotifications}
              onValueChange={setBlockNotifications}
              trackColor={{ false: tokens.muted, true: tokens.primary }}
              thumbColor="#ffffff"
              disabled={!focusModeEnabled}
            />
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: tokens.text,
                marginBottom: 4,
              }}>
                Block Social Apps
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Prevent access to distracting apps
              </Text>
            </View>
            <Switch
              value={blockApps}
              onValueChange={setBlockApps}
              trackColor={{ false: tokens.muted, true: tokens.primary }}
              thumbColor="#ffffff"
              disabled={!focusModeEnabled}
            />
          </View>
        </View>

        {/* Focus Tips */}
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
            💡 Focus Tips
          </Text>
          <Text style={{
            fontSize: 14,
            color: tokens.textSecondary,
            lineHeight: 20,
          }}>
            • Put your phone in airplane mode{'\n'}
            • Close unnecessary browser tabs{'\n'}
            • Use noise-canceling headphones{'\n'}
            • Keep water nearby to stay hydrated{'\n'}
            • Take deep breaths before starting
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
