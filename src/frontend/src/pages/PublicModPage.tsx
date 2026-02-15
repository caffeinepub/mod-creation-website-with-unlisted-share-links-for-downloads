import { Link, useParams } from '@tanstack/react-router';
import { useGetModByUnlistedId } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, Share2, Package, Loader2, Info, Smartphone, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { shareUrl, shareFiles } from '../lib/webShare';
import { formatFileSize } from '../lib/fileLimits';
import type { ModFile } from '../backend';

export default function PublicModPage() {
  const { unlistedId } = useParams({ from: '/mod/$unlistedId' });
  const { data: mod, isLoading, error } = useGetModByUnlistedId(unlistedId);

  const handleDownloadFile = (file: ModFile) => {
    try {
      const blob = new Blob([new Uint8Array(file.content)], { type: file.contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${file.filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleShareFile = async (file: ModFile) => {
    try {
      const blob = new Blob([new Uint8Array(file.content)], { type: file.contentType });
      const fileObj = new File([blob], file.filename, { type: file.contentType });
      const success = await shareFiles([fileObj], mod?.title || 'Mod file');
      if (success) {
        toast.success('File shared successfully');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share file');
    }
  };

  const handleShareMod = async () => {
    const url = window.location.href;
    const success = await shareUrl(url, mod?.title || 'Check out this mod');
    if (success) {
      toast.success('Link shared successfully');
    }
  };

  const isMinecraftMod = mod?.gameName.toLowerCase().includes('minecraft');

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

  // Enhanced error detection for disabled mods
  if (error || !mod) {
    const errorMessage = error?.message || '';
    // Backend returns "Mod not found" for both missing and disabled mods
    const isModNotFound = errorMessage.includes('Mod not found');

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">
              Mod Unavailable
            </AlertTitle>
            <AlertDescription className="mt-2">
              {isModNotFound
                ? 'This mod is currently unavailable. It may have been disabled by its creator or the link may be invalid. Please check back later or contact the mod creator.'
                : 'Unable to load this mod. Please verify the link and try again.'}
            </AlertDescription>
          </Alert>
          <div className="text-center space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Unable to load the requested mod
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold break-words">{mod.title}</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                by {mod.creator.toString().slice(0, 8)}...
              </p>
            </div>
            <Button onClick={handleShareMod} variant="outline" size="lg" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{mod.gameName}</Badge>
            <Badge variant="outline">v{mod.version}</Badge>
            <Badge variant="outline">{mod.files.length} file(s)</Badge>
          </div>
        </div>

        {/* Minecraft Bedrock Helper */}
        {isMinecraftMod && (
          <Alert>
            <Smartphone className="h-4 w-4" />
            <AlertTitle>Installing on Console or Mobile?</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                For Xbox, PlayStation, or mobile devices, use our file opener tool to install mods directly.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link to="/open-bedrock">
                  Open Bedrock File Tool
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Mod</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base leading-relaxed">{mod.description}</p>
            {mod.prompt && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Creation Prompt</p>
                <p className="text-sm text-muted-foreground italic">{mod.prompt}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle>Mod Files</CardTitle>
            <CardDescription>Download individual files or share them directly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mod.files.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.contentType} • {formatFileSize(file.content.length)}
                    </p>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    <Button
                      onClick={() => handleDownloadFile(file)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-initial"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleShareFile(file)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-initial"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Installation Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Installation Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">For Desktop/PC:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Download the mod files using the buttons above</li>
                <li>Locate your game's mod folder</li>
                <li>Copy the downloaded files into the mod folder</li>
                <li>Launch the game and enable the mod</li>
              </ol>
            </div>
            {isMinecraftMod && (
              <div className="space-y-2 pt-3 border-t">
                <h4 className="font-medium">For Console/Mobile (Minecraft Bedrock):</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                  <li>Open this page on your device's browser</li>
                  <li>Use the "Open Bedrock File Tool" button above</li>
                  <li>Select and open the .mcpack or .mcaddon file</li>
                  <li>The mod will automatically import into Minecraft</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
