export declare class AIservice {
    private static openai;
    static initialize(): void;
    static analyzeTask(title: string, description?: string): Promise<{
        category: string;
        priority: 'low' | 'medium' | 'high';
        suggestedDueDate?: string;
    }>;
    static generateInsights(tasks: any[]): Promise<string>;
    static suggestTaskImprovements(task: any): Promise<string>;
    static generateSmartSuggestions(tasks: any[]): Promise<{
        suggestedCategories: string[];
        timeManagementTips: string[];
        commonThemes: string[];
    }>;
    static isAIAvailable(): boolean;
}
//# sourceMappingURL=aiService.d.ts.map