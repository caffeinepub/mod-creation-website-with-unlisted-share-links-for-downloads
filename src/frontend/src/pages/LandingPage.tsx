import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Lock, Zap, Share2, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 md:space-y-6">
          <div className="flex justify-center">
            <img 
              src="/assets/generated/grylies-mods-hero.dim_1200x600.png" 
              alt="Grylie's mods hero" 
              className="max-w-full md:max-w-2xl w-full rounded-lg shadow-2xl"
            />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4">
            Forge Your Mods,<br />Share Your Way
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Create and share video game mods with ease. No public directory, just direct unlisted links to your creations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/signin">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/signin">
                Sign In
              </Link>
            </Button>
          </div>
        </section>

        {/* Mobile Bedrock CTA */}
        <section className="max-w-2xl mx-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg md:text-xl font-semibold">Open Local Minecraft Mods on Mobile</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Already have .mcpack or .mcaddon files on your phone? Open them directly in Minecraft Pocket Edition.
                  </p>
                  <Button variant="outline" asChild className="mt-2 w-full sm:w-auto">
                    <Link to="/open-bedrock">
                      Open Bedrock Mod Files
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Easy Creation</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Build mods through a simple step-by-step wizard. Upload files or create text configs right in your browser.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Unlisted Sharing</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Share mods via private unlisted links. Only people with the link can access your creations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 sm:col-span-2 md:col-span-1">
            <CardContent className="pt-6 space-y-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold">Full Control</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Manage your mods from your personal dashboard. Edit metadata, update files, and control access.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: '1', title: 'Sign In', desc: 'Create your account with Internet Identity' },
              { step: '2', title: 'Select Game', desc: 'Choose a game or add a new one' },
              { step: '3', title: 'Build Mod', desc: 'Upload files or create text configs' },
              { step: '4', title: 'Share Link', desc: 'Get your unlisted share link' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2 md:space-y-3">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-xl md:text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="text-sm md:text-base font-semibold">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4 md:space-y-6 py-8 md:py-12">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
            <Share2 className="h-3 w-3 md:h-4 md:w-4" />
            No public directory • Share via unlisted links only
          </div>
          <h2 className="text-2xl md:text-3xl font-bold px-4">Ready to Start Modding?</h2>
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link to="/signin">
              Create Your First Mod
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
