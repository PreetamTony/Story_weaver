
import React, { useState } from 'react';
import MagicalParticles from '@/components/MagicalParticles';
import StoryWizard from '@/components/StoryWizard';
import StoryGenerator from '@/components/StoryGenerator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, BookOpen, Star, Users } from 'lucide-react';

interface StoryConfig {
  theme: string;
  plot: string;
  characters: string;
  tone: string;
  audience: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'wizard' | 'story'>('landing');
  const [storyConfig, setStoryConfig] = useState<StoryConfig | null>(null);

  const handleStartStory = () => {
    setCurrentView('wizard');
  };

  const handleStoryCreate = (config: StoryConfig) => {
    setStoryConfig(config);
    setCurrentView('story');
  };

  const handleBackToWizard = () => {
    setCurrentView('wizard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setStoryConfig(null);
  };

  if (currentView === 'wizard') {
    return (
      <div className="min-h-screen relative">
        <MagicalParticles />
        <div className="relative z-10 py-8">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBackToLanding}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-5xl font-serif font-bold text-gradient mb-4">
              Story Creation Wizard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's weave your unique tale together, step by magical step
            </p>
          </div>
          <StoryWizard onStoryCreate={handleStoryCreate} />
        </div>
      </div>
    );
  }

  if (currentView === 'story' && storyConfig) {
    return (
      <div className="min-h-screen relative">
        <MagicalParticles />
        <div className="relative z-10 py-8">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBackToWizard}
              className="mb-4"
            >
              ← Back to Wizard
            </Button>
            <h1 className="text-5xl font-serif font-bold text-gradient mb-4">
              Your Story Awaits
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch as AI magic transforms your vision into an enchanting tale
            </p>
          </div>
          <StoryGenerator config={storyConfig} onBack={handleBackToWizard} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MagicalParticles />
      
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="animate-fade-in-up">
              <h1 className="text-7xl md:text-8xl font-serif font-bold text-gradient mb-8 leading-tight">
                Story Weaver
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-light">
                Where AI Magic Meets Your Imagination
              </p>
              <p className="text-lg text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Embark on a mystical journey of storytelling. Provide your vision, and watch as advanced AI 
                weaves personalized, multi-chapter tales with compelling characters, immersive worlds, 
                and narratives that enchant readers of every age.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-mystical-500 hover:bg-mystical-600 text-white px-8 py-4 text-lg animate-glow"
                onClick={handleStartStory}
              >
                <Sparkles className="mr-3 w-6 h-6" />
                Begin Your Story
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-mystical-300/50 hover:border-mystical-400 px-8 py-4 text-lg"
              >
                <BookOpen className="mr-3 w-6 h-6" />
                View Examples
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <Card className="glass-morphism magical-shadow p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-mystical-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-mystical-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gradient">AI-Powered Creation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Advanced AI models craft deeply personalized stories with compelling arcs, 
                    rich dialogues, and thematic consistency.
                  </p>
                </div>
              </Card>

              <Card className="glass-morphism magical-shadow p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-enchanted-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-enchanted-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gradient">Rich Characters</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bring characters to life with AI-generated portraits, backstories, 
                    and personality summaries that make them feel real.
                  </p>
                </div>
              </Card>

              <Card className="glass-morphism magical-shadow p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-ethereal-500/20 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-ethereal-400" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gradient">Immersive Worlds</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Explore detailed world-building with maps, location descriptions, 
                    and cultural lore that bring your story's universe to life.
                  </p>
                </div>
              </Card>
            </div>

            {/* Story Types */}
            <div className="mt-24">
              <h2 className="text-4xl font-serif font-bold text-gradient mb-12">Endless Possibilities Await</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { name: 'Fantasy', emoji: '🧙‍♀️', color: 'mystical' },
                  { name: 'Sci-Fi', emoji: '🚀', color: 'enchanted' },
                  { name: 'Romance', emoji: '💕', color: 'ethereal' },
                  { name: 'Mystery', emoji: '🔍', color: 'mystical' },
                  { name: 'Horror', emoji: '👻', color: 'enchanted' },
                  { name: 'Historical', emoji: '🏰', color: 'ethereal' },
                  { name: 'Adventure', emoji: '⚔️', color: 'mystical' },
                ].map((genre, index) => (
                  <Card 
                    key={genre.name} 
                    className={`glass-morphism p-4 text-center hover:scale-110 transition-all duration-300 cursor-pointer animate-fade-in-up border-${genre.color}-300/30 hover:border-${genre.color}-400`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-3xl mb-2">{genre.emoji}</div>
                    <div className="text-sm font-medium">{genre.name}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Star className="w-8 h-8 text-mystical-400/30" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-6 h-6 text-enchanted-400/30" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
          <BookOpen className="w-10 h-10 text-ethereal-400/30" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="w-7 h-7 text-mystical-400/30" />
        </div>
      </div>
    </div>
  );
};

export default Index;
