import { useState, useEffect } from "react";

export interface MoodState {
  currentMood: string;
  intensity: number;
  lastUpdated: Date;
}

export function useMood() {
  const [moodState, setMoodState] = useState<MoodState>({
    currentMood: "neutral",
    intensity: 3,
    lastUpdated: new Date(),
  });

  const updateMood = (mood: string, intensity: number = 3) => {
    setMoodState({
      currentMood: mood,
      intensity,
      lastUpdated: new Date(),
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: "😊",
      excited: "🤩",
      calm: "😌",
      neutral: "😐",
      anxious: "😰",
      sad: "😢",
      angry: "😠",
    };
    return moodEmojis[mood] || "😐";
  };

  const getMoodColor = (mood: string) => {
    const moodColors: Record<string, string> = {
      happy: "text-green-600",
      excited: "text-orange-600",
      calm: "text-blue-600",
      neutral: "text-gray-600",
      anxious: "text-purple-600",
      sad: "text-blue-800",
      angry: "text-red-600",
    };
    return moodColors[mood] || "text-gray-600";
  };

  const getMoodGradient = (mood: string) => {
    const moodGradients: Record<string, string> = {
      happy: "from-green-400 to-emerald-500",
      excited: "from-orange-400 to-yellow-500",
      calm: "from-blue-400 to-purple-500",
      neutral: "from-gray-400 to-slate-500",
      anxious: "from-purple-400 to-pink-500",
      sad: "from-blue-500 to-indigo-600",
      angry: "from-red-400 to-orange-500",
    };
    return moodGradients[mood] || "from-gray-400 to-slate-500";
  };

  const isPositiveMood = (mood: string) => {
    return ["happy", "excited", "calm"].includes(mood);
  };

  const isNegativeMood = (mood: string) => {
    return ["sad", "anxious", "angry"].includes(mood);
  };

  const getRecommendedActivities = (mood: string) => {
    const activities: Record<string, string[]> = {
      happy: ["Listen to upbeat music", "Share your joy with friends", "Try creative activities"],
      excited: ["Channel energy into exercise", "Start a new project", "Dance or move"],
      calm: ["Practice meditation", "Enjoy quiet activities", "Read a good book"],
      neutral: ["Explore new interests", "Connect with others", "Set small goals"],
      anxious: ["Try breathing exercises", "Listen to calming music", "Practice mindfulness"],
      sad: ["Reach out to someone you trust", "Gentle self-care", "Listen to comforting music"],
      angry: ["Physical exercise", "Journaling", "Deep breathing"],
    };
    return activities[mood] || activities.neutral;
  };

  return {
    moodState,
    updateMood,
    getMoodEmoji,
    getMoodColor,
    getMoodGradient,
    isPositiveMood,
    isNegativeMood,
    getRecommendedActivities,
  };
}
