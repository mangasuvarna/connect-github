import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  selectedMood?: string;
  onMoodSelect: (mood: string) => void;
  className?: string;
}

const moods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "sad", emoji: "😢", label: "Sad" },
  { id: "angry", emoji: "😠", label: "Angry" },
];

export default function MoodSelector({ 
  selectedMood, 
  onMoodSelect, 
  className 
}: MoodSelectorProps) {
  return (
    <div className={cn("space-y-3", className)} data-testid="mood-selector">
      <label className="block text-sm font-medium text-foreground">
        How are you feeling?
      </label>
      <div className="flex flex-wrap gap-3">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant={selectedMood === mood.id ? "default" : "outline"}
            size="lg"
            onClick={() => onMoodSelect(mood.id)}
            className={cn(
              "flex flex-col items-center gap-2 h-20 w-20 p-2 transition-all duration-200",
              selectedMood === mood.id 
                ? "ring-2 ring-primary ring-offset-2 scale-105" 
                : "hover:scale-105"
            )}
            data-testid={`mood-${mood.id}`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
