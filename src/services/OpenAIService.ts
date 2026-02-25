import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface OpenAIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class OpenAIService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1/chat/completions';
  private model = 'gpt-3.5-turbo';
  private maxTokens = 500;
  
  // System prompt for productivity coaching
  private systemPrompt = `You are a professional productivity and wellness coach AI assistant for the "Mindful Screen" app. Your role is to:

1. Provide evidence-based productivity advice and techniques
2. Offer motivation and encouragement for focus and goal achievement
3. Suggest practical strategies for time management, habit building, and stress reduction
4. Be supportive, understanding, and professional in tone
5. Keep responses concise but helpful (under 200 words)
6. Focus on actionable advice that users can implement immediately
7. Reference scientific research when appropriate
8. Help with focus techniques, goal setting, habit formation, and mental wellness

Areas of expertise:
- Pomodoro Technique and focus methods
- Time blocking and productivity systems
- Habit formation and behavior change
- Stress management and mindfulness
- Goal setting (SMART goals, implementation intentions)
- Motivation and overcoming procrastination
- Work-life balance and digital wellness

Always be encouraging, practical, and focused on helping users improve their productivity and well-being.`;

  constructor() {
    this.loadApiKey();
  }

  // Load API key from storage
  private async loadApiKey(): Promise<void> {
    try {
      const storedKey = await AsyncStorage.getItem('openai_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
      }
    } catch (error) {
      console.error('Error loading OpenAI API key:', error);
    }
  }

  // Set API key
  async setApiKey(key: string): Promise<void> {
    try {
      this.apiKey = key;
      await AsyncStorage.setItem('openai_api_key', key);
    } catch (error) {
      console.error('Error saving OpenAI API key:', error);
      throw new Error('Failed to save API key');
    }
  }

  // Get API key status
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Async version to check storage
  async hasApiKeyAsync(): Promise<boolean> {
    if (this.apiKey) return true;
    
    try {
      const storedKey = await AsyncStorage.getItem('openai_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
        return true;
      }
    } catch (error) {
      console.error('Error checking API key:', error);
    }
    return false;
  }

  // Remove API key
  async removeApiKey(): Promise<void> {
    try {
      this.apiKey = null;
      await AsyncStorage.removeItem('openai_api_key');
    } catch (error) {
      console.error('Error removing OpenAI API key:', error);
    }
  }

  // Send message to OpenAI
  async sendMessage(
    userMessage: string, 
    conversationHistory: ChatMessage[] = []
  ): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please set your API key in settings.'
      };
    }

    try {
      // Prepare messages for API
      const messages: ChatMessage[] = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          max_tokens: this.maxTokens,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'Invalid API key. Please check your OpenAI API key in settings.'
          };
        } else if (response.status === 429) {
          return {
            success: false,
            error: 'Rate limit exceeded. Please try again in a moment.'
          };
        } else {
          return {
            success: false,
            error: `API Error: ${errorData.error?.message || 'Unknown error'}`
          };
        }
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return {
          success: true,
          message: data.choices[0].message.content.trim()
        };
      } else {
        return {
          success: false,
          error: 'Invalid response format from OpenAI API'
        };
      }
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      return {
        success: false,
        error: 'Network error. Please check your internet connection and try again.'
      };
    }
  }

  // Get fallback response when OpenAI is not available
  getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Motivation responses
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire')) {
      const responses = [
        "🌟 Remember, every expert was once a beginner! You're making progress with every step you take. What specific area would you like to improve?",
        "💪 You have the power to change your life one productive day at a time. What's one small action you can take right now?",
        "🚀 Success isn't about being perfect - it's about being consistent. What habit would you like to build?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Focus responses
    if (lowerMessage.includes('focus') || lowerMessage.includes('concentrat')) {
      const responses = [
        "🧠 Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break. It's scientifically proven to boost concentration!",
        "📱 Put your phone in airplane mode and close unnecessary browser tabs. Digital distractions are productivity killers!",
        "🎵 Use noise-canceling headphones or focus music. White noise can help maintain concentration.",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Goal setting responses
    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      const responses = [
        "🎯 Use SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. What goal would you like to make SMART?",
        "📊 Break big goals into smaller milestones. What's one small step you can take today toward your bigger goal?",
        "📝 Write your goals down and review them daily. This increases your chances of achieving them by 42%!",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! I'd love to help you with productivity strategies. Could you tell me more about what you're working on?",
      "I'm here to support your productivity journey! What specific challenge are you facing right now?",
      "Let's work together to find the best approach for you. What area would you like to focus on - time management, motivation, or habits?",
      "I understand you're looking for guidance. What's your main productivity goal right now?",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Test API connection
  async testConnection(): Promise<OpenAIResponse> {
    return this.sendMessage("Hello, this is a test message. Please respond with a brief greeting.");
  }

  // Get usage statistics
  async getUsageStats(): Promise<{
    totalMessages: number;
    lastUsed: Date | null;
  }> {
    try {
      const stats = await AsyncStorage.getItem('openai_usage_stats');
      if (stats) {
        const parsed = JSON.parse(stats);
        return {
          totalMessages: parsed.totalMessages || 0,
          lastUsed: parsed.lastUsed ? new Date(parsed.lastUsed) : null
        };
      }
      return { totalMessages: 0, lastUsed: null };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return { totalMessages: 0, lastUsed: null };
    }
  }

  // Update usage statistics
  async updateUsageStats(): Promise<void> {
    try {
      const currentStats = await this.getUsageStats();
      const newStats = {
        totalMessages: currentStats.totalMessages + 1,
        lastUsed: new Date().toISOString()
      };
      await AsyncStorage.setItem('openai_usage_stats', JSON.stringify(newStats));
    } catch (error) {
      console.error('Error updating usage stats:', error);
    }
  }
}

export default new OpenAIService();
