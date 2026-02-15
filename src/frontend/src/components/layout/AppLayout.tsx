import { Link } from '@tanstack/react-router';
import { Wrench } from 'lucide-react';
import { SiCoffeescript } from 'react-icons/si';
import ResponsiveHeaderNav from './ResponsiveHeaderNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'unknown-app';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity min-w-0">
              <img 
                src="/assets/generated/grylies-mods-logo.dim_256x256.png" 
                alt="Grylie's mods logo" 
                className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
              />
              <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                <Wrench className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                <span className="text-lg md:text-2xl font-bold tracking-tight truncate">Grylie's mods</span>
              </div>
            </Link>

            <ResponsiveHeaderNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()}. Built with <SiCoffeescript className="inline h-4 w-4 text-primary" /> using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-xs text-center md:text-right">
              Share mods via unlisted links • No public directory
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
