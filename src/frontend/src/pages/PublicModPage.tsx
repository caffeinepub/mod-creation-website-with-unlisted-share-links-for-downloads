import { useParams, Link } from '@tanstack/react-router';
import { useGetModByUnlistedId } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import type { ModFile } from '../lib/modTypes';

export default function PublicModPage() {
  const { unlistedId } = useParams({ from: '/mod/$unlistedId' });
  const { data: mod, isLoading, error } = useGetModByUnlistedId(unlistedId);

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
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
