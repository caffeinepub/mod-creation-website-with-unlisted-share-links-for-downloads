import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Lock, Zap, Share2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src="/assets/generated/modforge-hero.dim_1200x600.png" 
              alt="ModForge Hero" 
              className="max-w-2xl w-full rounded-lg shadow-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Forge Your Mods,<br />Share Your Way
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and share video game mods with ease. No public directory, just direct unlisted links to your creations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signin">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signin">
                Sign In
              </Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Creation</h3>
              <p className="text-muted-foreground">
                Build mods through a simple step-by-step wizard. Upload files or create text configs right in your browser.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Unlisted Sharing</h3>
              <p className="text-muted-foreground">
                Share mods via private unlisted links. Only people with the link can access your creations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Full Control</h3>
              <p className="text-muted-foreground">
                Manage your mods from your personal dashboard. Edit metadata, update files, and control access.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign In', desc: 'Create your account with Internet Identity' },
              { step: '2', title: 'Select Game', desc: 'Choose a game or add a new one' },
              { step: '3', title: 'Build Mod', desc: 'Upload files or create text configs' },
              { step: '4', title: 'Share Link', desc: 'Get your unlisted share link' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Share2 className="h-4 w-4" />
            No public directory • Share via unlisted links only
          </div>
          <h2 className="text-3xl font-bold">Ready to Start Modding?</h2>
          <Button size="lg" asChild>
            <Link to="/signin">
              Create Your First Mod
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
