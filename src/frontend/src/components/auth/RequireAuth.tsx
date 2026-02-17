import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin mx-auto border-4 border-primary border-t-transparent rounded-full" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              You need to sign in to access this content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                This feature requires authentication. Please sign in to continue.
              </AlertDescription>
            </Alert>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="w-full mt-4"
            >
              {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
