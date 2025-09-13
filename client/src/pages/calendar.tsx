import { useQuery } from "@tanstack/react-query";
import { getMoodData, getAnalyticsInsights } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  BarChart3, 
  Brain,
  Moon,
  Sun,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: moodData, isLoading: moodLoading } = useQuery({
    queryKey: ["/api/mood-data"],
    queryFn: () => getMoodData(),
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/analytics/insights"],
    queryFn: () => getAnalyticsInsights(),
  });

  const isLoading = moodLoading || insightsLoading;

  // Get mood for specific date
  const getMoodForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return moodData?.find(data => data.date === dateStr);
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0 || days.length < 35) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      
      if (days.length >= 42) break; // Max 6 weeks
    }
    
    return days;
  };

  // Get mood color class
  const getMoodColorClass = (mood: string, intensity: number) => {
    const alpha = Math.max(0.3, intensity / 5);
    const baseClasses = "calendar-day relative hover:scale-110 transition-transform cursor-pointer rounded-lg";
    
    switch (mood) {
      case "happy":
        return `${baseClasses} bg-green-400`;
      case "excited":
        return `${baseClasses} bg-yellow-400`;
      case "calm":
        return `${baseClasses} bg-blue-400`;
      case "neutral":
        return `${baseClasses} bg-gray-400`;
      case "anxious":
        return `${baseClasses} bg-purple-400`;
      case "sad":
        return `${baseClasses} bg-blue-600`;
      case "angry":
        return `${baseClasses} bg-red-400`;
      default:
        return `${baseClasses} bg-gray-200`;
    }
  };

  // Prepare mood distribution data
  const moodDistribution = moodData?.reduce((acc, data) => {
    acc[data.mood] = (acc[data.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const pieData = Object.entries(moodDistribution).map(([mood, count]) => ({
    name: mood,
    value: count,
    color: {
      happy: "#10B981",
      excited: "#F59E0B",
      calm: "#3B82F6",
      neutral: "#6B7280",
      anxious: "#8B5CF6",
      sad: "#1E40AF",
      angry: "#EF4444",
    }[mood] || "#6B7280"
  }));

  // Prepare trend data (last 30 days)
  const trendData = moodData?.slice(0, 30).reverse().map(data => ({
    date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: data.intensity,
    fullDate: data.date,
  })) || [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16" data-testid="calendar-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 mx-auto" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16" data-testid="calendar-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" data-testid="calendar-title">
              Your Emotional Journey
            </h1>
            <p className="text-xl text-gray-600">
              Visualize patterns and insights from your mood tracking
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <Card className="glass-card shadow-lg" data-testid="mood-calendar">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Mood Calendar
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateMonth('prev')}
                        data-testid="prev-month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold min-w-32 text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigateMonth('next')}
                        data-testid="next-month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {getCalendarDays().map((date, index) => {
                      const moodEntry = getMoodForDate(date);
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <div
                          key={index}
                          className={cn(
                            "aspect-square flex items-center justify-center text-sm font-medium rounded-lg",
                            !isCurrentMonth && "opacity-30",
                            isToday && "ring-2 ring-primary ring-offset-2",
                            moodEntry 
                              ? getMoodColorClass(moodEntry.mood, moodEntry.intensity)
                              : "bg-gray-100 hover:bg-gray-200"
                          )}
                          data-testid={`calendar-day-${date.getDate()}`}
                          title={moodEntry ? `${moodEntry.mood} (${moodEntry.intensity}/5)` : undefined}
                        >
                          <span className={moodEntry ? "text-white font-bold" : "text-gray-600"}>
                            {date.getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-6 flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded"></div>
                      <span>Positive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded"></div>
                      <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span>Negative</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mood Trends */}
              <Card className="glass-card shadow-lg mt-8" data-testid="mood-trends">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    Mood Trends (Last 30 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6B7280" 
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis domain={[1, 5]} stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(label) => `Date: ${label}`}
                          formatter={(value) => [`${value}/5`, 'Mood Intensity']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#9F7AEA" 
                          strokeWidth={3}
                          dot={{ fill: '#9F7AEA', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start journaling to see your mood trends!</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with analytics */}
            <div className="space-y-6">
              {/* Mood Distribution */}
              <Card className="glass-card shadow-lg" data-testid="mood-distribution">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Mood Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="space-y-2 mt-4">
                        {pieData.map((entry) => (
                          <div key={entry.name} className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="capitalize">{entry.name}</span>
                            </div>
                            <span className="font-medium">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No mood data yet</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="glass-card shadow-lg" data-testid="ai-insights-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {insights?.insights && insights.insights.length > 0 ? (
                    <div className="space-y-4">
                      {insights.insights.map((insight: string, index: number) => {
                        const getInsightIcon = (insight: string) => {
                          if (insight.toLowerCase().includes('day')) return <Moon className="w-4 h-4 text-blue-500" />;
                          if (insight.toLowerCase().includes('sleep')) return <Moon className="w-4 h-4 text-indigo-500" />;
                          if (insight.toLowerCase().includes('friend') || insight.toLowerCase().includes('social')) return <Users className="w-4 h-4 text-green-500" />;
                          return <Sun className="w-4 h-4 text-yellow-500" />;
                        };

                        return (
                          <div key={index} className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                              {getInsightIcon(insight)}
                              <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Keep journaling to unlock AI insights!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Summary */}
              <Card className="glass-card shadow-lg" data-testid="weekly-summary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="w-5 h-5 text-secondary" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {moodData && moodData.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Entries this week:</span>
                        <span className="font-medium">
                          {moodData.filter(data => {
                            const entryDate = new Date(data.date);
                            const oneWeekAgo = new Date();
                            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                            return entryDate >= oneWeekAgo;
                          }).length}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average mood:</span>
                        <span className="font-medium">
                          {moodData.length > 0 ? 
                            (moodData.slice(0, 7).reduce((acc, data) => acc + data.intensity, 0) / Math.min(7, moodData.length)).toFixed(1)
                            : 'N/A'
                          }/5
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Most common mood:</span>
                        <span className="font-medium capitalize">
                          {Object.entries(moodDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No data for this week yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
