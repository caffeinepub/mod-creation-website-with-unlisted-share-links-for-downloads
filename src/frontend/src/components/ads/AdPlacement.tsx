import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useAdCountdown } from '../../hooks/useAdCountdown';

export default function AdPlacement() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { remainingSeconds, start } = useAdCountdown({
    duration: 30,
    onComplete: () => {},
  });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
      start();
    }
  }, [start]);

  return (
    <Card className="border-ad/30 bg-ad/5">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-ad text-ad">
            Advertisement
          </Badge>
          <span className="text-sm text-muted-foreground">
            {remainingSeconds}s
          </span>
        </div>
        
        {videoError ? (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2 p-4">
              <AlertCircle className="h-8 w-8 text-ad mx-auto" />
              <p className="text-sm text-muted-foreground">
                Advertisement unavailable
              </p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src="/assets/ads/sample-30s-ad.mp4"
            className="w-full aspect-video rounded-lg bg-black"
            muted
            playsInline
            onError={() => setVideoError(true)}
          />
        )}
      </CardContent>
    </Card>
  );
}
