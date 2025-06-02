
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, BookOpen, Users, Palette, Target } from 'lucide-react';

interface StoryConfig {
  theme: string;
  plot: string;
  characters: string;
  tone: string;
  audience: string;
}

interface StoryWizardProps {
  onStoryCreate: (config: StoryConfig) => void;
}

const StoryWizard: React.FC<StoryWizardProps> = ({ onStoryCreate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<StoryConfig>({
    theme: '',
    plot: '',
    characters: '',
    tone: '',
    audience: '',
  });

  const themes = [
    { value: 'fantasy', label: 'Fantasy', description: 'Magic, mythical creatures, and otherworldly adventures' },
    { value: 'sci-fi', label: 'Science Fiction', description: 'Future technology, space exploration, and scientific wonders' },
    { value: 'romance', label: 'Romance', description: 'Love stories, relationships, and emotional journeys' },
    { value: 'mystery', label: 'Mystery', description: 'Puzzles, secrets, and thrilling investigations' },
    { value: 'horror', label: 'Horror', description: 'Suspense, supernatural events, and chilling tales' },
    { value: 'historical', label: 'Historical', description: 'Past eras, real events, and period settings' },
    { value: 'adventure', label: 'Adventure', description: 'Exciting journeys, exploration, and daring quests' },
  ];

  const tones = [
    { value: 'lighthearted', label: 'Lighthearted', description: 'Fun, cheerful, and optimistic' },
    { value: 'dark', label: 'Dark', description: 'Serious, intense, and brooding' },
    { value: 'humorous', label: 'Humorous', description: 'Funny, witty, and entertaining' },
    { value: 'emotional', label: 'Emotional', description: 'Deep, touching, and heartfelt' },
    { value: 'suspenseful', label: 'Suspenseful', description: 'Tense, thrilling, and edge-of-your-seat' },
    { value: 'dreamy', label: 'Dreamy', description: 'Ethereal, poetic, and imaginative' },
  ];

  const audiences = [
    { value: 'children', label: 'Children (6-12)', description: 'Simple language, fun adventures' },
    { value: 'teens', label: 'Teenagers (13-17)', description: 'Coming-of-age themes, relatable characters' },
    { value: 'adults', label: 'Adults (18+)', description: 'Complex themes, mature content' },
    { value: 'family', label: 'Family-Friendly', description: 'Suitable for all ages' },
  ];

  const steps = [
    { number: 1, title: 'Choose Theme', icon: BookOpen },
    { number: 2, title: 'Create Plot', icon: Sparkles },
    { number: 3, title: 'Build Characters', icon: Users },
    { number: 4, title: 'Set Tone', icon: Palette },
    { number: 5, title: 'Select Audience', icon: Target },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onStoryCreate(config);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return config.theme !== '';
      case 2: return config.plot.trim().length > 10;
      case 3: return config.characters.trim().length > 5;
      case 4: return config.tone !== '';
      case 5: return config.audience !== '';
      default: return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${isActive ? 'border-mystical-400 bg-mystical-400/20 animate-glow' : ''}
                  ${isCompleted ? 'border-mystical-500 bg-mystical-500 text-white' : 'border-mystical-300/30'}
                  ${!isActive && !isCompleted ? 'border-mystical-300/30' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                    isCompleted ? 'bg-mystical-500' : 'bg-mystical-300/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="glass-morphism magical-shadow p-8 animate-fade-in-up">
        {/* Step 1: Theme Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gradient mb-2">Choose Your Story's Theme</h2>
              <p className="text-muted-foreground">What genre will transport your readers to another world?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <Card
                  key={theme.value}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    config.theme === theme.value 
                      ? 'border-mystical-400 bg-mystical-400/10 animate-glow' 
                      : 'hover:border-mystical-300/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, theme: theme.value }))}
                >
                  <h3 className="font-semibold text-lg mb-2">{theme.label}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Plot Creation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gradient mb-2">Craft Your Plot</h2>
              <p className="text-muted-foreground">Describe the basic storyline or provide keywords for your tale</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="plot" className="text-lg">Story Plot or Keywords</Label>
              <Textarea
                id="plot"
                placeholder="Describe your story idea... For example: 'A young wizard discovers an ancient prophecy that could save their magical kingdom from an eternal curse, but must first overcome their fear of dark magic.'"
                value={config.plot}
                onChange={(e) => setConfig(prev => ({ ...prev, plot: e.target.value }))}
                className="min-h-32 resize-none focus:ring-mystical-400"
                rows={6}
              />
              <p className="text-sm text-muted-foreground">
                {config.plot.length}/500 characters • Be as detailed or as brief as you like
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Character Building */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gradient mb-2">Bring Characters to Life</h2>
              <p className="text-muted-foreground">Describe the personalities, relationships, and roles of your characters</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="characters" className="text-lg">Character Details</Label>
              <Textarea
                id="characters"
                placeholder="Describe your characters... For example: 'Elena, a brave but insecure 16-year-old mage with a talent for healing magic. Marcus, her older brother and mentor, stern but caring. Queen Lyralei, the wise but mysterious ruler hiding a dark secret.'"
                value={config.characters}
                onChange={(e) => setConfig(prev => ({ ...prev, characters: e.target.value }))}
                className="min-h-32 resize-none focus:ring-mystical-400"
                rows={6}
              />
              <p className="text-sm text-muted-foreground">
                Include names, personalities, relationships, and roles in the story
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Tone Selection */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gradient mb-2">Set the Mood</h2>
              <p className="text-muted-foreground">What emotional atmosphere should your story evoke?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tones.map((tone) => (
                <Card
                  key={tone.value}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    config.tone === tone.value 
                      ? 'border-enchanted-400 bg-enchanted-400/10 animate-glow' 
                      : 'hover:border-enchanted-300/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, tone: tone.value }))}
                >
                  <h3 className="font-semibold text-lg mb-2">{tone.label}</h3>
                  <p className="text-sm text-muted-foreground">{tone.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Audience Selection */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-serif font-bold text-gradient mb-2">Choose Your Audience</h2>
              <p className="text-muted-foreground">Who will be enchanted by your story?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audiences.map((audience) => (
                <Card
                  key={audience.value}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    config.audience === audience.value 
                      ? 'border-ethereal-400 bg-ethereal-400/10 animate-glow' 
                      : 'hover:border-ethereal-300/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, audience: audience.value }))}
                >
                  <h3 className="font-semibold text-xl mb-2">{audience.label}</h3>
                  <p className="text-muted-foreground">{audience.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-mystical-300/20">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Step {currentStep} of 5</span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="px-6 bg-mystical-500 hover:bg-mystical-600"
          >
            {currentStep === 5 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Story
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StoryWizard;
