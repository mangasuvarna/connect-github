import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJournalEntry, generateJournalPrompts } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MoodSelector from "@/components/mood-selector";
import AuraCircle from "@/components/aura-circle";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Sparkles, 
  Brain, 
  Heart,
  CheckCircle,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Journal() {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("neutral");
  const [showPrompts, setShowPrompts] = useState(false);
  const [showAuraResponse, setShowAuraResponse] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts, isLoading: promptsLoading } = useQuery({
    queryKey: ["/api/journal/prompts", selectedMood],
    queryFn: () => generateJournalPrompts(selectedMood),
    enabled: showPrompts,
  });

  const createEntryMutation = useMutation({
    mutationFn: createJournalEntry,
    onSuccess: (data) => {
      setContent("");
      setShowAuraResponse(true);
      setShowPrompts(true);
      
      // Hide aura response after 3 seconds
      setTimeout(() => {
        setShowAuraResponse(false);
      }, 3000);

      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mood-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });

      toast({
        title: "Entry Saved! ✨",
        description: `AI detected your mood as ${data.sentiment.mood}. Your aura grows brighter!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something in your journal first!",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      content: content.trim(),
      mood: selectedMood,
    });
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  const insertPrompt = (prompt: string) => {
    setContent(prev => prev + (prev ? "\n\n" : "") + prompt + "\n\n");
    setShowPrompts(false);
  };

  return (
    <div className="min-h-screen aurora-gradient pt-24 pb-16" data-testid="journal-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" data-testid="journal-title">
              Express Your Thoughts
            </h1>
            <p className="text-xl text-gray-600">
              Your safe space for reflection and emotional discovery
            </p>
          </div>

          {/* Main Journal Card */}
          <Card className="glass-card shadow-2xl border-white/30" data-testid="journal-card">
            <CardContent className="p-8 space-y-6">
              {/* Mood Selector */}
              <MoodSelector 
                selectedMood={selectedMood}
                onMoodSelect={setSelectedMood}
              />

              {/* Writing Area */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  What's on your mind today?
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your thoughts here... Let your emotions flow freely onto the page. There's no right or wrong way to express yourself."
                  className="min-h-80 bg-white/60 backdrop-blur-sm border-white/40 text-gray-800 placeholder-gray-500 resize-none text-lg leading-relaxed focus:ring-2 focus:ring-primary/50 transition-all"
                  data-testid="journal-textarea"
                />
              </div>

              {/* Word Count and Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600" data-testid="word-count">
                    Words: {wordCount}
                  </span>
                  {selectedMood && (
                    <AuraCircle 
                      mood={selectedMood} 
                      size="sm" 
                      intensity={3}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </AuraCircle>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setShowPrompts(!showPrompts)}
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    data-testid="toggle-prompts-button"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Get Prompts
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    disabled={createEntryMutation.isPending || !content.trim()}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow-effect"
                    data-testid="save-entry-button"
                  >
                    {createEntryMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Processing Status */}
              {createEntryMutation.isPending && (
                <Alert className="border-primary/50 bg-primary/10">
                  <Brain className="w-4 h-4" />
                  <AlertDescription>
                    AI is analyzing your entry for emotional insights...
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Aura Response Animation */}
          {showAuraResponse && (
            <Card className="glass-card border-green-500/50 animate-float" data-testid="aura-response">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AuraCircle 
                    mood={selectedMood} 
                    size="lg" 
                    intensity={4}
                    className="mx-auto"
                  >
                    <Heart className="w-8 h-8 text-white animate-pulse" />
                  </AuraCircle>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Your aura grows brighter! ✨
                    </h3>
                    <p className="text-gray-600">
                      Thank you for sharing your thoughts. Your emotional awareness is strengthening.
                    </p>
                  </div>
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Entry saved and analyzed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Writing Prompts */}
          {showPrompts && (
            <Card className="glass-card border-primary/50" data-testid="ai-prompts">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Writing Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {promptsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : prompts?.prompts ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 mb-4">
                      Based on your {selectedMood} mood, here are some thoughtful prompts to inspire your writing:
                    </p>
                    {prompts.prompts.map((prompt: string, index: number) => (
                      <div
                        key={index}
                        onClick={() => insertPrompt(prompt)}
                        className={cn(
                          "p-4 bg-white/40 rounded-lg cursor-pointer border border-white/30",
                          "hover:bg-white/60 hover:border-primary/50 transition-all duration-200",
                          "hover:scale-[1.02] hover:shadow-lg"
                        )}
                        data-testid={`prompt-${index}`}
                      >
                        <p className="text-gray-700 font-medium">{prompt}</p>
                        <p className="text-xs text-gray-500 mt-2">Click to add to your journal</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Unable to load prompts. Please try again.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips for Better Journaling */}
          <Card className="glass-card border-accent/50" data-testid="journaling-tips">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                Journaling Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Be Authentic</h4>
                  <p className="text-sm">Write honestly about your feelings without judgment.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Write Regularly</h4>
                  <p className="text-sm">Consistency helps you track patterns and progress.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Include Details</h4>
                  <p className="text-sm">Describe what triggered your emotions and how you responded.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">Practice Gratitude</h4>
                  <p className="text-sm">Include things you're grateful for, even on difficult days.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
