import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Shield, Brain, Award, Sparkles, Target, BarChart3, Edit, Calendar } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen pt-16" data-testid="landing-page">
      {/* Hero Section */}
      <section className="aurora-gradient min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8 animate-float">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-800">
                  <div>Track your feelings.</div>
                  <div>Discover patterns.</div>
                  <div>Heal yourself.</div>
                </h1>
                <p className="text-xl text-gray-600 font-medium max-w-lg">
                  Your private AI-powered journaling companion that understands your emotional journey.
                </p>
              </div>
              
              <Link href="/journal">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-4 text-lg font-semibold glow-effect transition-all duration-300"
                  data-testid="start-journaling-button"
                >
                  Start Journaling
                </Button>
              </Link>
            </div>
            
            {/* Right side - Illustration */}
            <div className="relative">
              <div className="glass-card p-8 rounded-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Person journaling in peaceful setting" 
                  className="rounded-2xl shadow-xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl"></div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl aura-circle -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission/Vision/Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Purpose</h2>
            <p className="text-xl text-gray-600">Guided by empathy, innovation, and your well-being</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-center space-y-4">
                <Heart className="w-12 h-12 mx-auto text-accent" />
                <h3 className="text-xl font-bold text-gray-800">Mission</h3>
                <p className="text-gray-600">Empowering individuals to understand their emotional patterns through AI-driven insights and compassionate journaling.</p>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-secondary/10 to-accent/10">
              <div className="text-center space-y-4">
                <Eye className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="text-xl font-bold text-gray-800">Vision</h3>
                <p className="text-gray-600">A world where mental health support is accessible, private, and personalized for everyone's healing journey.</p>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-accent/10 to-primary/10">
              <div className="text-center space-y-4">
                <Shield className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-bold text-gray-800">Values</h3>
                <p className="text-gray-600">Privacy, empathy, innovation, and evidence-based approaches to mental wellness and emotional intelligence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 aurora-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for your mental wellness journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl hover:glow-effect transition-all duration-300">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-800">AI-Powered Sentiment Analysis</h3>
              <p className="text-gray-600">Advanced AI understands your emotions and provides personalized insights based on your writing patterns.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover:glow-effect transition-all duration-300">
              <BarChart3 className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-800">Mood Calendar & Visualization</h3>
              <p className="text-gray-600">Track your emotional patterns with beautiful graphs, calendars, and interactive mood visualizations.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover:glow-effect transition-all duration-300">
              <Sparkles className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-800">Personalized Prompts</h3>
              <p className="text-gray-600">AI-generated writing prompts tailored to your emotional journey and personal growth goals.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover:glow-effect transition-all duration-300">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-800">Privacy & Encryption</h3>
              <p className="text-gray-600">Your thoughts are protected with military-grade encryption and complete privacy protection.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover:glow-effect transition-all duration-300">
              <Award className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-800">Motivational Streaks & Badges</h3>
              <p className="text-gray-600">Stay motivated with achievement badges, streak tracking, and progress milestones.</p>
            </div>
            
            <div className="glass-card p-6 rounded-2xl hover:glow-effect transition-all duration-300">
              <Target className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-gray-800">Aura Visualization</h3>
              <p className="text-gray-600">Watch your emotional aura grow and change with your mood patterns and personal growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Experience SoulScript</h2>
            <p className="text-xl text-gray-600">Discover how each feature enhances your emotional well-being</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Dashboard Preview */}
            <Link href="/dashboard" className="group">
              <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-16 h-16 mx-auto text-primary group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold text-gray-800">Dashboard</h3>
                  <p className="text-gray-600">Track your emotional journey with comprehensive mood analytics and insights.</p>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-3 rounded-lg">
                      <div className="text-xs text-gray-600">Mood Trend</div>
                      <div className="h-8 bg-gradient-to-r from-primary/40 to-secondary/40 rounded mt-1"></div>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/20 to-accent/20 p-3 rounded-lg">
                      <div className="text-xs text-gray-600">7 Day Streak</div>
                      <div className="text-lg font-bold text-secondary mt-1">🔥</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Journal Preview */}
            <Link href="/journal" className="group">
              <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300">
                <div className="text-center space-y-4">
                  <Edit className="w-16 h-16 mx-auto text-secondary group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold text-gray-800">Journal</h3>
                  <p className="text-gray-600">Write in a beautiful, distraction-free environment with AI-powered insights.</p>
                  <div className="space-y-3 mt-6">
                    <div className="bg-gray-50 rounded-lg p-3 text-left">
                      <div className="text-xs text-gray-500 mb-1">Today's Entry</div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        <span className="text-lg">😊</span>
                        <span className="text-lg">😐</span>
                        <span className="text-lg">😢</span>
                      </div>
                      <div className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">AI Analyzing...</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Calendar Preview */}
            <Link href="/calendar" className="group">
              <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300">
                <div className="text-center space-y-4">
                  <Calendar className="w-16 h-16 mx-auto text-accent group-hover:animate-pulse" />
                  <h3 className="text-2xl font-bold text-gray-800">Calendar & Analytics</h3>
                  <p className="text-gray-600">Visualize your mood patterns and discover emotional insights over time.</p>
                  <div className="grid grid-cols-7 gap-1 mt-6">
                    {Array.from({ length: 14 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square rounded text-xs flex items-center justify-center text-white font-medium ${
                          i % 3 === 0 ? 'bg-green-400' : i % 3 === 1 ? 'bg-yellow-400' : 'bg-pink-400'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dark-aurora text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="@assets/logo_1757773447195.jpg" 
                  alt="SoulScript Logo" 
                  className="w-8 h-8 rounded"
                />
                <span className="text-xl font-bold">SoulScript</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your AI-powered mental health companion, designed with empathy and privacy at its core.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-secondary">Contact</h4>
              <div className="space-y-3 text-gray-300">
                <p className="hover:text-secondary transition-colors cursor-pointer">support@soulscript.ai</p>
                <p className="hover:text-secondary transition-colors cursor-pointer">1-800-SOUL-HELP</p>
                <p className="text-sm">24/7 Crisis Support Available</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-primary">Privacy & Security</h4>
              <div className="space-y-3 text-gray-300">
                <p className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Terms of Service</p>
                <p className="hover:text-primary transition-colors cursor-pointer">Data Protection</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-accent">Mental Health Resources</h4>
              <div className="space-y-3 text-gray-300">
                <p className="hover:text-accent transition-colors cursor-pointer">Crisis Hotlines</p>
                <p className="hover:text-accent transition-colors cursor-pointer">Professional Help</p>
                <p className="hover:text-accent transition-colors cursor-pointer">Wellness Tips</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-600 text-center">
            <p className="text-gray-400">
              &copy; 2024 SoulScript. Empowering mental wellness through technology. 
              <span className="block mt-2 text-sm">
                If you're in crisis, please reach out for immediate help: <strong>988 Suicide & Crisis Lifeline</strong>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
