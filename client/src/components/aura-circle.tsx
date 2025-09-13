import { cn } from "@/lib/utils";

interface AuraCircleProps {
  mood?: string;
  size?: "sm" | "md" | "lg" | "xl";
  intensity?: number; // 1-5 scale
  showPulse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AuraCircle({
  mood = "happy",
  size = "md",
  intensity = 3,
  showPulse = true,
  className,
  children,
}: AuraCircleProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  const getMoodGradient = (mood: string, intensity: number) => {
    const alpha = Math.max(0.6, intensity / 5);
    
    switch (mood) {
      case "happy":
        return `bg-gradient-to-br from-emerald-400/${alpha * 100} to-teal-400/${alpha * 100}`;
      case "excited":
        return `bg-gradient-to-br from-orange-400/${alpha * 100} to-yellow-400/${alpha * 100}`;
      case "calm":
        return `bg-gradient-to-br from-blue-400/${alpha * 100} to-purple-400/${alpha * 100}`;
      case "sad":
        return `bg-gradient-to-br from-blue-500/${alpha * 100} to-indigo-500/${alpha * 100}`;
      case "anxious":
        return `bg-gradient-to-br from-purple-500/${alpha * 100} to-pink-500/${alpha * 100}`;
      case "angry":
        return `bg-gradient-to-br from-red-400/${alpha * 100} to-orange-400/${alpha * 100}`;
      default:
        return `bg-gradient-to-br from-gray-400/${alpha * 100} to-slate-400/${alpha * 100}`;
    }
  };

  const getGlowEffect = (mood: string, intensity: number) => {
    const glowIntensity = intensity / 5;
    
    switch (mood) {
      case "happy":
        return `0 0 ${20 * glowIntensity}px rgba(52, 211, 153, ${0.4 * glowIntensity}), 0 0 ${40 * glowIntensity}px rgba(45, 212, 191, ${0.2 * glowIntensity})`;
      case "excited":
        return `0 0 ${20 * glowIntensity}px rgba(251, 146, 60, ${0.4 * glowIntensity}), 0 0 ${40 * glowIntensity}px rgba(250, 204, 21, ${0.2 * glowIntensity})`;
      case "calm":
        return `0 0 ${20 * glowIntensity}px rgba(96, 165, 250, ${0.4 * glowIntensity}), 0 0 ${40 * glowIntensity}px rgba(147, 51, 234, ${0.2 * glowIntensity})`;
      case "sad":
        return `0 0 ${20 * glowIntensity}px rgba(59, 130, 246, ${0.4 * glowIntensity}), 0 0 ${40 * glowIntensity}px rgba(79, 70, 229, ${0.2 * glowIntensity})`;
      case "anxious":
        return `0 0 ${20 * glowIntensity}px rgba(147, 51, 234, ${0.4 * glowIntensity}), 0 0 ${40 * glowIntensity}px rgba(236, 72, 153, ${0.2 * glowIntensity})`;
      case "angry":
        return `0 0 ${20 * glowIntensity}px rgba(248, 113, 113, ${0.4 * glowIntensity}), 0 0 ${40 * glowIntensity}px rgba(251, 146, 60, ${0.2 * glowIntensity})`;
      default:
        return `0 0 ${20 * glowIntensity}px rgba(156, 163, 175, ${0.4 * glowIntensity})`;
    }
  };

  return (
    <div className="relative inline-block" data-testid="aura-circle">
      <div
        className={cn(
          sizeClasses[size],
          getMoodGradient(mood, intensity),
          "rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20",
          showPulse && "animate-aura-pulse",
          className
        )}
        style={{
          boxShadow: getGlowEffect(mood, intensity),
        }}
        data-testid={`aura-circle-${mood}`}
      >
        {children}
      </div>
    </div>
  );
}
