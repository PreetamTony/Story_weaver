
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, BookOpen, Download, Share, Star, AlertCircle } from 'lucide-react';
import { GroqService } from '@/services/groqService';

interface StoryConfig {
  theme: string;
  plot: string;
  characters: string;
  tone: string;
  audience: string;
}

interface Chapter {
  number: number;
  title: string;
  content: string;
}

interface StoryGeneratorProps {
  config: StoryConfig;
  onBack: () => void;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ config, onBack }) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatingChapter, setGeneratingChapter] = useState<number | null>(null);

  const generateStory = async () => {
    setIsGenerating(true);
    setError(null);
    setChapters([]);
    
    try {
      console.log('Generating story title...');
      const title = await GroqService.generateStoryTitle(config);
      setStoryTitle(title);

      const chapterTitles = GroqService.getChapterTitles(config.theme);
      const generatedChapters: Chapter[] = [];

      for (let i = 0; i < chapterTitles.length; i++) {
        setGeneratingChapter(i + 1);
        console.log(`Generating chapter ${i + 1}: ${chapterTitles[i]}`);
        
        try {
          const previousContent = generatedChapters.map(ch => ch.content.substring(0, 200));
          const chapterData = await GroqService.generateChapter(
            config, 
            i + 1, 
            chapterTitles[i], 
            title,
            previousContent
          );

          const newChapter: Chapter = {
            number: i + 1,
            title: chapterData.title,
            content: chapterData.content
          };

          generatedChapters.push(newChapter);
          setChapters([...generatedChapters]);
          
          // Small delay between chapters for better UX
          if (i < chapterTitles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (chapterError) {
          console.error(`Error generating chapter ${i + 1}:`, chapterError);
          // Continue with next chapter even if one fails
          const fallbackChapter: Chapter = {
            number: i + 1,
            title: chapterTitles[i],
            content: `Chapter ${i + 1} is being regenerated. Please try refreshing or creating a new story.`
          };
          generatedChapters.push(fallbackChapter);
          setChapters([...generatedChapters]);
        }
      }
    } catch (error) {
      console.error('Story generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate story');
    } finally {
      setIsGenerating(false);
      setGeneratingChapter(null);
    }
  };

  useEffect(() => {
    generateStory();
  }, [config]);

  const handleExport = () => {
    const fullStory = chapters.map(chapter => 
      `Chapter ${chapter.number}: ${chapter.title}\n\n${chapter.content}\n\n`
    ).join('');
    
    const blob = new Blob([`${storyTitle}\n\n${fullStory}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${storyTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRetry = () => {
    generateStory();
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="glass-morphism magical-shadow p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
            <h3 className="text-2xl font-serif font-bold text-red-400">Generation Failed</h3>
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} className="bg-mystical-500 hover:bg-mystical-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Wizard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapter Navigation */}
        <Card className="glass-morphism magical-shadow p-4 h-fit">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-serif text-xl font-bold text-gradient">
                {storyTitle || 'Generating Title...'}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">{config.theme} • {config.tone}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <Button
                  key={chapter.number}
                  variant={currentChapter === index ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-left ${
                    currentChapter === index ? 'bg-mystical-500' : ''
                  }`}
                  onClick={() => setCurrentChapter(index)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Chapter {chapter.number}
                </Button>
              ))}
              
              {isGenerating && (
                <div className="flex items-center justify-center py-4">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm">
                    {generatingChapter 
                      ? `Creating Chapter ${generatingChapter}...` 
                      : 'Weaving magic...'
                    }
                  </span>
                </div>
              )}
            </div>
            
            {chapters.length > 0 && !isGenerating && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Story
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Share className="w-4 h-4 mr-2" />
                    Share Story
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={onBack}>
                    <Star className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Story Content */}
        <div className="lg:col-span-3">
          {chapters[currentChapter] && (
            <Card className="glass-morphism magical-shadow p-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-4xl font-serif font-bold chapter-title mb-2">
                    Chapter {chapters[currentChapter].number}
                  </h1>
                  <h2 className="text-2xl font-serif text-mystical-300">
                    {chapters[currentChapter].title}
                  </h2>
                </div>
                
                <Separator />
                
                <ScrollArea className="h-[600px] pr-4">
                  <div className="story-text text-lg leading-relaxed whitespace-pre-line">
                    {chapters[currentChapter].content}
                  </div>
                </ScrollArea>
                
                {/* Chapter Navigation */}
                <div className="flex justify-between pt-4 border-t border-mystical-300/20">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                    disabled={currentChapter === 0}
                  >
                    Previous Chapter
                  </Button>
                  
                  <span className="flex items-center text-sm text-muted-foreground">
                    {currentChapter + 1} of {chapters.length}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
                    disabled={currentChapter === chapters.length - 1 || isGenerating}
                  >
                    Next Chapter
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {chapters.length === 0 && isGenerating && (
            <Card className="glass-morphism magical-shadow p-8">
              <div className="text-center space-y-4">
                <div className="animate-spin w-12 h-12 mx-auto">
                  <Sparkles className="w-12 h-12 text-mystical-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gradient">Weaving Your Story</h3>
                <p className="text-muted-foreground">
                  {generatingChapter 
                    ? `Creating Chapter ${generatingChapter} with AI magic...` 
                    : 'The magic is flowing... Your personalized tale is being crafted with care.'
                  }
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
