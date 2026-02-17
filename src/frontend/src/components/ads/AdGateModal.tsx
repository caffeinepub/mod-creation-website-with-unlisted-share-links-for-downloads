import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useAdCountdown } from '../../hooks/useAdCountdown';

interface AdGateModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function AdGateModal({ open, onComplete }: AdGateModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { remainingSeconds, start } = useAdCountdown({
    duration: 60,
    onComplete,
  });

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
      start();
    }
  }, [open, start]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && remainingSeconds > 0) {
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-3xl border-ad/30"
        onEscapeKeyDown={(e) => {
          if (remainingSeconds > 0) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (remainingSeconds > 0) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (remainingSeconds > 0) {
            e.preventDefault();
          }
        }}
        showCloseButton={remainingSeconds === 0}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Please watch this advertisement</span>
            <Badge variant="outline" className="border-ad text-ad">
              {remainingSeconds}s remaining
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {remainingSeconds > 0
              ? 'You can continue after the advertisement finishes'
              : 'Thank you for watching!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {videoError ? (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2 p-4">
                <AlertCircle className="h-12 w-12 text-ad mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Advertisement video unavailable
                </p>
                <p className="text-xs text-muted-foreground">
                  Please wait {remainingSeconds} seconds to continue
                </p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src="/assets/ads/sample-60s-ad.mp4"
              className="w-full aspect-video rounded-lg bg-black"
              muted
              playsInline
              onError={() => setVideoError(true)}
            />
          )}

          {remainingSeconds === 0 && (
            <Button
              onClick={onComplete}
              className="w-full bg-ad hover:bg-ad/90 text-ad-foreground"
              size="lg"
            >
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
