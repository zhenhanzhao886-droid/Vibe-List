
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type ThoughtCategory = 'Strategy' | 'Voice Note' | 'Philosophy' | 'Insight';

export interface Thought {
  id: string;
  category: ThoughtCategory;
  text: string;
  timestamp: string;
  transcript?: string;
  insight?: AgentInsight;
}

export interface AgentInsight {
  coreEssence: string;
  logicalFramework: string[];
  thinkingPrompts: string[];
}

export interface DayData {
  tasks: Task[];
  thoughts: Thought[];
}

export type AppDataMap = Record<string, DayData>;

export interface DayStats {
  date: string;
  inspirations: number;
  tasks: number;
  aiInsight: string;
  themes: string[];
}
