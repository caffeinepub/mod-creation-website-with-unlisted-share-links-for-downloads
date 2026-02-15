import { useState } from 'react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetMod, useUpdateModFiles } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import FileComposer from '../components/mods/FileComposer';
import ModShareLink from '../components/mods/ModShareLink';
import ModEnabledToggle from '../components/mods/ModEnabledToggle';
import { validateFileCount } from '../lib/fileLimits';
import type { ModFile } from '../backend';

function ManageContent() {
  const { modId } = useParams({ from: '/manage/$modId' });
  const navigate = useNavigate();
  const { data: mod, isLoading } = useGetMod(modId);
  const updateFilesMutation = useUpdateModFiles();

  const [files, setFiles] = useState<ModFile[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useState(() => {
    if (mod) {
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
      await updateFilesMutation.mutateAsync({ modId, newFiles: files });
      setHasChanges(false);
      toast.success('Files updated successfully!');
    } catch (error: any) {
      console.error('Failed to update files:', error);
      toast.error(error.message || 'Failed to update files');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading mod...</p>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Mod not found</h2>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })} className="self-start sm:self-auto">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold truncate">{mod.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Manage your mod files and settings
            </p>
          </div>
        </div>

        {/* Mod Info */}
        <Card>
          <CardHeader>
            <CardTitle>Mod Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Game</p>
                <p className="text-base md:text-lg font-semibold">{mod.gameName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Version</p>
                <p className="text-base md:text-lg font-semibold">{mod.version}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm md:text-base mt-1">{mod.description}</p>
            </div>
            {mod.prompt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prompt</p>
                <p className="text-sm md:text-base mt-1 text-muted-foreground italic">{mod.prompt}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Link */}
        <Card>
          <CardHeader>
            <CardTitle>Share Link</CardTitle>
            <CardDescription>Anyone with this link can view and download your mod</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ModShareLink unlistedId={mod.unlistedId} />
            <ModEnabledToggle modId={mod.id} />
          </CardContent>
        </Card>

        {/* File Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Mod Files</CardTitle>
                <CardDescription>Upload or create new files for your mod</CardDescription>
              </div>
              <Badge variant="secondary">{files.length} file(s)</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileComposer files={files} onChange={handleFilesChange} />

            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={updateFilesMutation.isPending}
                size="lg"
                className="w-full sm:w-auto"
              >
                {updateFilesMutation.isPending ? (
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
      <ManageContent />
    </RequireAuth>
  );
}
