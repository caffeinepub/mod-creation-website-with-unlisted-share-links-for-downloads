import { ReactNode } from 'react';

interface StoryModeSectionLayoutProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function StoryModeSectionLayout({
  title,
  description,
  action,
  children,
}: StoryModeSectionLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-story">{title}</h1>
            {description && (
              <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {action && <div className="w-full sm:w-auto">{action}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
