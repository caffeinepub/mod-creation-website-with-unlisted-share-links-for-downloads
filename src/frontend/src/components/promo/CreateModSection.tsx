import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function CreateModSection() {
  const navigate = useNavigate();

  return (
    <Card className="border-promo/30 bg-promo/5">
      <CardHeader>
        <CardTitle className="text-promo flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Create Your Own Mod
        </CardTitle>
        <CardDescription>
          Start building your custom game modifications with our powerful tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => navigate({ to: '/create' })}
          className="w-full bg-promo hover:bg-promo/90 text-promo-foreground"
          size="lg"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
