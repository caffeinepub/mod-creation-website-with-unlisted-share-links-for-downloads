import { useState } from 'react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import RequireAuth from '../components/auth/RequireAuth';
import { useGetMod, useUpdateModFiles } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2, Package, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import FileComposer from '../components/mods/FileComposer';
import ModShareLink from '../components/mods/ModShareLink';
import ModEnabledToggle from '../components/mods/ModEnabledToggle';
import { validateFileCount } from '../lib/fileLimits';
import type { ModFile } from '../lib/modTypes';

function ManageContent() {
  const { modId } = useParams({ from: '/manage/$modId' });
  const navigate = useNavigate();
  const { data: mod, isLoading } = useGetMod(modId);
  const updateFilesMutation = useUpdateModFiles();

  const [files, setFiles] = useState<ModFile[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Mod functionality is not available in the backend. This page cannot load mod data.
          </AlertDescription>
        </Alert>

        <Button asChild variant="outline">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
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
