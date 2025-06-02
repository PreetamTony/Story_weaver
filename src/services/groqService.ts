
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface StoryConfig {
  theme: string;
  plot: string;
  characters: string;
  tone: string;
  audience: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class GroqService {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1-distill-llama-70b',
          messages: [
            {
              role: 'system',
              content: 'You are a creative storytelling AI that generates engaging, well-structured stories. Always respond with properly formatted content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to generate content. Please try again.');
    }
  }

  static async generateStoryTitle(config: StoryConfig): Promise<string> {
    const prompt = `Generate a captivating title for a ${config.theme} story with the following details:
    Plot: ${config.plot}
    Tone: ${config.tone}
    Audience: ${config.audience}
    
    Return only the title, nothing else.`;
    
    return await this.makeRequest(prompt);
  }

  static async generateChapter(
    config: StoryConfig, 
    chapterNumber: number, 
    chapterTitle: string,
    storyTitle: string,
    previousChapters?: string[]
  ): Promise<{ title: string; content: string }> {
    const contextText = previousChapters && previousChapters.length > 0 
      ? `\n\nPrevious chapters summary: ${previousChapters.join(' ')}`
      : '';

    const prompt = `Write Chapter ${chapterNumber} titled "${chapterTitle}" for the ${config.theme} story "${storyTitle}".

Story Details:
- Theme/Genre: ${config.theme}
- Plot: ${config.plot}
- Characters: ${config.characters}
- Tone: ${config.tone}
- Target Audience: ${config.audience}${contextText}

Requirements:
- Write 3-4 engaging paragraphs (400-600 words)
- Match the ${config.tone} tone perfectly
- Appropriate for ${config.audience} audience
- Include character development and plot progression
- Use vivid descriptions and dialogue
- End with a compelling hook for the next chapter

Return ONLY the chapter content, no extra formatting or labels.`;

    const content = await this.makeRequest(prompt);
    return {
      title: chapterTitle,
      content: content.trim()
    };
  }

  static getChapterTitles(theme: string): string[] {
    const titleTemplates = {
      fantasy: ['The Awakening', 'Shadows Stir', 'The Quest Begins', 'Trials of Magic', 'Destiny Fulfilled'],
      'sci-fi': ['First Contact', 'Beyond the Stars', 'The Discovery', 'Quantum Leap', 'New Horizons'],
      romance: ['Unexpected Encounter', 'Hearts Collide', 'Growing Closer', 'The Challenge', 'Love Conquers All'],
      mystery: ['The First Clue', 'Deeper Secrets', 'Pieces Align', 'The Truth Emerges', 'Case Closed'],
      horror: ['Something Stirring', 'The Terror Spreads', 'No Escape', 'Face the Darkness', 'Final Confrontation'],
      historical: ['Echoes of the Past', 'Winds of Change', 'The Turning Point', 'Against All Odds', 'Legacy'],
      adventure: ['The Journey Begins', 'Into the Unknown', 'Trials and Tribulations', 'The Final Push', 'Victory'],
    };

    return titleTemplates[theme as keyof typeof titleTemplates] || titleTemplates.adventure;
  }
}
