import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LogIn, LogOut, LayoutDashboard, Menu, BookOpen, User } from 'lucide-react';
import { useState } from 'react';

export default function ResponsiveHeaderNav() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const [open, setOpen] = useState(false);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      navigate({ to: '/' });
    } else {
      await login();
    }
    setOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Button variant="ghost" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/story-mode">
                <BookOpen className="h-4 w-4 mr-2" />
                Story Mode
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/character-showcase">
                <User className="h-4 w-4 mr-2" />
                Character
              </Link>
            </Button>
            <Button variant="outline" onClick={handleAuth} disabled={isLoggingIn}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={handleAuth} disabled={isLoggingIn}>
            <LogIn className="h-4 w-4 mr-2" />
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        )}
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-3 mt-6">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setOpen(false)}>
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setOpen(false)}>
                  <Link to="/story-mode">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Story Mode
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start" onClick={() => setOpen(false)}>
                  <Link to="/character-showcase">
                    <User className="h-4 w-4 mr-2" />
                    Character
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleAuth} disabled={isLoggingIn} className="justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleAuth} disabled={isLoggingIn} className="justify-start">
                <LogIn className="h-4 w-4 mr-2" />
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
