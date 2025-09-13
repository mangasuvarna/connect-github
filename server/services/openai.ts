import OpenAI from "openai";

// Use the newest OpenAI model "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "sk-test-key"
});

export interface SentimentAnalysis {
  mood: string;
  sentimentScore: number; // -1 to 1 scale
  confidence: number; // 0 to 1 scale
  insights: {
    emotions: string[];
    themes: string[];
    suggestions: string[];
  };
}

export interface JokeResponse {
  jokes: string[];
  mood: string;
}

export interface MusicSuggestion {
  title: string;
  artist: string;
  reason: string;
  mood: string;
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an empathetic AI therapist analyzing journal entries. Analyze the sentiment and provide insights in JSON format.
          
          Respond with this exact JSON structure:
          {
            "mood": "happy|sad|anxious|excited|neutral|angry|calm",
            "sentimentScore": number between -1 and 1,
            "confidence": number between 0 and 1,
            "insights": {
              "emotions": ["array of detected emotions"],
              "themes": ["array of main themes"],
              "suggestions": ["array of helpful suggestions"]
            }
          }`
        },
        {
          role: "user",
          content: `Please analyze this journal entry: "${text}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      mood: result.mood || "neutral",
      sentimentScore: Math.max(-1, Math.min(1, result.sentimentScore || 0)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      insights: {
        emotions: result.insights?.emotions || [],
        themes: result.insights?.themes || [],
        suggestions: result.insights?.suggestions || []
      }
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw new Error("Failed to analyze sentiment: " + (error as Error).message);
  }
}

export async function generateJokes(mood: string, count: number = 3): Promise<JokeResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a compassionate AI that generates uplifting, clean, and appropriate jokes to help improve someone's mood. 
          Generate jokes that are suitable for mental health support. Avoid dark humor or anything that might worsen someone's mood.
          
          Respond with this exact JSON structure:
          {
            "jokes": ["array of ${count} clean, uplifting jokes"],
            "mood": "the target mood to improve to"
          }`
        },
        {
          role: "user",
          content: `Generate ${count} uplifting jokes to help someone who is feeling ${mood}. Make them wholesome and mood-boosting.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      jokes: result.jokes || ["Why don't scientists trust atoms? Because they make up everything! 😄"],
      mood: result.mood || "happy"
    };
  } catch (error) {
    console.error("Error generating jokes:", error);
    throw new Error("Failed to generate jokes: " + (error as Error).message);
  }
}

export async function generateMusicSuggestions(mood: string, preferences?: string): Promise<MusicSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a music therapist AI that suggests songs based on mood and emotional needs.
          Consider both songs that match the current mood and songs that might help improve it.
          
          Respond with this exact JSON structure:
          {
            "suggestions": [
              {
                "title": "song title",
                "artist": "artist name",
                "reason": "why this song is suggested for this mood",
                "mood": "current mood this addresses"
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Suggest 5-7 songs for someone feeling ${mood}. ${preferences ? `Their preferences: ${preferences}` : ''}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result.suggestions || [
      {
        title: "Here Comes the Sun",
        artist: "The Beatles",
        reason: "A classic uplifting song to brighten your day",
        mood: mood
      }
    ];
  } catch (error) {
    console.error("Error generating music suggestions:", error);
    throw new Error("Failed to generate music suggestions: " + (error as Error).message);
  }
}

export async function generateJournalPrompts(mood: string, recentThemes?: string[]): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a therapeutic writing coach AI that creates personalized journal prompts.
          Generate prompts that encourage self-reflection, emotional processing, and personal growth.
          
          Respond with this exact JSON structure:
          {
            "prompts": ["array of 4-6 thoughtful journal prompts"]
          }`
        },
        {
          role: "user",
          content: `Generate journal prompts for someone feeling ${mood}. ${recentThemes ? `Recent themes in their writing: ${recentThemes.join(', ')}` : ''}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result.prompts || [
      "What three things are you grateful for today?",
      "Describe a moment when you felt truly at peace.",
      "What would you tell your younger self about handling challenges?",
      "Write about a small victory you achieved recently."
    ];
  } catch (error) {
    console.error("Error generating journal prompts:", error);
    throw new Error("Failed to generate journal prompts: " + (error as Error).message);
  }
}
