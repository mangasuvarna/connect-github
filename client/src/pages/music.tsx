import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMusicRecommendations, getAIMusicSuggestions } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MusicPlayer from "@/components/music-player";
import AuraCircle from "@/components/aura-circle";
import { useMood } from "@/hooks/use-mood";
import { 
  Music, 
  Search, 
  Play, 
  ExternalLink, 
  Heart,
  Sparkles,
  Volume2,
  Headphones,
  Radio,
  ListMusic
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MusicRecommendation } from "@shared/schema";

export default function Music() {
  const [selectedTrack, setSelectedTrack] = useState<MusicRecommendation | undefined>();
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [searchQuery, setSearchQuery] = useState("");
  const { moodState, getMoodEmoji, getMoodColor } = useMood();

  const { data: musicRecommendations, isLoading: musicLoading } = useQuery({
    queryKey: ["/api/music/recommendations"],
    queryFn: () => getMusicRecommendations(),
  });

  const { data: aiSuggestions, isLoading: aiLoading } = useQuery({
    queryKey: ["/api/music/ai-suggestions", selectedMood],
    queryFn: () => getAIMusicSuggestions(selectedMood),
    enabled: false, // Only fetch when explicitly requested
  });

  const isLoading = musicLoading;

  // Filter recommendations by mood
  const filteredRecommendations = musicRecommendations?.filter(track => 
    track.mood === selectedMood && 
    (searchQuery === "" || 
     track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     track.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Group recommendations by mood
  const recommendationsByMood = musicRecommendations?.reduce((acc, track) => {
    if (!acc[track.mood]) acc[track.mood] = [];
    acc[track.mood].push(track);
    return acc;
  }, {} as Record<string, MusicRecommendation[]>) || {};

  const moods = [
    { id: "happy", label: "Happy", emoji: "😊", color: "from-green-400 to-emerald-500" },
    { id: "calm", label: "Calm", emoji: "😌", color: "from-blue-400 to-cyan-500" },
    { id: "excited", label: "Excited", emoji: "🤩", color: "from-orange-400 to-yellow-500" },
    { id: "sad", label: "Sad", emoji: "😢", color: "from-blue-500 to-indigo-600" },
    { id: "anxious", label: "Anxious", emoji: "😰", color: "from-purple-400 to-pink-500" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen aurora-gradient pt-24 pb-16" data-testid="music-loading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen aurora-gradient pt-24 pb-16" data-testid="music-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" data-testid="music-title">
              Music for Your Mood
            </h1>
            <p className="text-xl text-gray-600">
              AI-curated playlists that match your emotional state
            </p>
          </div>

          {/* Current Mood Display */}
          <div className="text-center">
            <div className="glass-card inline-block p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <AuraCircle 
                  mood={moodState.currentMood} 
                  size="md" 
                  intensity={moodState.intensity}
                >
                  <Music className="w-6 h-6 text-white" />
                </AuraCircle>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Your Current Mood</p>
                  <p className={cn("text-lg font-bold capitalize", getMoodColor(moodState.currentMood))}>
                    {getMoodEmoji(moodState.currentMood)} {moodState.currentMood}
                  </p>
                  <p className="text-xs text-gray-500">
                    Based on your recent journal entries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mood Selector */}
          <Card className="glass-card" data-testid="mood-selector-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Heart className="w-5 h-5 text-accent" />
                Choose Your Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    className={cn(
                      "h-16 px-6 transition-all duration-200",
                      selectedMood === mood.id 
                        ? `bg-gradient-to-r ${mood.color} text-white hover:opacity-90 ring-2 ring-offset-2 ring-primary` 
                        : "hover:scale-105"
                    )}
                    data-testid={`mood-selector-${mood.id}`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">{mood.emoji}</div>
                      <div className="text-sm font-medium">{mood.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="glass-card" data-testid="search-card">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs or artists..."
                  className="pl-10 bg-white/60 backdrop-blur-sm border-white/40"
                  data-testid="music-search"
                />
              </div>
            </CardContent>
          </Card>

          {/* Music Player */}
          {selectedTrack && (
            <Card className="glass-card" data-testid="active-music-player">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Headphones className="w-5 h-5 text-primary" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MusicPlayer track={selectedTrack} />
              </CardContent>
            </Card>
          )}

          {/* Music Recommendations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((track) => (
                <Card 
                  key={track.id} 
                  className={cn(
                    "glass-card hover:scale-105 transition-all duration-300 cursor-pointer",
                    selectedTrack?.id === track.id && "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => setSelectedTrack(track)}
                  data-testid={`music-track-${track.id}`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Track Visual */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto">
                        <Volume2 className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Track Info */}
                      <div className="text-center space-y-2">
                        <h3 className="font-bold text-gray-800 text-lg line-clamp-2">
                          {track.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-1">
                          {track.artist}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {track.genre}
                        </Badge>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrack(track);
                          }}
                          data-testid={`play-track-${track.id}`}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </Button>
                        
                        {track.spotifyUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(track.spotifyUrl!, "_blank");
                            }}
                            data-testid={`spotify-${track.id}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Mood Indicator */}
                      <div className="text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          Perfect for {track.mood} mood
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="text-center py-12 text-gray-400">
                      <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Music Found</h3>
                      <p className="text-sm">
                        {searchQuery ? 
                          `No tracks found matching "${searchQuery}" for ${selectedMood} mood` :
                          `No tracks available for ${selectedMood} mood yet`
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Music Categories */}
          <Card className="glass-card" data-testid="music-categories">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <ListMusic className="w-5 h-5 text-secondary" />
                Browse by Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(recommendationsByMood).map(([mood, tracks]) => (
                  <div
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      "p-4 bg-white/40 rounded-lg cursor-pointer border border-white/30",
                      "hover:bg-white/60 hover:border-primary/50 transition-all duration-200",
                      "hover:scale-105",
                      selectedMood === mood && "ring-2 ring-primary ring-offset-2"
                    )}
                    data-testid={`mood-category-${mood}`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{getMoodEmoji(mood)}</div>
                      <h3 className="font-medium text-gray-800 capitalize">{mood}</h3>
                      <p className="text-sm text-gray-600">
                        {tracks.length} track{tracks.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits of Music Therapy */}
          <Card className="glass-card" data-testid="music-benefits">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Sparkles className="w-5 h-5 text-accent" />
                Benefits of Music Therapy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-600">
                <div className="text-center space-y-2">
                  <Heart className="w-8 h-8 mx-auto text-red-500" />
                  <h4 className="font-medium text-gray-800">Emotional Regulation</h4>
                  <p className="text-sm">Music helps process and regulate emotions naturally</p>
                </div>
                <div className="text-center space-y-2">
                  <Volume2 className="w-8 h-8 mx-auto text-blue-500" />
                  <h4 className="font-medium text-gray-800">Stress Reduction</h4>
                  <p className="text-sm">Calming melodies lower cortisol and anxiety levels</p>
                </div>
                <div className="text-center space-y-2">
                  <Music className="w-8 h-8 mx-auto text-green-500" />
                  <h4 className="font-medium text-gray-800">Mood Enhancement</h4>
                  <p className="text-sm">Upbeat music releases endorphins and dopamine</p>
                </div>
                <div className="text-center space-y-2">
                  <Headphones className="w-8 h-8 mx-auto text-purple-500" />
                  <h4 className="font-medium text-gray-800">Focus & Memory</h4>
                  <p className="text-sm">Certain rhythms improve concentration and recall</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
