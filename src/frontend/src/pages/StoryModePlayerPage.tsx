import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useGetStoryMode } from '../hooks/useQueries';
import RequireAuth from '../components/auth/RequireAuth';
import StoryModeSectionLayout from '../components/story/StoryModeSectionLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { ensureQuoted, stripQuotes } from '../lib/dialogue';
import { getPresetById } from '../lib/voiceAtmospherePresets';

function StoryModePlayerContent() {
  const { storyId } = useParams({ from: '/story-mode/play/$storyId' });
  const { data: story, isLoading, error } = useGetStoryMode(storyId);
  const { isAvailable: speechAvailable, isSpeaking, speak, stop } = useSpeechSynthesis();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  if (isLoading) {
    return (
      <StoryModeSectionLayout title="Loading..." description="">
        <div className="text-center py-12">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-story border-t-transparent rounded-full" />
        </div>
      </StoryModeSectionLayout>
    );
  }

  if (error || !story) {
    return (
      <StoryModeSectionLayout title="Story Not Found" description="">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The story could not be loaded. It may not exist or you may not have permission to view it.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/story-mode">Back to Stories</Link>
        </Button>
      </StoryModeSectionLayout>
    );
  }

  const currentChapter = story.chapters[currentChapterIndex];
  const currentScene = currentChapter?.scenes[currentSceneIndex];

  const hasNextScene = currentChapter && currentSceneIndex < currentChapter.scenes.length - 1;
  const hasNextChapter = currentChapterIndex < story.chapters.length - 1;
  const hasPrevScene = currentSceneIndex > 0;
  const hasPrevChapter = currentChapterIndex > 0;

  const handleNext = () => {
    if (hasNextScene) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else if (hasNextChapter) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentSceneIndex(0);
    }
  };

  const handlePrev = () => {
    if (hasPrevScene) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    } else if (hasPrevChapter) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      const prevChapter = story.chapters[currentChapterIndex - 1];
      setCurrentSceneIndex(Math.max(0, prevChapter.scenes.length - 1));
    }
  };

  const handlePlayDialogue = (text: string, preset?: string) => {
    if (isSpeaking) {
      stop();
    } else {
      const cleanText = stripQuotes(text);
      const presetData = preset ? getPresetById(preset) : undefined;
      const options = presetData ? {
        rate: presetData.rate,
        pitch: presetData.pitch,
        volume: presetData.volume,
      } : undefined;
      speak(cleanText, options);
    }
  };

  if (!currentChapter || !currentScene) {
    return (
      <StoryModeSectionLayout title={story.title} description={story.description}>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>This story has no scenes to display.</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/story-mode">Back to Stories</Link>
        </Button>
      </StoryModeSectionLayout>
    );
  }

  return (
    <StoryModeSectionLayout
      title={story.title}
      description={story.description}
      action={
        <Button asChild variant="outline">
          <Link to="/story-mode">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {(story.characterDescription || story.interactionCapabilities) && (
          <Card className="border-story/20 bg-story/5">
            <CardHeader>
              <CardTitle className="text-story text-base">Story Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {story.characterDescription && (
                <div>
                  <p className="text-sm font-medium text-story mb-1">Game Description</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{story.characterDescription}</p>
                </div>
              )}
              {story.interactionCapabilities && (
                <>
                  {story.characterDescription && <Separator className="bg-story/20" />}
                  <div>
                    <p className="text-sm font-medium text-story mb-1">Interaction & Capabilities</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{story.interactionCapabilities}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-story/30 text-story">
            Chapter {currentChapterIndex + 1} of {story.chapters.length}
          </Badge>
          <Badge variant="outline" className="border-story/30 text-story">
            Scene {currentSceneIndex + 1} of {currentChapter.scenes.length}
          </Badge>
        </div>

        <Card className="border-story/30">
          <CardHeader>
            <CardTitle className="text-story">{currentChapter.title}</CardTitle>
            <CardDescription>{currentScene.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentScene.content && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{currentScene.content}</p>
              </div>
            )}

            {currentScene.voiceOver && (
              <div className="bg-story/5 border border-story/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-story">Dialogue</p>
                  {currentScene.audioRecording ? (
                    <Badge variant="outline" className="border-story/30 text-story text-xs">
                      Recorded Voice
                    </Badge>
                  ) : speechAvailable ? (
                    <Button
                      onClick={() => handlePlayDialogue(currentScene.voiceOver, currentScene.speechVoicePreset)}
                      size="sm"
                      variant="ghost"
                      className="text-story hover:text-story"
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  ) : null}
                </div>
                
                {currentScene.audioRecording ? (
                  <audio
                    src={currentScene.audioRecording.getDirectURL()}
                    controls
                    className="w-full"
                  />
                ) : (
                  <>
                    <p className="text-foreground italic">{ensureQuoted(currentScene.voiceOver)}</p>
                    {!speechAvailable && (
                      <p className="text-xs text-muted-foreground">
                        Speech synthesis is not available in your browser
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {currentChapter.quests.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Active Quests</p>
                <div className="space-y-1">
                  {currentChapter.quests.map((quest) => (
                    <div key={Number(quest.id)} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-story">•</span>
                      <span>{quest.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between gap-4">
          <Button
            onClick={handlePrev}
            disabled={!hasPrevScene && !hasPrevChapter}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasNextScene && !hasNextChapter}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </StoryModeSectionLayout>
  );
}

export default function StoryModePlayerPage() {
  return (
    <RequireAuth>
      <StoryModePlayerContent />
    </RequireAuth>
  );
}
