import { useParams, Link } from '@tanstack/react-router';
import { useGetCharacterShowcase } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicCharacterShowcasePage() {
  const { unlistedId } = useParams({ from: '/character/$unlistedId' });
  const { data: showcase, isLoading, error } = useGetCharacterShowcase(unlistedId);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (showcase) {
      if (showcase.photo) {
        setMediaUrl(showcase.photo.getDirectURL());
      } else if (showcase.video) {
        setMediaUrl(showcase.video.getDirectURL());
      }
    }
  }, [showcase]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-showcase border-t-transparent rounded-full" />
          <p className="mt-4 text-muted-foreground">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !showcase) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Character not found. The link may be invalid or the character may have been removed.
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

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <Card className="border-showcase/30">
          <CardHeader>
            <CardTitle className="text-showcase">{showcase.title}</CardTitle>
            {showcase.author && (
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                by {showcase.author}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {mediaUrl && (
              <div className="space-y-3">
                {showcase.photo ? (
                  <img
                    src={mediaUrl}
                    alt={showcase.characterName}
                    className="w-full h-auto max-h-[600px] object-contain rounded-lg border border-showcase/20"
                  />
                ) : (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full h-auto max-h-[600px] rounded-lg border border-showcase/20"
                  />
                )}
                <p className="text-center text-xl font-semibold text-showcase">
                  {showcase.characterName}
                </p>
              </div>
            )}

            {showcase.description && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{showcase.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
