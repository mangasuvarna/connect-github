import { useQuery } from "@tanstack/react-query";
import { getUserStats, getJournalEntries, getMoodData, getAnalyticsInsights } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Calendar, 
  Edit, 
  Award, 
  Music, 
  Gamepad2, 
  Brain,
  Heart,
  Flame,
  Star,
  Diamond,
  Bird
} from "lucide-react";
import AuraCircle from "@/components/aura-circle";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: () => getUserStats(),
  });

  const { data: recentEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ["/api/journal-entries"],
    queryFn: () => getJournalEntries(),
  });

  const { data: moodData, isLoading: moodLoading } = useQuery({
    queryKey: ["/api/mood-data"],
    queryFn: () => getMoodData(),
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/analytics/insights"],
    queryFn: () => getAnalyticsInsights(),
  });

  const isLoading = statsLoading || entriesLoading || moodLoading || insightsLoading;

  // Transform mood data for chart
  const chartData = moodData?.slice(0, 7).reverse().map((data, index) => ({
    day: new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: data.intensity,
    date: data.date,
  })) || [];

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      happy: "😊",
      excited: "🤩",
      calm: "😌",
      neutral: "😐",
      anxious: "😰",
      sad: "😢",
      angry: "😠",
    };
    return emojis[mood] || "😐";
  };

  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, JSX.Element> = {
      first_entry: <Star className="w-6 h-6" />,
      streak_keeper: <Flame className="w-6 h-6" />,
      positivity: <Heart className="w-6 h-6" />,
      resilience: <Diamond className="w-6 h-6" />,
      calm_mind: <Bird className="w-6 h-6" />,
      week_warrior: <Award className="w-6 h-6" />,
      month_master: <TrendingUp className="w-6 h-6" />,
      introspection_expert: <Brain className="w-6 h-6" />,
    };
    return icons[badge] || <Star className="w-6 h-6" />;
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      first_entry: "from-green-400 to-emerald-500",
      streak_keeper: "from-orange-400 to-red-500",
      positivity: "from-pink-400 to-rose-500",
      resilience: "from-purple-400 to-indigo-500",
      calm_mind: "from-blue-400 to-cyan-500",
      week_warrior: "from-yellow-400 to-orange-500",
      month_master: "from-violet-400 to-purple-500",
      introspection_expert: "from-teal-400 to-blue-500",
    };
    return colors[badge] || "from-gray-400 to-slate-500";
  };

  const currentMood = moodData?.[0]?.mood || "neutral";
  const auraLevel = stats?.progress?.auraLevel || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen dark-aurora pt-24 pb-16" data-testid="dashboard-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-48 w-48 rounded-full mx-auto" />
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-aurora pt-24 pb-16" data-testid="dashboard-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-white space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" data-testid="dashboard-title">
              Your Emotional Dashboard
            </h1>
            <p className="text-xl text-gray-300">
              Track your journey and celebrate your progress
            </p>
          </div>

          {/* Aura Meter */}
          <div className="text-center mb-12">
            <div className="space-y-4">
              <AuraCircle 
                mood={currentMood} 
                size="xl" 
                intensity={auraLevel}
                className="mx-auto"
              >
                <div className="text-center text-white">
                  <div className="text-xl font-bold mb-1">Your Aura</div>
                  <div className="text-3xl">{getMoodEmoji(currentMood)}</div>
                  <div className="text-sm opacity-75">Level {auraLevel}</div>
                </div>
              </AuraCircle>
              <p className="text-gray-300 text-lg" data-testid="aura-description">
                Your emotional energy is glowing bright today! ✨
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card-dark border-white/10" data-testid="most-frequent-mood">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl mb-2">{getMoodEmoji(stats?.stats?.mostFrequentMood || "happy")}</div>
                <div className="text-2xl font-bold text-white">{stats?.stats?.mostFrequentMood || "Happy"}</div>
                <p className="text-gray-300">Most Frequent Mood</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card-dark border-white/10" data-testid="streak-counter">
              <CardContent className="pt-6 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold text-white">{stats?.progress?.streak || 0}</div>
                <p className="text-gray-300">Day Streak</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card-dark border-white/10" data-testid="entries-this-week">
              <CardContent className="pt-6 text-center">
                <Edit className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <div className="text-2xl font-bold text-white">{stats?.stats?.entriesThisWeek || 0}</div>
                <p className="text-gray-300">Entries This Week</p>
              </CardContent>
            </Card>
          </div>

          {/* Mood Trend Graph */}
          <Card className="glass-card-dark border-white/10 mb-8" data-testid="mood-trend-chart">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Mood Trends (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis domain={[1, 5]} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(26, 26, 46, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="url(#gradient)" 
                      strokeWidth={3}
                      dot={{ fill: '#9F7AEA', strokeWidth: 2, r: 6 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9F7AEA" />
                        <stop offset="100%" stopColor="#4FD1C7" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start journaling to see your mood trends!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges Showcase */}
          <Card className="glass-card-dark border-white/10 mb-8" data-testid="badges-showcase">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.progress?.badges && stats.progress.badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stats.progress.badges.map((badge: string) => (
                    <div 
                      key={badge}
                      className={`text-center p-4 rounded-xl bg-gradient-to-br ${getBadgeColor(badge)} aura-glow`}
                      data-testid={`badge-${badge}`}
                    >
                      <div className="text-white mb-2">
                        {getBadgeIcon(badge)}
                      </div>
                      <p className="text-xs text-white font-medium capitalize">
                        {badge.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Complete activities to earn your first badge!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass-card-dark border-white/10" data-testid="music-suggestions">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-secondary" />
                  Music for Your Mood
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    Based on your {currentMood} energy today
                  </p>
                  <p className="text-white font-medium mb-3">
                    🎵 Curated playlists waiting for you
                  </p>
                  <Link href="/music">
                    <Button 
                      variant="outline" 
                      className="w-full border-secondary/50 text-secondary hover:bg-secondary/10"
                      data-testid="view-music-button"
                    >
                      Explore Music →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-dark border-white/10" data-testid="wellness-activities">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-accent" />
                  Wellness Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    Try breathing exercises or mood games
                  </p>
                  <p className="text-white font-medium mb-3">
                    🎮 Interactive wellness tools ready
                  </p>
                  <Link href="/games">
                    <Button 
                      variant="outline" 
                      className="w-full border-accent/50 text-accent hover:bg-accent/10"
                      data-testid="explore-games-button"
                    >
                      Play Games →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          {insights?.insights && insights.insights.length > 0 && (
            <Card className="glass-card-dark border-white/10" data-testid="ai-insights">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {insights.insights.map((insight: string, index: number) => (
                    <div 
                      key={index}
                      className="bg-black/20 rounded-lg p-4"
                      data-testid={`insight-${index}`}
                    >
                      <p className="text-gray-300 text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/journal">
              <Card className="glass-card-dark border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Edit className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold text-white mb-2">Write New Entry</h3>
                  <p className="text-gray-300">Share your thoughts and feelings</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/calendar">
              <Card className="glass-card-dark border-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary" />
                  <h3 className="text-xl font-bold text-white mb-2">View Calendar</h3>
                  <p className="text-gray-300">Explore your mood patterns</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
