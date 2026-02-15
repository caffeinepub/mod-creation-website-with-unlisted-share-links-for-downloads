import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';
import ProfileSetupModal from '../components/auth/ProfileSetupModal';

export default function SignInPage() {
  const { identity, login, isLoggingIn, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, userProfile, profileLoading, isFetched, navigate]);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl md:text-2xl">Welcome to Grylie's mods</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Sign in with Internet Identity to start creating and sharing mods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn || isAuthenticated}
              className="w-full"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Internet Identity is a secure, privacy-preserving authentication system
            </p>
          </CardContent>
        </Card>
      </div>

      <ProfileSetupModal open={showProfileSetup} />
    </div>
  );
}
