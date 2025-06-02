import { useState, useRef, useEffect } from 'react';
import { Send, X, HelpCircle } from 'lucide-react';
import { GroqService, WordDefinition } from '@/services/groqService';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  isDefinition?: boolean;
  wordData?: WordDefinition;
}

export function WordHelperChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi there! I can help explain any words you find difficult. Just type a word and I\'ll tell you what it means!',
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    
    if (!userInput || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const definition = await GroqService.getWordDefinition(userInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Here's what "${userInput}" means:`,
        sender: 'bot',
        isDefinition: true,
        wordData: definition
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting definition:', error);
      
      let errorMessage = "I'm having trouble finding that word. Could you try a different one?";
      
      if (error instanceof Error) {
        if (error.message.includes('single word')) {
          errorMessage = "Please enter just one word or a short phrase (up to 2 words).";
        } else if (error.message.includes('valid word')) {
          errorMessage = "Please enter a word to look up. It should contain letters.";
        } else if (error.message.includes('not found') || error.message.includes('not a word')) {
          errorMessage = `I couldn't find "${userInput}" in the dictionary. It might be a name, place, or a less common word. Could you try a different word or check the spelling?`;
        }
      }
      
      const errorMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: 'bot',
        isDefinition: false
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-secondary px-4 py-3 flex justify-between items-center border-b border-border">
            <h3 className="font-semibold text-foreground">Word Helper</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-card">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-secondary text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.isDefinition && message.wordData && (
                      <div className="mt-2 p-3 bg-background/50 rounded-md text-sm text-foreground">
                        <div className="font-medium">{message.wordData.word} <span className="text-muted-foreground text-xs">({message.wordData.partOfSpeech})</span></div>
                        <p className="mt-1">{message.wordData.definition}</p>
                        {message.wordData.example && (
                          <p className="mt-2 text-muted-foreground italic">Example: {message.wordData.example}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground rounded-lg rounded-bl-none px-4 py-2 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type a word to look up..."
                className="flex-1 bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                disabled={isLoading}
                aria-label="Enter a word to look up"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Open word helper"
        >
          <HelpCircle size={24} />
        </button>
      )}
    </div>
  );
}
