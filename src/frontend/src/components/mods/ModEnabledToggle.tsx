import { useGetModEnabledState, useSetModEnabledState } from '../../hooks/useQueries';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ModEnabledToggleProps {
  modId: string;
}

export default function ModEnabledToggle({ modId }: ModEnabledToggleProps) {
  const { data: enabled, isLoading, error, refetch } = useGetModEnabledState(modId);
  const setEnabledMutation = useSetModEnabledState();

  const handleToggle = async (checked: boolean) => {
    try {
      await setEnabledMutation.mutateAsync({ modId, enabled: checked });
      toast.success(checked ? 'Mod enabled successfully' : 'Mod disabled successfully');
    } catch (error: any) {
      console.error('Failed to update mod state:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to change this mod');
      } else {
        toast.error('Failed to update mod state');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading mod status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load mod status. Please try again.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="space-y-0.5">
        <Label htmlFor="mod-enabled" className="text-base font-medium cursor-pointer">
          Mod Status
        </Label>
        <p className="text-sm text-muted-foreground">
          {enabled ? 'Your mod is currently enabled and accessible via the share link' : 'Your mod is currently disabled and cannot be accessed via the share link'}
        </p>
      </div>
      <Switch
        id="mod-enabled"
        checked={enabled ?? false}
        onCheckedChange={handleToggle}
        disabled={setEnabledMutation.isPending || enabled === undefined}
      />
    </div>
  );
}
