import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdPlacement from '../components/ads/AdPlacement';
import { Gamepad2, Zap, Users, Heart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to <span className="text-primary">Grylie's mods</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Create, share, and discover amazing game modifications. Build your own stories and showcase your characters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate({ to: '/signin' })}
                  size="lg"
                  className="text-base"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => navigate({ to: '/dashboard' })}
                  variant="outline"
                  size="lg"
                  className="text-base"
                >
                  Explore
                </Button>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/assets/generated/grylies-mods-hero.dim_1200x600.png"
                alt="Grylie's mods"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <AdPlacement />
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create and share your gaming content
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Gamepad2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Story Mode</CardTitle>
                <CardDescription>
                  Create interactive stories with chapters, quests, and scenes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Character Showcase</CardTitle>
                <CardDescription>
                  Share your characters with photos and videos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Easy to Use</CardTitle>
                <CardDescription>
                  Intuitive tools that make creation simple and fun
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Sign In</h3>
              <p className="text-muted-foreground">
                Create your account and set up your profile
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Create</h3>
              <p className="text-muted-foreground">
                Build your stories and showcase your characters
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Share</h3>
              <p className="text-muted-foreground">
                Share your creations with the community
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Join our community and start creating today
          </p>
          <Button
            onClick={() => navigate({ to: '/signin' })}
            size="lg"
            className="text-base"
          >
            Sign In Now
          </Button>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Grylie's mods. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
