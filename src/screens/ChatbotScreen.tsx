import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar, Dimensions, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import OpenAIService, { ChatMessage as OpenAIChatMessage } from '../services/OpenAIService';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
}

export default function ChatbotScreen({ navigation }: any) {
  const { tokens, themeName } = useTheme();
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user?.name}! 👋 I'm your AI wellness companion. I'm here to help you improve your mental health, boost productivity, and achieve your goals. How are you feeling today?`,
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "How can I stay motivated?",
    "Help me focus better",
    "I feel overwhelmed",
    "Time management tips",
    "How to build good habits?",
    "Goal setting advice"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };


  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      // Ensure API key is loaded
      await OpenAIService.hasApiKeyAsync();
      
      // Convert messages to OpenAI format for context
      const conversationHistory: OpenAIChatMessage[] = messages.slice(-10).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
        timestamp: msg.timestamp
      }));

      // Try OpenAI first
      const openAIResponse = await OpenAIService.sendMessage(currentInput, conversationHistory);
      
      let responseText: string;
      
      if (openAIResponse.success && openAIResponse.message) {
        responseText = openAIResponse.message;
        await OpenAIService.updateUsageStats();
      } else {
        // Fallback to local responses
        responseText = OpenAIService.getFallbackResponse(currentInput);
        
        // Show API key setup hint if not configured
        if (openAIResponse.error?.includes('API key not configured')) {
          setTimeout(() => {
            Alert.alert(
              '🤖 Enhanced AI Available',
              'For more intelligent responses, you can configure your OpenAI API key in the profile settings. The chatbot will continue to work with built-in responses.',
              [
                { text: 'Maybe Later', style: 'cancel' },
                { text: 'Setup Now', onPress: () => navigation?.navigate('Profile') }
              ]
            );
          }, 2000);
        }
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response on error
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: OpenAIService.getFallbackResponse(currentInput),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (userInput: string): string => {
    const getAIResponse = (message: string): { text: string; category: string } => {
      const lowerMessage = message.toLowerCase();
      
      // Motivation responses
      if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('encourage')) {
        const responses = [
          "🌟 Remember, every expert was once a beginner! You're making progress with every step you take. Here's what I suggest: Start with just 5 minutes of focused work today. Small steps lead to big changes. What specific area would you like to improve?",
          "💪 You have the power to change your life one productive day at a time. Research shows that motivation follows action, not the other way around. Try this: Pick one tiny task you've been avoiding and do it right now. What's one small action you can take?",
          "🚀 Success isn't about being perfect - it's about being consistent. The Japanese concept of 'Kaizen' teaches us that 1% improvement daily leads to 37x better results in a year! What habit would you like to build consistently?",
          "✨ Your future self will thank you for the effort you put in today. Visualization is powerful - imagine yourself 6 months from now having achieved your goal. How does it feel? What goal are you working towards?",
          "🎯 Focus on progress, not perfection. Every small win releases dopamine, which motivates you for the next task. Celebrate completing even 10 minutes of work! What victory can you celebrate today?",
          "🔥 Motivation is like a muscle - the more you use it, the stronger it gets. Try the '2-minute rule': if something takes less than 2 minutes, do it immediately. This builds momentum for bigger tasks!",
          "⚡ Did you know that writing down your goals makes you 42% more likely to achieve them? Take 2 minutes right now to write down your top 3 goals. What's most important to you right now?"
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'motivation'
        };
      }
      
      // Focus and productivity
      if (lowerMessage.includes('focus') || lowerMessage.includes('concentrat') || lowerMessage.includes('distract')) {
        const responses = [
          "🧠 Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break. Studies show this can increase productivity by up to 40%! The key is to eliminate ALL distractions during those 25 minutes. What task would you like to focus on first?",
          "📱 Digital distractions are productivity killers! Try this: Put your phone in airplane mode, close unnecessary browser tabs, and use website blockers like Cold Turkey or Freedom. Your brain needs 23 minutes to refocus after each distraction!",
          "🎵 Use focus music or white noise. Binaural beats at 40Hz can enhance concentration, while nature sounds reduce cortisol (stress hormone) by 68%. Try apps like Brain.fm or Noisli. What type of environment helps you focus best?",
          "🌅 Work on your most important tasks during your 'biological prime time' - usually 2-4 hours after waking when cortisol and alertness peak. When do you feel most mentally sharp?",
          "📝 The 'Rule of 3': Write down your top 3 priorities for the day. Having clear goals increases focus by 42%. Our brains work best with limited, specific objectives. What are your top 3 tasks today?",
          "🧘 Try the '4-7-8' breathing technique before focusing: Inhale for 4, hold for 7, exhale for 8. This activates your parasympathetic nervous system and improves concentration within 2 minutes!"
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'focus'
        };
      }
      
      // Goal setting
      if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('achieve')) {
        const responses = [
          "🎯 Use SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. Example: Instead of 'exercise more,' try 'walk 30 minutes daily for 30 days.' This increases success rate by 90%! What goal would you like to make SMART?",
          "📊 Break big goals into micro-goals. Research shows that achieving small milestones releases dopamine, keeping you motivated. If your goal is to write a book, start with 'write 200 words daily.' What's one small step you can take today?",
          "📅 Set implementation intentions: 'I will [behavior] at [time] in [location].' This simple formula increases goal achievement by 300%! Example: 'I will meditate for 10 minutes at 7 AM in my bedroom.' How can you apply this?",
          "🏆 Celebrate small wins! Your brain releases dopamine when you acknowledge progress, which fuels motivation for bigger achievements. Even checking off a to-do item counts. What recent progress can you celebrate?",
          "📝 Write your goals down and review them daily. Harvard study found that people who write goals are 10x more likely to achieve them. Visualization combined with written goals is even more powerful!",
          "🔄 Use the 'Goal Gradient Effect': You work harder as you get closer to a goal. Break your big goal into 10 smaller checkpoints and track your progress visually. What's your biggest goal right now?"
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'goals'
        };
      }
      
      // Time management
      if (lowerMessage.includes('time') || lowerMessage.includes('schedul') || lowerMessage.includes('plan')) {
        const responses = [
          "⏰ Time blocking is incredibly effective: Assign specific time slots to activities. Cal Newport's research shows this can triple productivity! Block 90-minute chunks for deep work when possible. What's your biggest time challenge?",
          "📋 Use the Eisenhower Matrix: Important & Urgent (do first), Important & Not Urgent (schedule), Not Important & Urgent (delegate), Neither (eliminate). This helps 89% of people reduce stress and increase productivity!",
          "🌅 Plan your day the night before using the 'Tomorrow List' technique. Your subconscious works on solutions overnight, and you wake up with clarity and purpose! What would make tomorrow a great day?",
          "⚡ Energy management beats time management! Track when you feel most energetic (usually 2-4 hours after waking) and schedule your hardest tasks then. When do you feel most energetic?",
          "🚫 Learn to say no strategically. Warren Buffett says 'The difference between successful people and really successful people is that really successful people say no to almost everything.' What can you say no to this week?",
          "⏱️ Use the '2-minute rule': If something takes less than 2 minutes, do it immediately. This prevents small tasks from becoming overwhelming piles. What small tasks are you avoiding?"
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'time'
        };
      }
      
      // Stress and overwhelm
      if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || lowerMessage.includes('anxious')) {
        const responses = [
          "🧘 Try the '4-7-8' breathing technique right now: Inhale for 4 counts, hold for 7, exhale for 8. This activates your vagus nerve and reduces cortisol by 23% in just 2 minutes! How are you feeling after trying it?",
          "📝 Do a 'brain dump': Write everything on your mind for 10 minutes without stopping. This reduces mental load by 47% and helps you see what actually needs attention today. What's weighing on your mind?",
          "🚶 Take a 10-minute walk outside. Movement increases BDNF (brain-derived neurotrophic factor) by 200-300%, which improves mood and reduces stress hormones. Fresh air and sunlight boost this effect even more!",
          "🎯 Focus on just ONE task at a time. Multitasking increases cortisol and adrenaline, making you feel more stressed. Single-tasking can reduce stress by 40% and improve quality by 50%. What's the most important thing right now?",
          "💤 Prioritize sleep! Even one night of poor sleep increases cortisol by 37%. Try the '3-2-1 rule': No food 3 hours before bed, no liquids 2 hours before, no screens 1 hour before. How's your sleep quality?",
          "🌱 Practice the 'STOP' technique: Stop what you're doing, Take a breath, Observe your thoughts and feelings, Proceed with intention. This creates space between stimulus and response, reducing reactive stress."
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'wellness'
        };
      }
      
      // Habits
      if (lowerMessage.includes('habit') || lowerMessage.includes('routine') || lowerMessage.includes('consistent')) {
        const responses = [
          "🔄 Start with the '2-minute rule': Make new habits so easy they take less than 2 minutes. Want to read more? Start with 1 page. Want to exercise? Put on your workout clothes. Consistency beats intensity every time!",
          "📱 Use habit stacking: 'After I [existing habit], I will [new habit].' Example: 'After I brush my teeth, I will do 10 push-ups.' This uses existing neural pathways to build new ones 3x faster!",
          "📊 Track your habits visually with a simple calendar. Seeing your streak creates a dopamine reward loop. Research shows visual tracking increases habit adherence by 70%. What habit would you like to track?",
          "🎯 Focus on ONE habit at a time for 30 days. Your brain can only handle limited change. People who focus on one habit have 85% success rate vs. 35% for multiple habits. What's your priority habit?",
          "🏆 Celebrate immediately after completing your habit! Do a fist pump, say 'Yes!', or smile. This releases dopamine and reinforces the neural pathway. Small celebrations create big changes over time!",
          "🌱 Use the '1% better' principle: Tiny improvements compound. If you get 1% better each day, you'll be 37x better in a year! What's one small improvement you can make today?",
          "⏰ Link habits to specific times and locations. 'Implementation intentions' like 'I will meditate for 5 minutes at 7 AM in my bedroom' increase success rates by 300%. When and where will you do your new habit?"
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'habits'
        };
      }
      
      // Greetings
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        const responses = [
          "Hello! 👋 I'm excited to help you boost your productivity and well-being today. I'm trained in evidence-based techniques from psychology, neuroscience, and productivity research. What would you like to work on?",
          "Hey there! 🌟 Ready to tackle your goals with some science-backed strategies? I can help with motivation, focus, habits, time management, and stress reduction. What's on your mind?",
          "Hi! 💪 I'm here to support your productivity journey with proven techniques and personalized advice. Whether you need motivation, focus tips, or habit building - I've got you covered! What challenge can I help you with?",
          "Hello! ✨ Great to see you taking charge of your growth! I combine the latest research in behavioral psychology with practical productivity methods. Let's make today amazing - what area would you like to improve?"
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          category: 'greeting'
        };
      }
      
      // Default responses
      const responses = [
        "That's a great question! Remember, every small step towards your goals matters. What specific area would you like to focus on today?",
        "I understand how you're feeling. It's completely normal to have ups and downs. Let's work together to find strategies that help you feel better.",
        "You're doing amazing by taking care of your mental health! Have you tried the focus timer feature? It can really help with productivity.",
        "Self-reflection is so important. What's one thing you're grateful for today? Gratitude can shift our perspective in powerful ways.",
        "That sounds challenging, but I believe in your ability to overcome it. What support systems do you have in place?",
        "Progress isn't always linear, and that's okay! What matters is that you keep moving forward. How can I help you today?",
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        category: 'default'
      };
    };
    return getAIResponse(userInput).text;
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <View style={{
      alignSelf: message.isUser ? 'flex-end' : 'flex-start',
      backgroundColor: message.isUser ? tokens.primary : tokens.card,
      padding: 12,
      borderRadius: 16,
      marginVertical: 4,
      maxWidth: '80%',
      ...(themeName === 'dark' && !message.isUser && {
        shadowColor: tokens.neon,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
      }),
    }}>
      <Text style={{
        color: message.isUser ? '#ffffff' : tokens.text,
        fontSize: 16,
        lineHeight: 22,
      }}>
        {message.text}
      </Text>
      <Text style={{
        color: message.isUser ? 'rgba(255,255,255,0.7)' : tokens.textSecondary,
        fontSize: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
      }}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: tokens.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: 4,
        }}>
          🤖 AI Productivity Coach
        </Text>
        <Text style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.8)',
        }}>
          Your personal motivation & productivity assistant
        </Text>
      </View>

      {/* Quick Prompts */}
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: tokens.surface,
      }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: tokens.card,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: tokens.border,
                }}
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Text style={{
                  color: tokens.text,
                  fontSize: 12,
                }}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              marginBottom: 12,
            }}
          >
            <View style={{
              backgroundColor: message.isUser ? tokens.primary : tokens.card,
              padding: 16,
              borderRadius: 18,
              ...(themeName === 'dark' && {
                shadowColor: message.isUser ? tokens.primary : tokens.surface,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }),
            }}>
              <Text style={{ 
                color: message.isUser ? '#ffffff' : tokens.text,
                fontSize: 16,
                lineHeight: 22,
              }}>
                {message.text}
              </Text>
              
              <Text style={{
                color: message.isUser ? 'rgba(255,255,255,0.7)' : tokens.textSecondary,
                fontSize: 11,
                marginTop: 6,
                textAlign: 'right',
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
        
        {isTyping && (
          <View style={{
            alignSelf: 'flex-start',
            maxWidth: '85%',
            marginBottom: 12,
          }}>
            <View style={{
              backgroundColor: tokens.card,
              padding: 16,
              borderRadius: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text style={{ color: tokens.textSecondary, fontSize: 16 }}>
                AI is thinking
              </Text>
              <View style={{
                flexDirection: 'row',
                marginLeft: 8,
              }}>
                {[0, 1, 2].map((dot) => (
                  <View
                    key={dot}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: tokens.primary,
                      marginHorizontal: 1,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={{
          backgroundColor: tokens.surface,
          paddingHorizontal: 16,
          paddingVertical: 16,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          borderTopWidth: 1,
          borderTopColor: tokens.border,
          minHeight: 80,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 12,
          }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: tokens.card,
                borderRadius: 24,
                paddingHorizontal: 20,
                paddingVertical: 12,
                fontSize: 16,
                color: tokens.text,
                maxHeight: 120,
                minHeight: 44,
                textAlignVertical: 'center',
                borderWidth: 1,
                borderColor: tokens.border,
              }}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about productivity..."
              placeholderTextColor={tokens.muted}
              multiline
              numberOfLines={1}
            />
            
            <TouchableOpacity
              style={{
                backgroundColor: inputText.trim() ? tokens.primary : tokens.muted,
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                ...(themeName === 'dark' && inputText.trim() && {
                  shadowColor: tokens.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }),
              }}
              onPress={sendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
                {isTyping ? '⏳' : '➤'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
}
