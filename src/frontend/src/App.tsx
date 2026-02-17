import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import ModCreateWizardPage from './pages/ModCreateWizardPage';
import ModManagePage from './pages/ModManagePage';
import PublicModPage from './pages/PublicModPage';
import BedrockFileOpenerPage from './pages/BedrockFileOpenerPage';
import StoryModeHomePage from './pages/StoryModeHomePage';
import StoryModeEditPage from './pages/StoryModeEditPage';
import StoryModePlayerPage from './pages/StoryModePlayerPage';
import CharacterShowcaseCreatorPage from './pages/CharacterShowcaseCreatorPage';
import PublicCharacterShowcasePage from './pages/PublicCharacterShowcasePage';

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin',
  component: SignInPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const createModRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: ModCreateWizardPage,
});

const manageModRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage/$modId',
  component: ModManagePage,
});

const publicModRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mod/$unlistedId',
  component: PublicModPage,
});

const bedrockOpenerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/open-bedrock',
  component: BedrockFileOpenerPage,
});

const storyModeHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story-mode',
  component: StoryModeHomePage,
});

const storyModeEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story-mode/edit/$storyId',
  component: StoryModeEditPage,
});

const storyModePlayerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/story-mode/play/$storyId',
  component: StoryModePlayerPage,
});

const characterShowcaseCreatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character-showcase',
  component: CharacterShowcaseCreatorPage,
});

const publicCharacterShowcaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$unlistedId',
  component: PublicCharacterShowcasePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  signInRoute,
  dashboardRoute,
  createModRoute,
  manageModRoute,
  publicModRoute,
  bedrockOpenerRoute,
  storyModeHomeRoute,
  storyModeEditRoute,
  storyModePlayerRoute,
  characterShowcaseCreatorRoute,
  publicCharacterShowcaseRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
