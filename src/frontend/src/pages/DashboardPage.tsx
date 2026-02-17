import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import RequireAuth from '../components/auth/RequireAuth';
import AdPlacement from '../components/ads/AdPlacement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users } from 'lucide-react';

function DashboardContent() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1">
            What would you like to create today?
          </p>
        </div>

        <AdPlacement />

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-story/30 hover:border-story/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/story-mode' })}>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-story mb-2" />
              <CardTitle className="text-story">Story Mode</CardTitle>
              <CardDescription>
                Create interactive stories with chapters, quests, and scenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-story hover:bg-story/90 text-story-foreground">
                Go to Story Mode
              </Button>
            </CardContent>
          </Card>

          <Card className="border-showcase/30 hover:border-showcase/50 transition-colors cursor-pointer" onClick={() => navigate({ to: '/character-showcase' })}>
            <CardHeader>
              <Users className="h-10 w-10 text-showcase mb-2" />
              <CardTitle className="text-showcase">Character Showcase</CardTitle>
              <CardDescription>
                Share your characters with photos and videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-showcase hover:bg-showcase/90 text-showcase-foreground">
                Go to Character Showcase
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
