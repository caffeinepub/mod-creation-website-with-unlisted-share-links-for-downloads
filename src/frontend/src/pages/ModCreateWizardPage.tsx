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

type Step = 1 | 2 | 3 | 4;

interface ModFormData {
  gameName: string;
  title: string;
  description: string;
  prompt: string;
  version: string;
  files: ModFile[];
}

function CreateWizardContent() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<ModFormData>({
    gameName: '',
    title: '',
    description: '',
    prompt: '',
    version: '1.0.0',
    files: [],
  });
  const [unlistedId, setUnlistedId] = useState<string>('');

  const createModMutation = useCreateMod();

  const handleNext = () => {
    if (step === 1) {
      const validation = validateGameName(formData.gameName);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }
    }

    if (step === 2) {
      const titleValidation = validateModTitle(formData.title);
      if (!titleValidation.valid) {
        toast.error(titleValidation.message);
        return;
      }

      const descValidation = validateModDescription(formData.description);
      if (!descValidation.valid) {
        toast.error(descValidation.message);
        return;
      }

      const versionValidation = validateModVersion(formData.version);
      if (!versionValidation.valid) {
        toast.error(versionValidation.message);
        return;
      }

      const promptValidation = validateModPrompt(formData.prompt);
      if (!promptValidation.valid) {
        toast.error(promptValidation.message);
        return;
      }
    }

    if (step === 3) {
      const fileValidation = validateFileCount(formData.files.length);
      if (!fileValidation.valid) {
        toast.error(fileValidation.message);
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 4) as Step);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const handlePublish = async () => {
    const modId = `mod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newUnlistedId = generateUnlistedId();

    try {
      await createModMutation.mutateAsync({
        modId,
        title: formData.title,
        description: formData.description,
        prompt: formData.prompt,
        version: formData.version,
        gameName: formData.gameName,
        files: formData.files,
        unlistedId: newUnlistedId,
      });

      setUnlistedId(newUnlistedId);
      setStep(4);
      toast.success('Mod published successfully!');
    } catch (error: any) {
      console.error('Failed to create mod:', error);
      toast.error(error.message || 'Failed to create mod');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Select Game</CardTitle>
                  <CardDescription>Which game is this mod for?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  placeholder="e.g., Minecraft, Skyrim, Stardew Valley"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the name of the game this mod is for
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mod Details</CardTitle>
              <CardDescription>Provide information about your mod</CardDescription>
            </CardHeader>
            <CardContent>
              <ModEditorForm
                title={formData.title}
                description={formData.description}
                prompt={formData.prompt}
                version={formData.version}
                onTitleChange={(title) => setFormData({ ...formData, title })}
                onDescriptionChange={(description) => setFormData({ ...formData, description })}
                onPromptChange={(prompt) => setFormData({ ...formData, prompt })}
                onVersionChange={(version) => setFormData({ ...formData, version })}
              />
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Add your mod files (max 10 files, 2MB each)</CardDescription>
            </CardHeader>
            <CardContent>
              <FileComposer
                files={formData.files}
                onChange={(files) => setFormData({ ...formData, files })}
              />
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl md:text-2xl">Mod Published!</CardTitle>
              <CardDescription>Your mod is ready to share</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Share Link</Label>
                <ModShareLink unlistedId={unlistedId} />
                <p className="text-xs text-muted-foreground">
                  Share this link with anyone you want to give access to your mod
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="w-full sm:flex-1">
                  <a href={`/mod/${unlistedId}`} target="_blank" rel="noopener noreferrer">
                    View Mod Page
                  </a>
                </Button>
                <Button onClick={() => navigate({ to: '/dashboard' })} className="w-full sm:flex-1">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Progress Indicator */}
        {step < 4 && (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-colors ${
                    s === step
                      ? 'bg-primary text-primary-foreground'
                      : s < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-0.5 w-8 md:w-16 mx-1 md:mx-2 transition-colors ${
                      s < step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={handleNext} className="w-full sm:w-auto">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={createModMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createModMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Mod'
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModCreateWizardPage() {
  return (
    <RequireAuth>
      <CreateWizardContent />
    </RequireAuth>
  );
}
