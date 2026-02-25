import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface AppUsageData {
  appName: string;
  packageName: string;
  timeSpent: number; // in minutes
  openCount: number;
  category: 'productive' | 'social' | 'entertainment' | 'utility';
  icon: string;
}

interface DailyData {
  date: string;
  totalScreenTime: number;
  focusTime: number;
  distractionTime: number;
  pickupCount: number;
  apps: AppUsageData[];
}

export default function ScreenTimeScreen() {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [screenTimeData, setScreenTimeData] = useState<DailyData[]>([]);

  // Demo data generation
  useEffect(() => {
    generateDemoData();
  }, []);

  const generateDemoData = () => {
    const demoApps: AppUsageData[] = [
      { appName: 'Instagram', packageName: 'com.instagram.android', timeSpent: 45, openCount: 12, category: 'social', icon: '📷' },
      { appName: 'YouTube', packageName: 'com.google.android.youtube', timeSpent: 78, openCount: 8, category: 'entertainment', icon: '📺' },
      { appName: 'WhatsApp', packageName: 'com.whatsapp', timeSpent: 32, openCount: 25, category: 'social', icon: '💬' },
      { appName: 'Chrome', packageName: 'com.android.chrome', timeSpent: 65, openCount: 15, category: 'utility', icon: '🌐' },
      { appName: 'VS Code', packageName: 'com.microsoft.vscode', timeSpent: 120, openCount: 6, category: 'productive', icon: '💻' },
      { appName: 'Notion', packageName: 'notion.id', timeSpent: 35, openCount: 4, category: 'productive', icon: '📝' },
      { appName: 'TikTok', packageName: 'com.zhiliaoapp.musically', timeSpent: 52, openCount: 18, category: 'entertainment', icon: '🎵' },
      { appName: 'Slack', packageName: 'com.slack', timeSpent: 28, openCount: 9, category: 'productive', icon: '💼' },
    ];

    const today: DailyData = {
      date: new Date().toISOString().split('T')[0],
      totalScreenTime: demoApps.reduce((sum, app) => sum + app.timeSpent, 0),
      focusTime: demoApps.filter(app => app.category === 'productive').reduce((sum, app) => sum + app.timeSpent, 0),
      distractionTime: demoApps.filter(app => app.category === 'social' || app.category === 'entertainment').reduce((sum, app) => sum + app.timeSpent, 0),
      pickupCount: 89,
      apps: demoApps
    };

    setScreenTimeData([today]);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProductivityScore = () => {
    const data = screenTimeData[0];
    if (!data) return 0;
    
    const productiveTime = data.focusTime;
    const totalTime = data.totalScreenTime;
    return Math.round((productiveTime / totalTime) * 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productive': return tokens.success;
      case 'social': return tokens.warning;
      case 'entertainment': return tokens.error;
      case 'utility': return tokens.info;
      default: return tokens.muted;
    }
  };

  const todayData = screenTimeData[0];

  return (
    <View style={{ flex: 1, backgroundColor: tokens.background }}>
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
          Analytics
        </Text>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Focus Categories Card */}
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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: tokens.text,
            }}>
              Focus Categories
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: tokens.surface,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: tokens.border,
              }}
            >
              <Text style={{
                fontSize: 14,
                color: tokens.text,
                fontWeight: '500',
              }}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>

          {/* Donut Chart Placeholder */}
          <View style={{
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <View style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              borderWidth: 20,
              borderColor: tokens.primary,
              backgroundColor: tokens.surface,
              justifyContent: 'center',
              alignItems: 'center',
              ...(themeName === 'dark' && {
                shadowColor: tokens.neon,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                elevation: 12,
              }),
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: tokens.text,
              }}>
                8.5h
              </Text>
              <Text style={{
                fontSize: 12,
                color: tokens.textSecondary,
              }}>
                Total
              </Text>
            </View>
          </View>

          {/* Legend */}
          <View style={{ gap: 12 }}>
            {[
              { label: 'Deep Work', percentage: '45%', color: tokens.primary },
              { label: 'Learning', percentage: '25%', color: tokens.secondary },
              { label: 'Reading', percentage: '15%', color: tokens.info },
              { label: 'Exercise', percentage: '10%', color: tokens.accent },
              { label: 'Meditation', percentage: '5%', color: tokens.success },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: item.color,
                    marginRight: 12,
                  }} />
                  <Text style={{
                    fontSize: 14,
                    color: tokens.text,
                    flex: 1,
                  }}>
                    {item.label}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: tokens.text,
                }}>
                  {item.percentage}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Insights Card */}
        <View style={{
          backgroundColor: tokens.card,
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: tokens.text,
            marginBottom: 16,
          }}>
            Weekly Insights
          </Text>
          
          <View style={{
            backgroundColor: tokens.surface,
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 14,
              color: tokens.textSecondary,
              marginBottom: 8,
            }}>
              Average Daily Focus
            </Text>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: tokens.success,
            }}>
              3.2 hours
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
