import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetStoryMode, useCreateStoryMode, useUpdateStoryMode } from '../hooks/useQueries';
import RequireAuth from '../components/auth/RequireAuth';
import StoryModeSectionLayout from '../components/story/StoryModeSectionLayout';
import CreateModSection from '../components/promo/CreateModSection';
import AdGateModal from '../components/ads/AdGateModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Trash2, AlertCircle, Volume2, VolumeX, Mic, Square, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import { generateUnlistedId } from '../lib/unlisted';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { ensureQuoted, stripQuotes } from '../lib/dialogue';
import { VOICE_ATMOSPHERE_PRESETS, getPresetById } from '../lib/voiceAtmospherePresets';
import { ExternalBlob } from '../backend';
import type { ChapterFormData, SceneFormData, QuestFormData } from '../lib/storyModeTypes';
import { createEmptyChapter, createEmptyQuest, createEmptyScene, convertToBackendChapter } from '../lib/storyModeTypes';

function StoryModeEditContent() {
  const { storyId } = useParams({ from: '/story-mode/edit/$storyId' });
  const navigate = useNavigate();
  const isNew = storyId === 'new';
  
  const { data: existingStory, isLoading: loadingStory } = useGetStoryMode(isNew ? '' : storyId);
  const createMutation = useCreateStoryMode();
  const updateMutation = useUpdateStoryMode();
  const { isAvailable: speechAvailable, isSpeaking, speak, stop } = useSpeechSynthesis();
  const audioRecorder = useAudioRecorder();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [interactionCapabilities, setInteractionCapabilities] = useState('');
  const [chapters, setChapters] = useState<ChapterFormData[]>([]);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [recordingSceneKey, setRecordingSceneKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showAdGate, setShowAdGate] = useState(false);

  useEffect(() => {
    if (existingStory && !isNew) {
      setTitle(existingStory.title);
      setDescription(existingStory.description);
      setCharacterDescription(existingStory.characterDescription || '');
      setInteractionCapabilities(existingStory.interactionCapabilities || '');
      setChapters(existingStory.chapters.map(ch => ({
        id: Number(ch.id),
        title: ch.title,
        quests: ch.quests.map(q => ({
          id: Number(q.id),
          title: q.title,
          description: q.description,
          isCompleted: q.isCompleted,
          unlistedId: q.unlistedId,
        })),
        scenes: ch.scenes.map(s => ({
          id: Number(s.id),
          title: s.title,
          content: s.content,
          voiceOver: s.voiceOver,
          hasDialogue: s.hasDialogue,
          voiceCoachingText: s.voiceCoachingText,
          context: s.context,
          audioRecording: s.audioRecording || null,
          speechVoicePreset: s.speechVoicePreset || 'normal',
        })),
        unlistedId: ch.unlistedId,
      })));
    } else if (isNew && chapters.length === 0) {
      setChapters([createEmptyChapter(1)]);
    }
  }, [existingStory, isNew]);

  const handleAddChapter = () => {
    const newId = chapters.length > 0 ? Math.max(...chapters.map(c => c.id)) + 1 : 1;
    setChapters([...chapters, createEmptyChapter(newId)]);
    setActiveChapterIndex(chapters.length);
  };

  const handleRemoveChapter = (index: number) => {
    if (chapters.length === 1) {
      toast.error('Cannot remove the last chapter');
      return;
    }
    const newChapters = chapters.filter((_, i) => i !== index);
    setChapters(newChapters);
    if (activeChapterIndex >= newChapters.length) {
      setActiveChapterIndex(Math.max(0, newChapters.length - 1));
    }
  };

  const handleUpdateChapter = (index: number, updates: Partial<ChapterFormData>) => {
    const newChapters = [...chapters];
    newChapters[index] = { ...newChapters[index], ...updates };
    setChapters(newChapters);
  };

  const handleAddQuest = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    const newId = chapter.quests.length > 0 ? Math.max(...chapter.quests.map(q => q.id)) + 1 : 1;
    handleUpdateChapter(chapterIndex, {
      quests: [...chapter.quests, createEmptyQuest(newId)],
    });
  };

  const handleRemoveQuest = (chapterIndex: number, questIndex: number) => {
    const chapter = chapters[chapterIndex];
    handleUpdateChapter(chapterIndex, {
      quests: chapter.quests.filter((_, i) => i !== questIndex),
    });
  };

  const handleUpdateQuest = (chapterIndex: number, questIndex: number, updates: Partial<QuestFormData>) => {
    const chapter = chapters[chapterIndex];
    const newQuests = [...chapter.quests];
    newQuests[questIndex] = { ...newQuests[questIndex], ...updates };
    handleUpdateChapter(chapterIndex, { quests: newQuests });
  };

  const handleAddScene = (chapterIndex: number) => {
    const chapter = chapters[chapterIndex];
    const newId = chapter.scenes.length > 0 ? Math.max(...chapter.scenes.map(s => s.id)) + 1 : 1;
    handleUpdateChapter(chapterIndex, {
      scenes: [...chapter.scenes, createEmptyScene(newId)],
    });
  };

  const handleRemoveScene = (chapterIndex: number, sceneIndex: number) => {
    const chapter = chapters[chapterIndex];
    handleUpdateChapter(chapterIndex, {
      scenes: chapter.scenes.filter((_, i) => i !== sceneIndex),
    });
  };

  const handleUpdateScene = (chapterIndex: number, sceneIndex: number, updates: Partial<SceneFormData>) => {
    const chapter = chapters[chapterIndex];
    const newScenes = [...chapter.scenes];
    newScenes[sceneIndex] = { ...newScenes[sceneIndex], ...updates };
    handleUpdateChapter(chapterIndex, { scenes: newScenes });
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

  const getSceneKey = (chapterIndex: number, sceneIndex: number) => {
    return `${chapterIndex}-${sceneIndex}`;
  };

  const handleStartRecording = async (chapterIndex: number, sceneIndex: number) => {
    const key = getSceneKey(chapterIndex, sceneIndex);
    setRecordingSceneKey(key);
    audioRecorder.clearRecording();
    await audioRecorder.startRecording();
  };

  const handleStopRecording = () => {
    audioRecorder.stopRecording();
  };

  const handleSaveRecording = async (chapterIndex: number, sceneIndex: number) => {
    if (!audioRecorder.audioBlob) {
      toast.error('No recording to save');
      return;
    }

    try {
      const arrayBuffer = await audioRecorder.audioBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes);

      handleUpdateScene(chapterIndex, sceneIndex, {
        audioRecording: blob,
      });

      setRecordingSceneKey(null);
      audioRecorder.clearRecording();
      toast.success('Recording saved');
    } catch (err) {
      toast.error('Failed to save recording');
    }
  };

  const handleCancelRecording = () => {
    setRecordingSceneKey(null);
    audioRecorder.clearRecording();
  };

  const handleRemoveRecording = (chapterIndex: number, sceneIndex: number) => {
    handleUpdateScene(chapterIndex, sceneIndex, {
      audioRecording: null,
    });
    toast.success('Recording removed');
  };

  const handleSave = async () => {
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    if (chapters.length === 0) {
      setError('At least one chapter is required');
      return;
    }

    try {
      const backendChapters = await Promise.all(
        chapters.map(ch => convertToBackendChapter(ch))
      );

      if (isNew) {
        const unlistedId = generateUnlistedId();
        await createMutation.mutateAsync({
          id: `story-${Date.now()}`,
          title,
          description,
          chapters: backendChapters,
          unlistedId,
          characterDescription,
          interactionCapabilities,
        });
      } else {
        await updateMutation.mutateAsync({
          id: storyId,
          title,
          description,
          chapters: backendChapters,
          characterDescription,
          interactionCapabilities,
        });
      }

      setShowAdGate(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save story');
      toast.error('Failed to save story');
    }
  };

  const handleAdComplete = () => {
    setShowAdGate(false);
    toast.success('Story saved successfully');
    navigate({ to: '/story-mode' });
  };

  if (loadingStory) {
    return (
      <StoryModeSectionLayout
        title="Loading..."
        description="Please wait"
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading story...</p>
        </div>
      </StoryModeSectionLayout>
    );
  }

  const activeChapter = chapters[activeChapterIndex];

  return (
    <StoryModeSectionLayout
      title={isNew ? 'Create Story' : 'Edit Story'}
      description={isNew ? 'Build your interactive story' : 'Update your story'}
    >
      <CreateModSection />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Story Details</CardTitle>
          <CardDescription>Basic information about your story</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your story"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="characterDescription">Game Description</Label>
            <Textarea
              id="characterDescription"
              value={characterDescription}
              onChange={(e) => setCharacterDescription(e.target.value)}
              placeholder="Describe the game world and setting"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interactionCapabilities">Interaction Capabilities</Label>
            <Textarea
              id="interactionCapabilities"
              value={interactionCapabilities}
              onChange={(e) => setInteractionCapabilities(e.target.value)}
              placeholder="Describe how players can interact with the story"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Chapters</CardTitle>
              <CardDescription>Organize your story into chapters</CardDescription>
            </div>
            <Button onClick={handleAddChapter} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChapterIndex.toString()} onValueChange={(v) => setActiveChapterIndex(parseInt(v))}>
            <TabsList className="w-full flex-wrap h-auto">
              {chapters.map((chapter, index) => (
                <TabsTrigger key={chapter.id} value={index.toString()} className="flex-1 min-w-[120px]">
                  {chapter.title || `Chapter ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>

            {chapters.map((chapter, chapterIndex) => (
              <TabsContent key={chapter.id} value={chapterIndex.toString()} className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Chapter {chapterIndex + 1}</h3>
                  {chapters.length > 1 && (
                    <Button
                      onClick={() => handleRemoveChapter(chapterIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Chapter
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Chapter Title</Label>
                  <Input
                    value={chapter.title}
                    onChange={(e) => handleUpdateChapter(chapterIndex, { title: e.target.value })}
                    placeholder="Enter chapter title"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Quests</Label>
                    <Button onClick={() => handleAddQuest(chapterIndex)} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Quest
                    </Button>
                  </div>

                  {chapter.quests.map((quest, questIndex) => (
                    <Card key={quest.id} className="border-story/30">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-story border-story">
                            Quest {questIndex + 1}
                          </Badge>
                          <Button
                            onClick={() => handleRemoveQuest(chapterIndex, questIndex)}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label>Quest Title</Label>
                          <Input
                            value={quest.title}
                            onChange={(e) => handleUpdateQuest(chapterIndex, questIndex, { title: e.target.value })}
                            placeholder="Enter quest title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Quest Description</Label>
                          <Textarea
                            value={quest.description}
                            onChange={(e) => handleUpdateQuest(chapterIndex, questIndex, { description: e.target.value })}
                            placeholder="Describe the quest"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Scenes</Label>
                    <Button onClick={() => handleAddScene(chapterIndex)} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Scene
                    </Button>
                  </div>

                  {chapter.scenes.map((scene, sceneIndex) => {
                    const sceneKey = getSceneKey(chapterIndex, sceneIndex);
                    const isRecording = recordingSceneKey === sceneKey;

                    return (
                      <Card key={scene.id} className="border-story/30">
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-story border-story">
                              Scene {sceneIndex + 1}
                            </Badge>
                            <Button
                              onClick={() => handleRemoveScene(chapterIndex, sceneIndex)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Scene Title</Label>
                            <Input
                              value={scene.title}
                              onChange={(e) => handleUpdateScene(chapterIndex, sceneIndex, { title: e.target.value })}
                              placeholder="Enter scene title"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Narration</Label>
                            <Textarea
                              value={scene.content}
                              onChange={(e) => handleUpdateScene(chapterIndex, sceneIndex, { content: e.target.value })}
                              placeholder="Scene narration"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Dialogue</Label>
                              {speechAvailable && scene.voiceOver && (
                                <Button
                                  onClick={() => handlePlayDialogue(scene.voiceOver, scene.speechVoicePreset)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                              )}
                            </div>
                            <Textarea
                              value={scene.voiceOver}
                              onChange={(e) => handleUpdateScene(chapterIndex, sceneIndex, { voiceOver: e.target.value })}
                              placeholder="Character dialogue (will be wrapped in quotes)"
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Voice Atmosphere</Label>
                            <Select
                              value={scene.speechVoicePreset || 'normal'}
                              onValueChange={(value) => handleUpdateScene(chapterIndex, sceneIndex, { speechVoicePreset: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {VOICE_ATMOSPHERE_PRESETS.map((preset) => (
                                  <SelectItem key={preset.id} value={preset.id}>
                                    {preset.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Audio Recording (Optional)</Label>
                            {scene.audioRecording ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-story border-story">
                                  Recording saved
                                </Badge>
                                <Button
                                  onClick={() => handleRemoveRecording(chapterIndex, sceneIndex)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : isRecording ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={handleStopRecording}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <Square className="h-4 w-4 mr-2" />
                                    Stop
                                  </Button>
                                  <span className="text-sm text-muted-foreground">
                                    Recording... {audioRecorder.recordingTime}s
                                  </span>
                                </div>
                                {audioRecorder.audioUrl && (
                                  <div className="space-y-2">
                                    <audio src={audioRecorder.audioUrl} controls className="w-full" />
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleSaveRecording(chapterIndex, sceneIndex)}
                                        size="sm"
                                      >
                                        Save Recording
                                      </Button>
                                      <Button
                                        onClick={handleCancelRecording}
                                        variant="outline"
                                        size="sm"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleStartRecording(chapterIndex, sceneIndex)}
                                variant="outline"
                                size="sm"
                              >
                                <Mic className="h-4 w-4 mr-2" />
                                Record Audio
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={createMutation.isPending || updateMutation.isPending}
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Story'}
        </Button>
      </div>

      <AdGateModal open={showAdGate} onComplete={handleAdComplete} />
    </StoryModeSectionLayout>
  );
}

export default function StoryModeEditPage() {
  return (
    <RequireAuth>
      <StoryModeEditContent />
    </RequireAuth>
  );
}
