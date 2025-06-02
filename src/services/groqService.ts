
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface StoryConfig {
  theme: string;
  plot: string;
  characters: string;
  tone: string;
  audience: 'children' | 'young-adult' | 'adult';
}

export interface WordDefinition {
  word: string;
  definition: string;
  example: string;
  partOfSpeech: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class GroqService {
  private static cleanResponseText(text: string): string {
    // Remove <think> tags and their content
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    // Remove any remaining standalone think tags
    cleaned = cleaned.replace(/<\/?think>/g, '');
    
    // Clean up any double newlines that might result from the removal
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    return cleaned.trim();
  }

  private static getLanguageLevel(audience: string): string {
    switch (audience.toLowerCase()) {
      case 'children':
        return 'Use simple words and short sentences. Aim for a 6-8 year old reading level.';
      case 'young-adult':
        return 'Use clear language with some more complex vocabulary. Aim for a 12+ year old reading level.';
      default:
        return 'Use natural language appropriate for adult readers.';
    }
  }

  static async getWordDefinition(word: string, context?: string): Promise<WordDefinition> {
    // Basic input validation
    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      throw new Error('Please enter a valid word');
    }

    // Remove any surrounding quotes or special characters
    const cleanWord = word.replace(/[^\w\s]/g, '').trim().toLowerCase();
    
    if (cleanWord.split(/\s+/).length > 2) {
      throw new Error('Please enter a single word or short phrase (max 2 words)');
    }

    try {
      const prompt = `Provide a simple, child-friendly definition for the word or phrase "${cleanWord}"${context ? ` as used in this context: "${context}"` : ''}.
      
      If the word is a proper noun, name, or not a valid English word, explain this in a helpful way.
      
      Format your response as a JSON object with these exact keys:
      {
        "word": "the word or phrase being defined",
        "definition": "simple, clear, and child-friendly definition",
        "example": "an example sentence using the word",
        "partOfSpeech": "noun/verb/adjective/adverb/phrase/name"
      }`;

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
              content: 'You are a helpful dictionary assistant. Provide clear, simple definitions and examples.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 200,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = JSON.parse(data.choices[0]?.message?.content || '{}');
      return content as WordDefinition;
    } catch (error) {
      console.error('Error getting word definition:', error);
      throw new Error('Failed to get word definition. Please try again.');
    }
  }

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
              content: 'You are a creative storytelling AI that generates engaging, well-structured stories. Always respond with properly formatted content. Never include any internal reasoning, thinking, or meta-commentary in your responses. Only provide the direct output that should be shown to the user.'
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
      const content = data.choices[0]?.message?.content || '';
      return this.cleanResponseText(content);
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

    const isFinalChapter = chapterTitle.toLowerCase().includes('final') || chapterTitle.toLowerCase().includes('epilogue');
    
    const languageLevel = this.getLanguageLevel(config.audience);
    const audienceInstructions = config.audience === 'children' ? 
      '- Use simple words and short sentences\n' +
      '- Include some dialogue to make it engaging for children\n' +
      '- Use descriptive language that paints a clear picture\n' : '';

    const prompt = `Write Chapter ${chapterNumber} titled "${chapterTitle}" for the ${config.theme} story "${storyTitle}".

Story Details:
- Theme/Genre: ${config.theme}
- Plot: ${config.plot}
- Characters: ${config.characters}
- Tone: ${config.tone}
- Target Audience: ${config.audience} (${languageLevel})${contextText}

Requirements:
- Write 3-4 engaging paragraphs (400-600 words)
- Match the ${config.tone} tone perfectly
- ${languageLevel}
${audienceInstructions}- Include character development and plot progression
- Use vivid descriptions and dialogue
${isFinalChapter ? 
  '- Provide a satisfying conclusion that resolves the main plot points\n' + 
  '- Include a meaningful moral or lesson that fits the story naturally\n' + 
  '- End with a sense of closure while leaving room for the reader\'s imagination' : 
  '- End with a compelling hook for the next chapter'}

Return ONLY the chapter content, no extra formatting, labels, or internal reasoning.`;

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
