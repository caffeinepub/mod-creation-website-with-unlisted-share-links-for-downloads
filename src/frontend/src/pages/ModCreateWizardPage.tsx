import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useCreateMod } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft, Gamepad2, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import FileComposer from '../components/mods/FileComposer';
import ModEditorForm from '../components/mods/ModEditorForm';
import ModShareLink from '../components/mods/ModShareLink';
import { generateUnlistedId } from '../lib/unlisted';
import { validateModTitle, validateGameName, validateModVersion, validateModDescription, validateModPrompt } from '../lib/validation';
import { validateFileCount } from '../lib/fileLimits';
import type { ModFile } from '../backend';

type Step = 'game' | 'details' | 'files' | 'success';

function ModCreateWizardContent() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('game');
  const [gameName, setGameName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [files, setFiles] = useState<ModFile[]>([]);
  const [createdUnlistedId, setCreatedUnlistedId] = useState('');

  const createMod = useCreateMod();

  const canProceedFromGame = () => {
    return validateGameName(gameName).valid;
  };

  const canProceedFromDetails = () => {
    return (
      validateModTitle(title).valid &&
      validateModVersion(version).valid &&
      validateModDescription(description).valid &&
      validateModPrompt(prompt).valid
    );
  };

  const canPublish = () => {
    return validateFileCount(files.length).valid;
  };

  const handlePublish = async () => {
    if (!canPublish()) {
      toast.error('Please add at least one file');
      return;
    }

    const modId = `${gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const unlistedId = generateUnlistedId();

    try {
      await createMod.mutateAsync({
        modId,
        title,
        description,
        prompt,
        version,
        gameName,
        files,
        unlistedId,
      });
      setCreatedUnlistedId(unlistedId);
      setStep('success');
      toast.success('Mod published successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish mod');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className={`flex items-center gap-2 ${step === 'game' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'game' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span>Game</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span>Details</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${step === 'files' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'files' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span>Files</span>
            </div>
          </div>
        )}

        {/* Step: Game Name */}
        {step === 'game' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Game Name
              </CardTitle>
              <CardDescription>
                Enter the name of the game this mod is for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="game-name">
                  Game Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="game-name"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Minecraft"
                />
                {gameName && !validateGameName(gameName).valid && (
                  <p className="text-xs text-destructive">{validateGameName(gameName).message}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep('details')} disabled={!canProceedFromGame()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Mod Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <ModEditorForm
              title={title}
              description={description}
              prompt={prompt}
              version={version}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onPromptChange={setPrompt}
              onVersionChange={setVersion}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('game')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep('files')} disabled={!canProceedFromDetails()}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Files */}
        {step === 'files' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mod Files</CardTitle>
                <CardDescription>
                  Upload files or create text files for your mod
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileComposer files={files} onChange={setFiles} />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('details')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handlePublish}
                disabled={!canPublish() || createMod.isPending}
              >
                {createMod.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Mod'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <Card className="border-primary/50">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Mod Published!</h2>
                <p className="text-muted-foreground mt-2">
                  Your mod has been successfully created. Share the link below with others.
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <ModShareLink unlistedId={createdUnlistedId} />
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>
                  Go to Dashboard
                </Button>
                <Button onClick={() => {
                  setStep('game');
                  setGameName('');
                  setTitle('');
                  setDescription('');
                  setPrompt('');
                  setVersion('1.0.0');
                  setFiles([]);
                  setCreatedUnlistedId('');
                }}>
                  Create Another Mod
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ModCreateWizardPage() {
  return (
    <RequireAuth>
      <ModCreateWizardContent />
    </RequireAuth>
  );
}
