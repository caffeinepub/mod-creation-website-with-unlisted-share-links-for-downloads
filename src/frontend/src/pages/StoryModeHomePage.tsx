import { Link } from '@tanstack/react-router';
import { useListStoryModes } from '../hooks/useQueries';
import RequireAuth from '../components/auth/RequireAuth';
import StoryModeSectionLayout from '../components/story/StoryModeSectionLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Loader2, Play, Edit } from 'lucide-react';

function StoryModeHomeContent() {
  const { data: stories, isLoading } = useListStoryModes();

  return (
    <StoryModeSectionLayout
      title="Story Mode"
      description="Create and manage interactive story experiences"
      action={
        <Button asChild size="lg">
          <Link to="/story-mode/edit/$storyId" params={{ storyId: 'new' }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Story
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-story" />
          <p className="mt-4 text-muted-foreground">Loading stories...</p>
        </div>
      ) : stories && stories.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <Card key={story.id} className="hover:border-story/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg truncate">{story.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm line-clamp-2">
                      {story.description}
                    </CardDescription>
                  </div>
                  <BookOpen className="h-5 w-5 text-story flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-story/30 text-story">
                    {story.chapters.length} chapter(s)
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1" size="sm">
                    <Link to="/story-mode/play/$storyId" params={{ storyId: story.id }}>
                      <Play className="h-3 w-3 mr-2" />
                      Play
                    </Link>
                  </Button>
                  <Button asChild variant="default" className="flex-1" size="sm">
                    <Link to="/story-mode/edit/$storyId" params={{ storyId: story.id }}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-story/30">
          <CardContent className="py-12 text-center space-y-4">
            <BookOpen className="h-12 w-12 mx-auto text-story" />
            <div>
              <h3 className="font-semibold">No stories yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first interactive story to get started
              </p>
            </div>
            <Button asChild>
              <Link to="/story-mode/edit/$storyId" params={{ storyId: 'new' }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Story
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </StoryModeSectionLayout>
  );
}

export default function StoryModeHomePage() {
  return (
    <RequireAuth>
      <StoryModeHomeContent />
    </RequireAuth>
  );
}
