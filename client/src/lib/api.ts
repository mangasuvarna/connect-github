import { apiRequest } from "./queryClient";
import type { 
  JournalEntry, 
  InsertJournalEntry, 
  MoodData, 
  InsertMoodData, 
  UserProgress, 
  MusicRecommendation 
} from "@shared/schema";

// Journal API
export async function getJournalEntries(): Promise<JournalEntry[]> {
  const response = await apiRequest("GET", "/api/journal-entries");
  return response.json();
}

export async function createJournalEntry(entry: InsertJournalEntry) {
  const response = await apiRequest("POST", "/api/journal-entries", entry);
  return response.json();
}

// Mood API
export async function getMoodData(startDate?: string, endDate?: string): Promise<MoodData[]> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const response = await apiRequest("GET", `/api/mood-data?${params}`);
  return response.json();
}

export async function createMoodData(data: InsertMoodData): Promise<MoodData> {
  const response = await apiRequest("POST", "/api/mood-data", data);
  return response.json();
}

// User Progress API
export async function getUserProgress(): Promise<UserProgress> {
  const response = await apiRequest("GET", "/api/user/progress");
  return response.json();
}

export async function getUserStats() {
  const response = await apiRequest("GET", "/api/user/stats");
  return response.json();
}

// Music API
export async function getMusicRecommendations(mood?: string): Promise<MusicRecommendation[]> {
  const params = mood ? `?mood=${mood}` : "";
  const response = await apiRequest("GET", `/api/music/recommendations${params}`);
  return response.json();
}

export async function getAIMusicSuggestions(mood: string, preferences?: string) {
  const response = await apiRequest("POST", "/api/music/ai-suggestions", { mood, preferences });
  return response.json();
}

// AI Services API
export async function generateJokes(mood: string, count: number = 3) {
  const response = await apiRequest("POST", "/api/jokes", { mood, count });
  return response.json();
}

export async function generateJournalPrompts(mood: string, recentThemes?: string[]) {
  const response = await apiRequest("POST", "/api/journal/prompts", { mood, recentThemes });
  return response.json();
}

export async function getAnalyticsInsights() {
  const response = await apiRequest("GET", "/api/analytics/insights");
  return response.json();
}
