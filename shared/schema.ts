import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  mood: varchar("mood", { length: 20 }).notNull(),
  sentimentScore: real("sentiment_score"),
  confidence: real("confidence"),
  aiInsights: json("ai_insights"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moodData = pgTable("mood_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  mood: varchar("mood", { length: 20 }).notNull(),
  intensity: integer("intensity").notNull(), // 1-5 scale
  notes: text("notes"),
  entryId: varchar("entry_id").references(() => journalEntries.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  streak: integer("streak").default(0).notNull(),
  totalEntries: integer("total_entries").default(0).notNull(),
  badges: json("badges").$type<string[]>().default([]),
  auraLevel: integer("aura_level").default(1).notNull(),
  lastEntryDate: text("last_entry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const musicRecommendations = pgTable("music_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: varchar("mood", { length: 20 }).notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  genre: text("genre").notNull(),
  spotifyUrl: text("spotify_url"),
  youtubeUrl: text("youtube_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  sentimentScore: true,
  confidence: true,
  aiInsights: true,
  createdAt: true,
});

export const insertMoodDataSchema = createInsertSchema(moodData).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;

export type MoodData = typeof moodData.$inferSelect;
export type InsertMoodData = z.infer<typeof insertMoodDataSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type MusicRecommendation = typeof musicRecommendations.$inferSelect;

// Mood types for better type safety
export const MOODS = ["happy", "sad", "anxious", "excited", "neutral", "angry", "calm"] as const;
export type Mood = typeof MOODS[number];

// Badge types
export const BADGES = [
  "first_entry",
  "streak_keeper",
  "positivity",
  "resilience", 
  "calm_mind",
  "week_warrior",
  "month_master",
  "introspection_expert"
] as const;
export type Badge = typeof BADGES[number];
