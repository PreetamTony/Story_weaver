import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-6 border-t border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>by Preetam Tony J</span>
            <span className="ml-2">✨</span>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Story Weaver. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
