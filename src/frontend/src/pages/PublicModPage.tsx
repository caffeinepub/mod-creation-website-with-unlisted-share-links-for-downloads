import { useParams } from '@tanstack/react-router';
import { useGetModByUnlistedId } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatFileSize } from '../lib/fileLimits';

export default function PublicModPage() {
  const { unlistedId } = useParams({ from: '/mod/$unlistedId' });
  const { data: mod, isLoading, isError } = useGetModByUnlistedId(unlistedId);

  const handleDownload = (filename: string, content: Uint8Array, contentType: string) => {
    const blob = new Blob([new Uint8Array(content)], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (isError || !mod) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Mod Not Found</AlertTitle>
            <AlertDescription>
              The mod you're looking for doesn't exist or the link is invalid.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{mod.title}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">Version {mod.version}</Badge>
            <Badge variant="outline">{mod.files.length} file(s)</Badge>
          </div>
        </div>

        {/* Game Name */}
        <Card>
          <CardHeader>
            <CardTitle>Game</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{mod.gameName}</p>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{mod.description}</p>
          </CardContent>
        </Card>

        {/* Prompt */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{mod.prompt}</p>
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>
              Download individual files or all files at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mod.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.contentType} • {formatFileSize(file.content.length)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file.filename, file.content, file.contentType)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <Button
              className="w-full"
              onClick={() => {
                mod.files.forEach((file) => {
                  handleDownload(file.filename, file.content, file.contentType);
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download All Files
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <Alert>
          <AlertDescription className="text-sm">
            This mod was shared via an unlisted link. Only people with this link can access it.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
