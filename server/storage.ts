import { type JournalEntry, type InsertJournalEntry, type MoodData, type InsertMoodData, type UserProgress, type InsertUserProgress, type MusicRecommendation, type Mood, type Badge } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Journal entries
  getJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntryById(id: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry>;
  deleteJournalEntry(id: string): Promise<void>;

  // Mood data
  getMoodData(): Promise<MoodData[]>;
  getMoodDataByDateRange(startDate: string, endDate: string): Promise<MoodData[]>;
  createMoodData(data: InsertMoodData): Promise<MoodData>;

  // User progress
  getUserProgress(): Promise<UserProgress | undefined>;
  updateUserProgress(updates: Partial<UserProgress>): Promise<UserProgress>;
  addBadge(badge: Badge): Promise<UserProgress>;

  // Music recommendations
  getMusicRecommendations(mood: Mood): Promise<MusicRecommendation[]>;
  getAllMusicRecommendations(): Promise<MusicRecommendation[]>;
}

export class MemStorage implements IStorage {
  private journalEntries: Map<string, JournalEntry> = new Map();
  private moodData: Map<string, MoodData> = new Map();
  private userProgress: UserProgress | undefined;
  private musicRecommendations: Map<string, MusicRecommendation> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize user progress
    this.userProgress = {
      id: randomUUID(),
      streak: 0,
      totalEntries: 0,
      badges: [],
      auraLevel: 1,
      lastEntryDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Initialize some music recommendations
    const defaultMusic: Omit<MusicRecommendation, 'id' | 'createdAt'>[] = [
      { mood: "happy", title: "Good 4 U", artist: "Olivia Rodrigo", genre: "Pop", spotifyUrl: "https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG", youtubeUrl: "https://www.youtube.com/watch?v=gNi_6U5Pm_o" },
      { mood: "happy", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk", spotifyUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS", youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0" },
      { mood: "calm", title: "Weightless", artist: "Marconi Union", genre: "Ambient", spotifyUrl: null, youtubeUrl: "https://www.youtube.com/watch?v=UfcAVejslrU" },
      { mood: "calm", title: "River", artist: "Joni Mitchell", genre: "Folk", spotifyUrl: "https://open.spotify.com/track/3mAJkMqS2z3UCOoYJm7btc", youtubeUrl: "https://www.youtube.com/watch?v=3NH-ctddY9o" },
      { mood: "sad", title: "Someone Like You", artist: "Adele", genre: "Ballad", spotifyUrl: "https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV", youtubeUrl: "https://www.youtube.com/watch?v=hLQl3WQQoQ0" },
      { mood: "sad", title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "Folk", spotifyUrl: "https://open.spotify.com/track/5AEDGEhgESYFNdKpn2TJJx", youtubeUrl: "https://www.youtube.com/watch?v=4fWyzwo1xg0" },
      { mood: "excited", title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop", spotifyUrl: "https://open.spotify.com/track/6RUKPb4LETWmmr3iAEQktW", youtubeUrl: "https://www.youtube.com/watch?v=ru0K8uYEZWw" },
      { mood: "excited", title: "High Hopes", artist: "Panic! At The Disco", genre: "Pop Rock", spotifyUrl: "https://open.spotify.com/track/1rqqCSm0Qe4I9rUvWncaom", youtubeUrl: "https://www.youtube.com/watch?v=IPXIgEAGe4U" },
      { mood: "anxious", title: "Breathe", artist: "Télépopmusik", genre: "Electronic", spotifyUrl: "https://open.spotify.com/track/4zS6iFTFmYvI6qGJc0FtUr", youtubeUrl: "https://www.youtube.com/watch?v=vyut3GyQtn0" },
      { mood: "anxious", title: "Mad World", artist: "Gary Jules", genre: "Alternative", spotifyUrl: "https://open.spotify.com/track/3JOVTQ5h8HGFnDdp4VT3MP", youtubeUrl: "https://www.youtube.com/watch?v=4N3N1MlvVc4" },
    ];

    defaultMusic.forEach(music => {
      const id = randomUUID();
      this.musicRecommendations.set(id, {
        id,
        ...music,
        createdAt: new Date(),
      });
    });
  }

  // Journal entries
  async getJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getJournalEntryById(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const newEntry: JournalEntry = {
      id,
      ...entry,
      sentimentScore: null,
      confidence: null,
      aiInsights: null,
      createdAt: new Date(),
    };
    this.journalEntries.set(id, newEntry);
    
    // Update user progress
    if (this.userProgress) {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = this.userProgress.lastEntryDate !== today;
      
      this.userProgress.totalEntries += 1;
      
      if (isNewDay) {
        if (this.userProgress.lastEntryDate && this.isConsecutiveDay(this.userProgress.lastEntryDate, today)) {
          this.userProgress.streak += 1;
        } else {
          this.userProgress.streak = 1;
        }
        this.userProgress.lastEntryDate = today;
      }
      
      this.userProgress.updatedAt = new Date();
      
      // Check for badge achievements
      this.checkAndAwardBadges();
    }
    
    return newEntry;
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const entry = this.journalEntries.get(id);
    if (!entry) {
      throw new Error("Journal entry not found");
    }
    
    const updatedEntry = { ...entry, ...updates };
    this.journalEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    this.journalEntries.delete(id);
  }

  // Mood data
  async getMoodData(): Promise<MoodData[]> {
    return Array.from(this.moodData.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getMoodDataByDateRange(startDate: string, endDate: string): Promise<MoodData[]> {
    const allMoodData = await this.getMoodData();
    return allMoodData.filter(data => {
      const dataDate = new Date(data.date);
      return dataDate >= new Date(startDate) && dataDate <= new Date(endDate);
    });
  }

  async createMoodData(data: InsertMoodData): Promise<MoodData> {
    const id = randomUUID();
    const newMoodData: MoodData = {
      id,
      ...data,
      createdAt: new Date(),
    };
    this.moodData.set(id, newMoodData);
    return newMoodData;
  }

  // User progress
  async getUserProgress(): Promise<UserProgress | undefined> {
    return this.userProgress;
  }

  async updateUserProgress(updates: Partial<UserProgress>): Promise<UserProgress> {
    if (!this.userProgress) {
      throw new Error("User progress not initialized");
    }
    
    this.userProgress = {
      ...this.userProgress,
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.userProgress;
  }

  async addBadge(badge: Badge): Promise<UserProgress> {
    if (!this.userProgress) {
      throw new Error("User progress not initialized");
    }
    
    if (!this.userProgress.badges.includes(badge)) {
      this.userProgress.badges.push(badge);
      this.userProgress.updatedAt = new Date();
    }
    
    return this.userProgress;
  }

  // Music recommendations
  async getMusicRecommendations(mood: Mood): Promise<MusicRecommendation[]> {
    return Array.from(this.musicRecommendations.values())
      .filter(music => music.mood === mood);
  }

  async getAllMusicRecommendations(): Promise<MusicRecommendation[]> {
    return Array.from(this.musicRecommendations.values());
  }

  // Helper methods
  private isConsecutiveDay(lastDate: string, currentDate: string): boolean {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const daysDiff = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff === 1;
  }

  private checkAndAwardBadges(): void {
    if (!this.userProgress) return;
    
    const badges: Badge[] = [];
    
    // First entry badge
    if (this.userProgress.totalEntries === 1) {
      badges.push("first_entry");
    }
    
    // Streak badges
    if (this.userProgress.streak >= 7) {
      badges.push("streak_keeper");
    }
    
    // Weekly badges
    if (this.userProgress.totalEntries >= 7) {
      badges.push("week_warrior");
    }
    
    // Monthly badges
    if (this.userProgress.totalEntries >= 30) {
      badges.push("month_master");
    }
    
    // Add badges that aren't already awarded
    badges.forEach(badge => {
      if (!this.userProgress!.badges.includes(badge)) {
        this.userProgress!.badges.push(badge);
      }
    });
  }
}

export const storage = new MemStorage();
