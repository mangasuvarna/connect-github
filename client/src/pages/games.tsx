import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateJokes } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BreathingExercise from "@/components/breathing-exercise";
import DoodlePad from "@/components/doodle-pad";
import { useMood } from "@/hooks/use-mood";
import { useToast } from "@/hooks/use-toast";
import { 
  Gamepad2, 
  Heart, 
  Palette, 
  Wind, 
  Smile,
  Puzzle,
  Sparkles,
  Brain,
  Laugh,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveGame = "breathing" | "doodle" | "jokes" | "gratitude" | "color" | "puzzle" | null;

export default function Games() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
  const [colorScore, setColorScore] = useState(0);
  const [puzzleLevel, setPuzzleLevel] = useState(1);
  const { moodState, getMoodEmoji, getRecommendedActivities } = useMood();
  const { toast } = useToast();

  const jokesMutation = useMutation({
    mutationFn: (mood: string) => generateJokes(mood, 3),
    onSuccess: (data) => {
      toast({
        title: "Jokes loaded! 😄",
        description: "Hope these bring a smile to your face!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to load jokes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const games = [
    {
      id: "breathing" as const,
      title: "Breathing Exercise",
      description: "Guided breathing to reduce stress and anxiety",
      icon: <Wind className="w-6 h-6" />,
      color: "from-blue-400 to-purple-500",
      benefits: ["Reduces anxiety", "Improves focus", "Calms nervous system"],
      recommended: ["anxious", "angry", "neutral"],
    },
    {
      id: "doodle" as const,
      title: "Digital Doodle Pad",
      description: "Express yourself through creative drawing",
      icon: <Palette className="w-6 h-6" />,
      color: "from-pink-400 to-red-500",
      benefits: ["Creative expression", "Emotional release", "Mindfulness"],
      recommended: ["sad", "angry", "neutral"],
    },
    {
      id: "jokes" as const,
      title: "Mood-Boosting Jokes",
      description: "Uplifting humor tailored to your mood",
      icon: <Laugh className="w-6 h-6" />,
      color: "from-yellow-400 to-orange-500",
      benefits: ["Improves mood", "Reduces stress", "Social connection"],
      recommended: ["sad", "neutral", "anxious"],
    },
    {
      id: "gratitude" as const,
      title: "Gratitude Exercise",
      description: "Quick gratitude practices to boost positivity",
      icon: <Heart className="w-6 h-6" />,
      color: "from-green-400 to-emerald-500",
      benefits: ["Increases happiness", "Improves relationships", "Better sleep"],
      recommended: ["sad", "neutral", "happy"],
    },
    {
      id: "color" as const,
      title: "Color Therapy",
      description: "Interactive color matching for mood balance",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-purple-400 to-pink-500",
      benefits: ["Visual relaxation", "Mood regulation", "Cognitive stimulation"],
      recommended: ["anxious", "neutral", "excited"],
    },
    {
      id: "puzzle" as const,
      title: "Mindful Puzzle",
      description: "Relax with therapeutic puzzle games",
      icon: <Puzzle className="w-6 h-6" />,
      color: "from-indigo-400 to-blue-500",
      benefits: ["Improves focus", "Problem solving", "Stress relief"],
      recommended: ["anxious", "neutral", "sad"],
    },
  ];

  const startGratitudeExercise = () => {
    setActiveGame("gratitude");
    setGratitudeItems([]);
  };

  const addGratitudeItem = (item: string) => {
    if (item.trim() && gratitudeItems.length < 5) {
      setGratitudeItems(prev => [...prev, item.trim()]);
    }
  };

  const startColorTherapy = () => {
    setActiveGame("color");
    setColorScore(0);
  };

  const startPuzzle = () => {
    setActiveGame("puzzle");
    setPuzzleLevel(1);
  };

  const getGameRecommendation = () => {
    const recommendedActivities = getRecommendedActivities(moodState.currentMood);
    return recommendedActivities[0] || "Try breathing exercises to center yourself";
  };

  const renderActiveGame = () => {
    switch (activeGame) {
      case "breathing":
        return <BreathingExercise />;
      
      case "doodle":
        return <DoodlePad />;
      
      case "jokes":
        return (
          <div className="space-y-6" data-testid="jokes-display">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Mood-Boosting Jokes</h3>
              <p className="text-gray-600 mb-6">
                Laughter is the best medicine! Here are some jokes to brighten your day.
              </p>
            </div>
            
            {jokesMutation.isPending ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading jokes for you...</p>
              </div>
            ) : jokesMutation.data?.jokes ? (
              <div className="space-y-4">
                {jokesMutation.data.jokes.map((joke: string, index: number) => (
                  <Card key={index} className="glass-card border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Smile className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
                        <p className="text-gray-700 text-lg leading-relaxed">{joke}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="text-center">
                  <Button 
                    onClick={() => jokesMutation.mutate(moodState.currentMood)}
                    disabled={jokesMutation.isPending}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    data-testid="get-more-jokes"
                  >
                    Get More Jokes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button 
                  onClick={() => jokesMutation.mutate(moodState.currentMood)}
                  disabled={jokesMutation.isPending}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  data-testid="load-jokes"
                >
                  <Laugh className="w-4 h-4 mr-2" />
                  Load Jokes
                </Button>
              </div>
            )}
          </div>
        );
      
      case "gratitude":
        return (
          <div className="space-y-6" data-testid="gratitude-exercise">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Gratitude Exercise</h3>
              <p className="text-gray-600 mb-6">
                List things you're grateful for. Even small things count!
              </p>
            </div>
            
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-green-600 w-8">
                    {index + 1}.
                  </span>
                  {gratitudeItems[index] ? (
                    <div className="flex-1 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-gray-700">{gratitudeItems[index]}</p>
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={`What are you grateful for? (${index + 1}/5)`}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addGratitudeItem((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      data-testid={`gratitude-input-${index}`}
                    />
                  )}
                </div>
              ))}
            </div>
            
            {gratitudeItems.length === 5 && (
              <Card className="glass-card border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h4 className="text-xl font-bold text-green-800 mb-2">Beautiful! ✨</h4>
                    <p className="text-green-700">
                      You've completed your gratitude practice. Take a moment to feel the warmth of appreciation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      
      case "color":
        return (
          <div className="space-y-6" data-testid="color-therapy">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Color Therapy</h3>
              <p className="text-gray-600 mb-6">
                Click on colors that make you feel calm and happy
              </p>
              <div className="text-lg font-semibold text-purple-600">
                Score: {colorScore}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {[
                { color: "#FF6B6B", name: "Coral" },
                { color: "#4ECDC4", name: "Turquoise" },
                { color: "#45B7D1", name: "Sky Blue" },
                { color: "#96CEB4", name: "Mint" },
                { color: "#FFEAA7", name: "Cream" },
                { color: "#DDA0DD", name: "Plum" },
                { color: "#98D8C8", name: "Seafoam" },
                { color: "#F7DC6F", name: "Banana" },
              ].map((colorItem, index) => (
                <div
                  key={index}
                  onClick={() => setColorScore(prev => prev + 10)}
                  className="aspect-square rounded-xl cursor-pointer hover:scale-110 transition-transform duration-200 flex items-center justify-center text-white font-medium shadow-lg"
                  style={{ backgroundColor: colorItem.color }}
                  data-testid={`color-${colorItem.name.toLowerCase()}`}
                >
                  {colorItem.name}
                </div>
              ))}
            </div>
            
            {colorScore >= 50 && (
              <Alert className="border-purple-200 bg-purple-50">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <AlertDescription className="text-purple-700">
                  Great job! You're creating a beautiful color harmony. Colors can influence our mood and energy levels.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      
      case "puzzle":
        return (
          <div className="space-y-6" data-testid="mindful-puzzle">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Mindful Puzzle</h3>
              <p className="text-gray-600 mb-6">
                A simple puzzle to help you focus and relax
              </p>
              <div className="text-lg font-semibold text-indigo-600">
                Level: {puzzleLevel}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 max-w-64 mx-auto">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => setPuzzleLevel(prev => prev + 1)}
                  className={cn(
                    "aspect-square rounded-lg cursor-pointer hover:scale-105 transition-all duration-200",
                    "flex items-center justify-center text-white font-bold text-xl",
                    index % 2 === 0 ? "bg-indigo-400" : "bg-blue-400"
                  )}
                  data-testid={`puzzle-piece-${index}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => setPuzzleLevel(1)}
                variant="outline"
                className="border-indigo-300 text-indigo-600"
                data-testid="reset-puzzle"
              >
                Reset Puzzle
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-teal-100 pt-24 pb-16" data-testid="games-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" data-testid="games-title">
              Wellness Games & Activities
            </h1>
            <p className="text-xl text-gray-600">
              Interactive activities designed to boost your mood and mental health
            </p>
          </div>

          {/* Current Mood and Recommendation */}
          <Card className="glass-card" data-testid="mood-recommendation">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 rounded-full">
                  <span className="text-2xl">{getMoodEmoji(moodState.currentMood)}</span>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Current Mood</p>
                    <p className="font-semibold text-gray-800 capitalize">{moodState.currentMood}</p>
                  </div>
                </div>
                <Alert className="max-w-2xl mx-auto border-primary/50 bg-primary/10">
                  <Brain className="w-4 h-4" />
                  <AlertDescription>
                    <strong>AI Suggestion:</strong> {getGameRecommendation()}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Active Game */}
          {activeGame && (
            <Card className="glass-card" data-testid="active-game">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                    {games.find(game => game.id === activeGame)?.title}
                  </CardTitle>
                  <Button
                    onClick={() => setActiveGame(null)}
                    variant="outline"
                    size="sm"
                    data-testid="close-game"
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderActiveGame()}
              </CardContent>
            </Card>
          )}

          {/* Games Grid */}
          {!activeGame && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => {
                const isRecommended = game.recommended.includes(moodState.currentMood);
                
                return (
                  <Card 
                    key={game.id}
                    className={cn(
                      "glass-card hover:scale-105 transition-all duration-300 cursor-pointer",
                      isRecommended && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => {
                      if (game.id === "gratitude") {
                        startGratitudeExercise();
                      } else if (game.id === "color") {
                        startColorTherapy();
                      } else if (game.id === "puzzle") {
                        startPuzzle();
                      } else {
                        setActiveGame(game.id);
                      }
                    }}
                    data-testid={`game-${game.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Game Icon */}
                        <div className={cn(
                          "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center mx-auto text-white",
                          game.color
                        )}>
                          {game.icon}
                        </div>
                        
                        {/* Game Info */}
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {game.title}
                            </h3>
                            {isRecommended && (
                              <Target className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <p className="text-gray-600">
                            {game.description}
                          </p>
                        </div>
                        
                        {/* Benefits */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800 text-sm">Benefits:</h4>
                          <div className="flex flex-wrap gap-1">
                            {game.benefits.map((benefit, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-white/60 text-gray-700 px-2 py-1 rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action Button */}
                        <Button
                          className={cn(
                            "w-full bg-gradient-to-r text-white hover:opacity-90",
                            game.color
                          )}
                          data-testid={`start-${game.id}`}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Start Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Benefits of Wellness Games */}
          <Card className="glass-card" data-testid="wellness-benefits">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Heart className="w-5 h-5 text-accent" />
                Why Wellness Games Matter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-600">
                <div className="text-center space-y-3">
                  <Brain className="w-10 h-10 mx-auto text-blue-500" />
                  <h4 className="font-medium text-gray-800">Mental Stimulation</h4>
                  <p className="text-sm">Keeps your mind active and engaged in positive ways</p>
                </div>
                <div className="text-center space-y-3">
                  <Heart className="w-10 h-10 mx-auto text-red-500" />
                  <h4 className="font-medium text-gray-800">Emotional Regulation</h4>
                  <p className="text-sm">Helps process and manage difficult emotions</p>
                </div>
                <div className="text-center space-y-3">
                  <Target className="w-10 h-10 mx-auto text-green-500" />
                  <h4 className="font-medium text-gray-800">Stress Relief</h4>
                  <p className="text-sm">Provides healthy distractions from daily stressors</p>
                </div>
                <div className="text-center space-y-3">
                  <Sparkles className="w-10 h-10 mx-auto text-purple-500" />
                  <h4 className="font-medium text-gray-800">Self-Discovery</h4>
                  <p className="text-sm">Encourages mindfulness and self-awareness</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
