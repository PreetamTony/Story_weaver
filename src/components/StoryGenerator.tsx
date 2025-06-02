
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, BookOpen, Download, Share, Star } from 'lucide-react';

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

  // Simulate AI story generation
  const generateStory = async () => {
    setIsGenerating(true);
    
    // Generate story title
    const titles = {
      fantasy: ['The Enchanted Realm', 'Whispers of Magic', 'The Crystal Prophecy'],
      'sci-fi': ['Beyond the Stars', 'Quantum Destiny', 'The Last Signal'],
      romance: ['Hearts Entwined', 'Love\'s Journey', 'Eternal Promise'],
      mystery: ['The Hidden Truth', 'Shadows of Doubt', 'The Final Clue'],
      horror: ['The Darkness Within', 'Haunted Echoes', 'The Cursed Legacy'],
      historical: ['Echoes of Time', 'The Royal Secret', 'Winds of Change'],
      adventure: ['The Quest Begins', 'Brave New Worlds', 'Journey\'s End'],
    };
    
    const themeTitle = titles[config.theme as keyof typeof titles] || ['An Untold Story'];
    setStoryTitle(themeTitle[Math.floor(Math.random() * themeTitle.length)]);

    // Generate chapters with realistic delays
    const chapterTemplates = [
      {
        title: 'The Beginning',
        generateContent: () => `In the ${config.theme === 'fantasy' ? 'mystical kingdom of Aethermoor' : config.theme === 'sci-fi' ? 'year 2287 aboard the starship Odyssey' : 'quiet town of Millbrook'}, our story begins with an unexpected discovery.

${config.characters.split('.')[0] || 'Our protagonist'} had always believed life would follow a predictable path. But today, everything changed when ${config.theme === 'fantasy' ? 'a glowing artifact' : config.theme === 'sci-fi' ? 'an alien signal' : 'an old letter'} appeared, setting in motion events that would ${config.tone === 'dark' ? 'threaten everything they held dear' : 'transform their world forever'}.

The air was ${config.tone === 'dreamy' ? 'shimmering with possibility' : config.tone === 'suspenseful' ? 'thick with tension' : 'filled with anticipation'} as our hero took their first step into an adventure that would test their courage, challenge their beliefs, and ultimately reveal the true power that lay dormant within.

${config.plot.substring(0, 100)}... The journey was about to begin, and there would be no turning back.`
      },
      {
        title: 'The Challenge Emerges',
        generateContent: () => `The peaceful morning was shattered when the ${config.theme === 'fantasy' ? 'dark sorcerer\'s minions' : config.theme === 'sci-fi' ? 'alien invasion fleet' : 'unexpected antagonist'} made their presence known.

${config.characters.split('.')[1] || 'The mentor figure'} explained the gravity of the situation with ${config.tone === 'humorous' ? 'surprising wit despite the circumstances' : config.tone === 'emotional' ? 'tears glistening in their eyes' : 'stern determination'}. The stakes had never been higher.

Our heroes realized they would need to ${config.theme === 'fantasy' ? 'master ancient magic' : config.theme === 'sci-fi' ? 'decode alien technology' : 'uncover hidden truths'} if they hoped to succeed. The path ahead was fraught with danger, but they had each other.

As the chapter closed, a new alliance was formed, secrets were revealed, and the true nature of their quest became clear. The real adventure was just beginning.`
      },
      {
        title: 'The Journey Deepens',
        generateContent: () => `Through ${config.theme === 'fantasy' ? 'enchanted forests and treacherous mountains' : config.theme === 'sci-fi' ? 'distant galaxies and hostile planets' : 'hidden passages and forgotten places'}, our heroes pressed onward.

The trials they faced tested not only their ${config.theme === 'fantasy' ? 'magical abilities' : config.theme === 'sci-fi' ? 'technological skills' : 'determination'} but also their bonds of friendship. ${config.tone === 'emotional' ? 'Tears were shed, hearts were opened, and true feelings were revealed' : config.tone === 'suspenseful' ? 'Danger lurked around every corner, and trust became their most valuable weapon' : 'Laughter echoed through their adventures, lightening even the darkest moments'}.

${config.characters.split('.')[2] || 'A key character'} proved their worth in an unexpected way, showing that true strength comes from ${config.tone === 'lighthearted' ? 'believing in yourself and your friends' : config.tone === 'dark' ? 'confronting your deepest fears' : 'the courage to do what\'s right'}.

The climax was approaching, and everything they had learned would soon be put to the ultimate test.`
      },
      {
        title: 'The Final Confrontation',
        generateContent: () => `The moment of truth had arrived. In the ${config.theme === 'fantasy' ? 'crystal chamber where ancient magic converged' : config.theme === 'sci-fi' ? 'control room of the alien mothership' : 'heart of the mystery\'s origin'}, our heroes faced their greatest challenge.

The antagonist revealed their ${config.tone === 'dark' ? 'terrible plan that would doom them all' : config.tone === 'emotional' ? 'tragic backstory that explained their actions' : 'surprising connection to our heroes'}. Battle was inevitable.

Using everything they had learned, our protagonists ${config.theme === 'fantasy' ? 'channeled powers they never knew they possessed' : config.theme === 'sci-fi' ? 'activated technology beyond their wildest dreams' : 'solved the puzzle that had eluded everyone before them'}.

The confrontation was ${config.tone === 'suspenseful' ? 'edge-of-your-seat intense' : config.tone === 'emotional' ? 'heart-wrenching and beautiful' : 'filled with unexpected twists'}. In the end, it wasn\'t just strength that won the day, but the power of ${config.audience === 'children' ? 'friendship and believing in yourself' : config.audience === 'teens' ? 'growing up and finding your place in the world' : 'love, sacrifice, and the bonds that unite us all'}.`
      },
      {
        title: 'A New Beginning',
        generateContent: () => `As the dust settled and peace returned to ${config.theme === 'fantasy' ? 'the magical realm' : config.theme === 'sci-fi' ? 'the galaxy' : 'their world'}, our heroes reflected on their incredible journey.

They had grown from ${config.audience === 'children' ? 'ordinary kids into brave heroes' : config.audience === 'teens' ? 'uncertain teenagers into confident young adults' : 'unlikely allies into a family bound by experience'}.

The ${config.theme === 'fantasy' ? 'magical artifact' : config.theme === 'sci-fi' ? 'alien technology' : 'mystery\'s solution'} had been ${config.tone === 'dark' ? 'contained, though its shadow would always linger' : config.tone === 'lighthearted' ? 'resolved with celebration and joy' : 'resolved, bringing hope to all'}.

As they looked toward the future, our heroes knew that while this adventure had ended, their bond would last forever. ${config.tone === 'dreamy' ? 'And in the distance, new adventures shimmered like stars, waiting to be discovered' : config.tone === 'emotional' ? 'They had found not just victory, but themselves' : 'The world was safe, but more importantly, they had found their true home in each other'}.

The end was really just the beginning.`
      }
    ];

    for (let i = 0; i < chapterTemplates.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const template = chapterTemplates[i];
      const newChapter: Chapter = {
        number: i + 1,
        title: template.title,
        content: template.generateContent()
      };
      setChapters(prev => [...prev, newChapter]);
    }

    setIsGenerating(false);
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapter Navigation */}
        <Card className="glass-morphism magical-shadow p-4 h-fit">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-serif text-xl font-bold text-gradient">{storyTitle}</h3>
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
                  <span className="text-sm">Weaving magic...</span>
                </div>
              )}
            </div>
            
            {chapters.length > 0 && (
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
                  The magic is flowing... Your personalized tale is being crafted with care.
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
