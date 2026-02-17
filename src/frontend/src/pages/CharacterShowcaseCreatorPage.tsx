import { useState, useRef } from 'react';
import { useCreateCharacterShowcase, useListCharacterShowcases } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import RequireAuth from '../components/auth/RequireAuth';
import CreateModSection from '../components/promo/CreateModSection';
import AdGateModal from '../components/ads/AdGateModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { User, Upload, AlertCircle, Copy, Check, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { generateUnlistedId, getCharacterShareUrl } from '../lib/unlisted';
import { ExternalBlob } from '../backend';

function CharacterShowcaseCreatorContent() {
  const { identity } = useInternetIdentity();
  const { data: existingShowcases } = useListCharacterShowcases();
  const createMutation = useCreateCharacterShowcase();

  const [title, setTitle] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);
  const [pendingShareUrl, setPendingShareUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userShowcase = existingShowcases?.find(
    (s) => s.creator.toString() === identity?.getPrincipal().toString()
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? 'photo' : 'video');
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    setError('');
    setUploadProgress(0);

    if (!title.trim() || !characterName.trim() || !description.trim()) {
      setError('All fields are required');
      return;
    }

    if (!mediaFile) {
      setError('Please select a photo or video');
      return;
    }

    try {
      const arrayBuffer = await mediaFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      let blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const unlistedId = generateUnlistedId();

      await createMutation.mutateAsync({
        id: `showcase-${Date.now()}`,
        title,
        characterName,
        description,
        author: author || 'Anonymous',
        photo: mediaType === 'photo' ? blob : null,
        video: mediaType === 'video' ? blob : null,
        unlistedId,
      });

      const url = getCharacterShareUrl(unlistedId);
      setPendingShareUrl(url);
      setShowAdGate(true);
    } catch (err: any) {
      setError(err.message || 'Failed to publish character');
      toast.error('Failed to publish character');
    }
  };

  const handleAdComplete = () => {
    setShowAdGate(false);
    setShareUrl(pendingShareUrl);
    setPendingShareUrl('');
    toast.success(userShowcase ? 'Character updated successfully' : 'Character published successfully');
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <CreateModSection />

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-showcase">Character Showcase</h1>
          <p className="text-muted-foreground mt-1">
            {userShowcase ? 'Update your character post' : 'Share your character with the world'}
          </p>
        </div>

        {userShowcase && (
          <Alert className="border-showcase/30 bg-showcase/5">
            <User className="h-4 w-4 text-showcase" />
            <AlertDescription>
              You already have a character showcase. Publishing will replace your existing post.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {shareUrl && (
          <Card className="border-showcase/30 bg-showcase/5">
            <CardHeader>
              <CardTitle className="text-showcase">Character Published!</CardTitle>
              <CardDescription>Share this link with others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button onClick={handleCopyUrl} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
            <CardDescription>Only one character post per user is allowed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Hero Character"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="characterName">Character Name</Label>
              <Input
                id="characterName"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="e.g., Alex the Brave"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author (Optional)</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your character..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Character Media (Photo or Video)</Label>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {mediaFile ? 'Change Media' : 'Select Photo or Video'}
                </Button>

                {mediaPreview && (
                  <Card className="border-showcase/30">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {mediaType === 'photo' ? (
                            <ImageIcon className="h-4 w-4 text-showcase" />
                          ) : (
                            <VideoIcon className="h-4 w-4 text-showcase" />
                          )}
                          <span>Preview</span>
                        </div>
                        {mediaType === 'photo' ? (
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full h-auto max-h-96 object-contain rounded-lg border border-showcase/20"
                          />
                        ) : (
                          <video
                            src={mediaPreview}
                            controls
                            className="w-full h-auto max-h-96 rounded-lg border border-showcase/20"
                          />
                        )}
                        {characterName && (
                          <p className="text-center text-sm font-medium text-showcase mt-2">
                            {characterName}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <Label>Uploading...</Label>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
              </div>
            )}

            <Button
              onClick={handlePublish}
              disabled={createMutation.isPending}
              className="w-full"
              size="lg"
            >
              {createMutation.isPending ? 'Publishing...' : userShowcase ? 'Update Character' : 'Publish Character'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AdGateModal open={showAdGate} onComplete={handleAdComplete} />
    </div>
  );
}

export default function CharacterShowcaseCreatorPage() {
  return (
    <RequireAuth>
      <CharacterShowcaseCreatorContent />
    </RequireAuth>
  );
}
