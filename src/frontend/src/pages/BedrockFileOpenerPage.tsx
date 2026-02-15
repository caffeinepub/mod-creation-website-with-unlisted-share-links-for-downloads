import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Smartphone, FileUp, Share2, Download, AlertCircle, Info, X } from 'lucide-react';
import { canShareFiles, shareFiles } from '../lib/webShare';
import { validateBedrockFiles, getMaxFileSizeDisplay } from '../lib/bedrockFiles';
import { formatFileSize, MAX_FILE_COUNT } from '../lib/fileLimits';
import { toast } from 'sonner';

export default function BedrockFileOpenerPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const supportsFileSharing = canShareFiles();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setError(null);

    if (files.length === 0) return;

    const validation = validateBedrockFiles(files);
    if (!validation.valid) {
      setError(validation.message || 'Invalid files selected');
      return;
    }

    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleShareToMinecraft = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    if (!supportsFileSharing) {
      toast.error('Your browser doesn\'t support file sharing');
      return;
    }

    setIsSharing(true);
    try {
      const success = await shareFiles(
        selectedFiles,
        'Minecraft Bedrock Mod',
        'Open with Minecraft Pocket Edition'
      );

      if (success) {
        toast.success('Files shared! Select Minecraft Pocket Edition to open.');
      } else {
        toast.info('Share cancelled');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share files');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${file.name}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
            <h1 className="text-2xl md:text-3xl font-bold">Open Bedrock Mod Files</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Select .mcpack or .mcaddon files from your device to open them in Minecraft Pocket Edition
          </p>
        </div>

        {/* File Picker Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <FileUp className="h-5 w-5" />
              Select Mod Files
            </CardTitle>
            <CardDescription className="text-sm">
              Choose one or more .mcpack or .mcaddon files (max {MAX_FILE_COUNT} files, {getMaxFileSizeDisplay()} each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-input" className="sr-only">
                Select Bedrock mod files
              </Label>
              <Input
                id="file-input"
                type="file"
                accept=".mcpack,.mcaddon"
                multiple
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid File</AlertTitle>
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {selectedFiles.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Selected Files ({selectedFiles.length})</Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium truncate">{file.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Card */}
        {selectedFiles.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Share2 className="h-5 w-5" />
                Open in Minecraft
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportsFileSharing ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Tap the button below to share these files to Minecraft Pocket Edition. Your device will show a share menu where you can select Minecraft.
                  </p>
                  <Button
                    onClick={handleShareToMinecraft}
                    disabled={isSharing}
                    size="lg"
                    className="w-full"
                  >
                    {isSharing ? (
                      <>Opening...</>
                    ) : (
                      <>
                        <Share2 className="h-5 w-5 mr-2" />
                        Open / Share to Minecraft (Pocket Edition)
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>File Sharing Not Supported</AlertTitle>
                    <AlertDescription className="text-sm">
                      Your browser doesn't support sharing files directly. Download the files below and open them from your Files app, then choose "Open with Minecraft".
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleDownloadFile(file)}
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download {file.name}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Info className="h-5 w-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm md:text-base font-medium mb-1">For Mobile Users:</h4>
                <ol className="list-decimal list-inside space-y-1 text-xs md:text-sm text-muted-foreground">
                  <li>Select your .mcpack or .mcaddon files using the file picker above</li>
                  <li>Tap "Open / Share to Minecraft (Pocket Edition)"</li>
                  <li>Choose Minecraft from the share menu that appears</li>
                  <li>The mod will automatically import into Minecraft</li>
                </ol>
              </div>

              <div>
                <h4 className="text-sm md:text-base font-medium mb-1">Supported File Types:</h4>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">.mcpack</Badge>
                  <Badge variant="secondary">.mcaddon</Badge>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Console Users</AlertTitle>
                <AlertDescription className="text-xs md:text-sm">
                  Xbox and PlayStation consoles cannot open mods directly from websites. For console mod support, check if your game has a built-in mod browser (like Minecraft Bedrock on Xbox).
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
