import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useListModsForCreator, useGetCallerUserProfile } from '../hooks/useQueries';
import RequireAuth from '../components/auth/RequireAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Package, Loader2 } from 'lucide-react';

function DashboardContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal();
  const { data: mods, isLoading } = useListModsForCreator(principal!);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {userProfile?.name || 'Creator'}
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create New Mod
            </Link>
          </Button>
        </div>

        {/* Mods List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Mods</h2>
            {mods && mods.length > 0 && (
              <Badge variant="secondary">{mods.length} mod(s)</Badge>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Loading your mods...</p>
            </div>
          ) : mods && mods.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map((mod) => (
                <Card key={mod.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{mod.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Version {mod.version}
                        </CardDescription>
                      </div>
                      <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {mod.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{mod.files.length} file(s)</Badge>
                    </div>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link to="/manage/$modId" params={{ modId: mod.id }}>
                        <Settings className="h-3 w-3 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center space-y-4">
                <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">No mods yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first mod to get started
                  </p>
                </div>
                <Button asChild>
                  <Link to="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Mod
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
