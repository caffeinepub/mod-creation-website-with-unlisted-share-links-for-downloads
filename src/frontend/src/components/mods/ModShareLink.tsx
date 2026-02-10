import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Share2 } from 'lucide-react';
import { getShareUrl } from '../../lib/unlisted';
import { toast } from 'sonner';

interface ModShareLinkProps {
  unlistedId: string;
}

export default function ModShareLink({ unlistedId }: ModShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(unlistedId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4" />
          Share Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="share-url" className="text-xs text-muted-foreground">
            Anyone with this link can view and download your mod
          </Label>
          <div className="flex gap-2">
            <Input
              id="share-url"
              value={shareUrl}
              readOnly
              className="font-mono text-xs"
            />
            <Button onClick={handleCopy} variant="outline" size="icon">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
