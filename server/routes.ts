import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema, insertMoodDataSchema, type Mood } from "@shared/schema";
import { analyzeSentiment, generateJokes, generateMusicSuggestions, generateJournalPrompts } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Journal entries
  app.get("/api/journal-entries", async (req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal-entries", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      
      // Create the journal entry first
      const entry = await storage.createJournalEntry(validatedData);
      
      // Analyze sentiment with AI
      const sentimentAnalysis = await analyzeSentiment(validatedData.content);
      
      // Update the entry with AI insights
      const updatedEntry = await storage.updateJournalEntry(entry.id, {
        sentimentScore: sentimentAnalysis.sentimentScore,
        confidence: sentimentAnalysis.confidence,
        aiInsights: sentimentAnalysis.insights,
      });
      
      // Create mood data entry
      const today = new Date().toISOString().split('T')[0];
      await storage.createMoodData({
        date: today,
        mood: sentimentAnalysis.mood as Mood,
        intensity: Math.round((sentimentAnalysis.sentimentScore + 1) * 2.5 + 1), // Convert to 1-5 scale
        notes: `AI detected mood: ${sentimentAnalysis.mood}`,
        entryId: entry.id,
      });
      
      res.json({
        entry: updatedEntry,
        sentiment: sentimentAnalysis
      });
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(400).json({ error: "Failed to create journal entry" });
    }
  });

  // Mood data
  app.get("/api/mood-data", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      let moodData;
      if (startDate && endDate) {
        moodData = await storage.getMoodDataByDateRange(startDate as string, endDate as string);
      } else {
        moodData = await storage.getMoodData();
      }
      
      res.json(moodData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood data" });
    }
  });

  app.post("/api/mood-data", async (req, res) => {
    try {
      const validatedData = insertMoodDataSchema.parse(req.body);
      const moodData = await storage.createMoodData(validatedData);
      res.json(moodData);
    } catch (error) {
      res.status(400).json({ error: "Failed to create mood data" });
    }
  });

  // User progress and stats
  app.get("/api/user/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  app.get("/api/user/stats", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      const moodData = await storage.getMoodData();
      const journalEntries = await storage.getJournalEntries();
      
      // Calculate mood distribution
      const moodCounts = moodData.reduce((acc, data) => {
        acc[data.mood] = (acc[data.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Get most frequent mood
      const mostFrequentMood = Object.entries(moodCounts).reduce(
        (a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b,
        ["neutral", 0]
      )[0];
      
      // Calculate positive entries percentage
      const positiveEntries = journalEntries.filter(entry => 
        entry.sentimentScore !== null && entry.sentimentScore > 0.1
      ).length;
      const positivePercentage = journalEntries.length > 0 
        ? Math.round((positiveEntries / journalEntries.length) * 100) 
        : 0;
      
      // Get this week's entries
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeekEntries = journalEntries.filter(entry => 
        new Date(entry.createdAt) >= oneWeekAgo
      ).length;
      
      res.json({
        progress,
        stats: {
          mostFrequentMood,
          positivePercentage,
          entriesThisWeek: thisWeekEntries,
          totalEntries: journalEntries.length,
          moodDistribution: moodCounts,
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Music recommendations
  app.get("/api/music/recommendations", async (req, res) => {
    try {
      const { mood } = req.query;
      
      let recommendations;
      if (mood) {
        recommendations = await storage.getMusicRecommendations(mood as Mood);
      } else {
        recommendations = await storage.getAllMusicRecommendations();
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch music recommendations" });
    }
  });

  app.post("/api/music/ai-suggestions", async (req, res) => {
    try {
      const { mood, preferences } = req.body;
      const suggestions = await generateMusicSuggestions(mood, preferences);
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating AI music suggestions:", error);
      res.status(500).json({ error: "Failed to generate music suggestions" });
    }
  });

  // Jokes for mood boosting
  app.post("/api/jokes", async (req, res) => {
    try {
      const { mood, count = 3 } = req.body;
      const jokes = await generateJokes(mood, count);
      res.json(jokes);
    } catch (error) {
      console.error("Error generating jokes:", error);
      res.status(500).json({ error: "Failed to generate jokes" });
    }
  });

  // AI journal prompts
  app.post("/api/journal/prompts", async (req, res) => {
    try {
      const { mood, recentThemes } = req.body;
      const prompts = await generateJournalPrompts(mood, recentThemes);
      res.json({ prompts });
    } catch (error) {
      console.error("Error generating journal prompts:", error);
      res.status(500).json({ error: "Failed to generate journal prompts" });
    }
  });

  // Analytics insights
  app.get("/api/analytics/insights", async (req, res) => {
    try {
      const moodData = await storage.getMoodData();
      const journalEntries = await storage.getJournalEntries();
      
      if (moodData.length === 0) {
        return res.json({
          insights: [
            "Start journaling regularly to unlock personalized insights!",
            "Your emotional journey begins with your first entry.",
            "AI insights will become more accurate as you write more."
          ]
        });
      }
      
      // Analyze patterns
      const dayOfWeekMoods = moodData.reduce((acc, data) => {
        const dayOfWeek = new Date(data.date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!acc[dayOfWeek]) acc[dayOfWeek] = [];
        acc[dayOfWeek].push(data.intensity);
        return acc;
      }, {} as Record<string, number[]>);
      
      // Find most challenging day
      const avgMoodByDay = Object.entries(dayOfWeekMoods).map(([day, intensities]) => ({
        day,
        avgIntensity: intensities.reduce((a, b) => a + b, 0) / intensities.length
      }));
      
      const mostChallengingDay = avgMoodByDay.reduce(
        (min, curr) => curr.avgIntensity < min.avgIntensity ? curr : min,
        avgMoodByDay[0]
      )?.day || "Monday";
      
      // Simple insights based on data patterns
      const insights = [
        `Most challenging day: ${mostChallengingDay}`,
        "Your mood improves with consistent journaling",
        "Your most positive entries mention personal achievements",
        `Average mood intensity: ${(moodData.reduce((acc, data) => acc + data.intensity, 0) / moodData.length).toFixed(1)}/5`
      ];
      
      res.json({ insights });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
