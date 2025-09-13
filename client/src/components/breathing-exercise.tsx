import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingExerciseProps {
  className?: string;
}

export default function BreathingExercise({ className }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);

  const phases = {
    inhale: { duration: 4, next: "hold", text: "Breathe In" },
    hold: { duration: 7, next: "exhale", text: "Hold" },
    exhale: { duration: 8, next: "inhale", text: "Breathe Out" },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next as "inhale" | "hold" | "exhale";
            setPhase(nextPhase);
            
            if (nextPhase === "inhale") {
              setCycle((prev) => prev + 1);
            }
            
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const start = () => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(4);
    setCycle(0);
  };

  const pause = () => {
    setIsActive(!isActive);
  };

  const stop = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(4);
    setCycle(0);
  };

  const getCircleScale = () => {
    const progress = (phases[phase].duration - timeLeft) / phases[phase].duration;
    
    switch (phase) {
      case "inhale":
        return 1 + (progress * 0.5); // Scale from 1 to 1.5
      case "exhale":
        return 1.5 - (progress * 0.5); // Scale from 1.5 to 1
      case "hold":
        return 1.5; // Stay at maximum scale
      default:
        return 1;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "from-blue-400 to-teal-400";
      case "hold":
        return "from-purple-400 to-pink-400";
      case "exhale":
        return "from-green-400 to-blue-400";
      default:
        return "from-gray-400 to-slate-400";
    }
  };

  return (
    <div className={cn("text-center space-y-6", className)} data-testid="breathing-exercise">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-foreground">4-7-8 Breathing Exercise</h3>
        <p className="text-muted-foreground">
          A proven technique to reduce stress and anxiety
        </p>
      </div>

      {/* Breathing Circle */}
      <div className="relative inline-block">
        <div
          className={cn(
            "w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center transition-transform duration-1000 ease-in-out",
            getPhaseColor(),
            isActive && "animate-pulse"
          )}
          style={{
            transform: `scale(${getCircleScale()})`,
          }}
          data-testid="breathing-circle"
        >
          <div className="text-center text-white">
            <div className="text-xl font-bold mb-1" data-testid="phase-text">
              {phases[phase].text}
            </div>
            <div className="text-3xl font-bold" data-testid="time-left">
              {timeLeft}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Follow the circle's rhythm and the countdown
        </p>
        {cycle > 0 && (
          <p className="text-sm font-medium text-primary" data-testid="cycle-count">
            Completed cycles: {cycle}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isActive ? (
          <Button onClick={start} className="gap-2" data-testid="start-breathing">
            <Play className="w-4 h-4" />
            Start
          </Button>
        ) : (
          <Button onClick={pause} variant="secondary" className="gap-2" data-testid="pause-breathing">
            <Pause className="w-4 h-4" />
            {isActive ? "Pause" : "Resume"}
          </Button>
        )}
        
        <Button onClick={stop} variant="outline" className="gap-2" data-testid="stop-breathing">
          <Square className="w-4 h-4" />
          Stop
        </Button>
      </div>

      {/* Benefits */}
      <div className="text-left max-w-md mx-auto space-y-2 text-sm text-muted-foreground">
        <h4 className="font-medium text-foreground">Benefits:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Reduces anxiety and stress</li>
          <li>Improves focus and concentration</li>
          <li>Helps with sleep and relaxation</li>
          <li>Lowers blood pressure</li>
        </ul>
      </div>
    </div>
  );
}
