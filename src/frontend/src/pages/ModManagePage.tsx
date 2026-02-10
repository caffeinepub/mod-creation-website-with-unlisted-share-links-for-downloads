import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetMod, useUpdateModFiles } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import FileComposer from '../components/mods/FileComposer';
import ModShareLink from '../components/mods/ModShareLink';
import { validateFileCount } from '../lib/fileLimits';
import type { ModFile } from '../backend';

function ModManageContent() {
  const { modId } = useParams({ from: '/manage/$modId' });
  const navigate = useNavigate();
  const { data: mod, isLoading } = useGetMod(modId);
  const updateFiles = useUpdateModFiles();

  const [files, setFiles] = useState<ModFile[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize files when mod loads
  useState(() => {
    if (mod && files.length === 0) {
      setFiles(mod.files);
    }
  });

  const handleFilesChange = (newFiles: ModFile[]) => {
    setFiles(newFiles);
    setHasChanges(true);
  };

  const handleSave = async () => {
    const validation = validateFileCount(files.length);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    try {
      await updateFiles.mutateAsync({ modId, newFiles: files });
      toast.success('Files updated successfully!');
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update files');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading mod...</p>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Mod not found</p>
          <Button className="mt-4" onClick={() => navigate({ to: '/dashboard' })}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{mod.title}</h1>
            <p className="text-muted-foreground mt-1">Manage your mod</p>
          </div>
        </div>

        {/* Mod Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mod Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium">{mod.version}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Files</p>
                <Badge variant="secondary">{mod.files.length} file(s)</Badge>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Game</p>
              <p className="text-sm">{mod.gameName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{mod.description}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Prompt</p>
              <p className="text-sm whitespace-pre-wrap">{mod.prompt}</p>
            </div>
          </CardContent>
        </Card>

        {/* Share Link */}
        <ModShareLink unlistedId={mod.unlistedId} />

        {/* File Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Files</CardTitle>
            <CardDescription>
              Add, remove, or update mod files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileComposer files={files} onChange={handleFilesChange} />

            {hasChanges && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={updateFiles.isPending}>
                  {updateFiles.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ModManagePage() {
  return (
    <RequireAuth>
      <ModManageContent />
    </RequireAuth>
  );
}
