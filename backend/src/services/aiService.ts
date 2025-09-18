import OpenAI from 'openai';

/**
 * @class AIservice
 * @description Service for AI-powered task analysis and suggestions
 */
export class AIservice {
  private static openai: OpenAI;

  /**
   * @method initialize
   * @description Initialize OpenAI client
   */
  static initialize(): void {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * @method analyzeTask
   * @description Analyze task content to suggest category and priority
   */
  static async analyzeTask(title: string, description: string = ''): Promise<{
    category: string;
    priority: 'low' | 'medium' | 'high';
    suggestedDueDate?: string;
  }> {
    try {
      if (!this.openai) {
        this.initialize();
      }

      const prompt = `
        Analyze this task and respond with ONLY a JSON object containing "category", "priority", and optionally "suggestedDueDate":
        Title: ${title}
        Description: ${description}
        
        Categories: work, personal, shopping, health, learning, finance, home, social, travel, uncategorized
        Priority: low, medium, high (based on urgency and importance)
        SuggestedDueDate: if the task seems time-sensitive, suggest a due date in YYYY-MM-DD format
        
        Example response: {"category": "work", "priority": "high", "suggestedDueDate": "2023-12-15"}
        
        Respond with valid JSON only.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a task analysis assistant. Always respond with valid JSON only. Do not include any additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.3
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from AI service');
      }

      // Clean the response (remove markdown code blocks if present)
      const cleanResult = result.replace(/```json\n?|\n?```/g, '').trim();
      
      return JSON.parse(cleanResult);
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to default values
      return {
        category: 'uncategorized',
        priority: 'medium'
      };
    }
  }

  /**
   * @method generateInsights
   * @description Generate productivity insights based on user's tasks
   */
  static async generateInsights(tasks: any[]): Promise<string> {
    try {
      if (!this.openai) {
        this.initialize();
      }

      if (tasks.length === 0) {
        return 'No tasks available for analysis.';
      }

      const prompt = `
        Analyze these tasks and provide brief, helpful productivity insights (max 3 sentences):
        ${JSON.stringify(tasks.slice(0, 10), null, 2)}
        
        Focus on:
        1. Patterns in task categories or priorities
        2. Suggestions for time management or organization
        3. Noticing if many tasks are overdue or due soon
        4. General productivity tips
        
        Keep the response concise and actionable.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a productivity coach. Provide concise, helpful insights. Respond with plain text only, no markdown."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content?.trim() || 'No insights available at this time.';
    } catch (error) {
      console.error('Insights generation error:', error);
      return 'Unable to generate insights at this time.';
    }
  }

  /**
   * @method suggestTaskImprovements
   * @description Suggest improvements for a specific task
   */
  static async suggestTaskImprovements(task: any): Promise<string> {
    try {
      if (!this.openai) {
        this.initialize();
      }

      const prompt = `
        Review this task and suggest improvements:
        ${JSON.stringify(task, null, 2)}
        
        Consider:
        1. Could the title be more specific or actionable?
        2. Is the description clear and helpful?
        3. Is the priority appropriate?
        4. Is the category the best fit?
        5. Any other suggestions for improvement?
        
        Provide concise, constructive feedback.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a productivity expert. Provide constructive feedback on tasks. Be specific and helpful."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 0.5
      });

      return response.choices[0]?.message?.content?.trim() || 'No suggestions available.';
    } catch (error) {
      console.error('Task improvement suggestions error:', error);
      return 'Unable to generate suggestions at this time.';
    }
  }

  /**
   * @method generateSmartSuggestions
   * @description Generate smart suggestions based on user's task history
   */
  static async generateSmartSuggestions(tasks: any[]): Promise<{
    suggestedCategories: string[];
    timeManagementTips: string[];
    commonThemes: string[];
  }> {
    try {
      if (!this.openai) {
        this.initialize();
      }

      if (tasks.length === 0) {
        return {
          suggestedCategories: [],
          timeManagementTips: ['Start by adding some tasks to get personalized suggestions.'],
          commonThemes: []
        };
      }

      const prompt = `
        Analyze these tasks and respond with ONLY a JSON object containing:
        - suggestedCategories: array of suggested task categories based on patterns
        - timeManagementTips: array of 2-3 time management tips
        - commonThemes: array of common themes or patterns noticed
        
        Tasks: ${JSON.stringify(tasks.slice(0, 15), null, 2)}
        
        Respond with valid JSON only, no additional text.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a productivity analyst. Analyze tasks and provide structured suggestions. Respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.4
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from AI service');
      }

      const cleanResult = result.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResult);
    } catch (error) {
      console.error('Smart suggestions error:', error);
      return {
        suggestedCategories: [],
        timeManagementTips: ['Focus on completing high-priority tasks first.'],
        commonThemes: []
      };
    }
  }

  /**
   * @method isAIAvailable
   * @description Check if AI services are available
   */
  static isAIAvailable(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }
}

// Initialize the service if API key is available
if (process.env.OPENAI_API_KEY) {
  AIservice.initialize();
}