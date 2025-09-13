import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MusicRecommendation } from "@shared/schema";

interface MusicPlayerProps {
  track?: MusicRecommendation;
  className?: string;
}

export default function MusicPlayer({ track, className }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45); // Mock progress

  if (!track) {
    return (
      <div className={cn("glass-card p-6 rounded-xl", className)} data-testid="music-player">
        <div className="text-center text-muted-foreground">
          <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a track to start playing</p>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const openSpotify = () => {
    if (track.spotifyUrl) {
      window.open(track.spotifyUrl, "_blank");
    }
  };

  const openYouTube = () => {
    if (track.youtubeUrl) {
      window.open(track.youtubeUrl, "_blank");
    }
  };

  return (
    <div className={cn("glass-card p-6 rounded-xl space-y-4", className)} data-testid="music-player">
      {/* Track Info */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground truncate" data-testid="track-title">
            {track.title}
          </h4>
          <p className="text-muted-foreground truncate" data-testid="track-artist">
            {track.artist}
          </p>
          <p className="text-xs text-muted-foreground" data-testid="track-genre">
            {track.genre}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1:23</span>
          <span>3:45</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button variant="ghost" size="icon" data-testid="previous-track">
          <SkipBack className="w-5 h-5" />
        </Button>
        
        <Button
          onClick={togglePlay}
          size="icon"
          className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          data-testid="play-pause-button"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" data-testid="next-track">
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* External Links */}
      <div className="flex justify-center space-x-3">
        {track.spotifyUrl && (
          <Button
            onClick={openSpotify}
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="spotify-link"
          >
            <ExternalLink className="w-4 h-4" />
            Spotify
          </Button>
        )}
        
        {track.youtubeUrl && (
          <Button
            onClick={openYouTube}
            variant="outline"
            size="sm"
            className="gap-2"
            data-testid="youtube-link"
          >
            <ExternalLink className="w-4 h-4" />
            YouTube
          </Button>
        )}
      </div>

      {/* Mood Indicator */}
      <div className="text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
          Perfect for {track.mood} mood
        </span>
      </div>
    </div>
  );
}
