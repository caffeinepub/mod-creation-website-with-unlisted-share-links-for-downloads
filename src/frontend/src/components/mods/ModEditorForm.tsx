import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { validateModTitle, validateModDescription, validateModVersion, validateModPrompt } from '../../lib/validation';

interface ModEditorFormProps {
  title: string;
  description: string;
  prompt: string;
  version: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onPromptChange: (prompt: string) => void;
  onVersionChange: (version: string) => void;
}

export default function ModEditorForm({
  title,
  description,
  prompt,
  version,
  onTitleChange,
  onDescriptionChange,
  onPromptChange,
  onVersionChange,
}: ModEditorFormProps) {
  const [titleError, setTitleError] = useState<string>();
  const [descError, setDescError] = useState<string>();
  const [promptError, setPromptError] = useState<string>();
  const [versionError, setVersionError] = useState<string>();

  useEffect(() => {
    if (title) {
      const result = validateModTitle(title);
      setTitleError(result.valid ? undefined : result.message);
    }
  }, [title]);

  useEffect(() => {
    if (description) {
      const result = validateModDescription(description);
      setDescError(result.valid ? undefined : result.message);
    }
  }, [description]);

  useEffect(() => {
    if (prompt) {
      const result = validateModPrompt(prompt);
      setPromptError(result.valid ? undefined : result.message);
    }
  }, [prompt]);

  useEffect(() => {
    if (version) {
      const result = validateModVersion(version);
      setVersionError(result.valid ? undefined : result.message);
    }
  }, [version]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mod Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="My Awesome Mod"
            className={titleError ? 'border-destructive' : ''}
          />
          {titleError && <p className="text-xs text-destructive">{titleError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="version">
            Version <span className="text-destructive">*</span>
          </Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => onVersionChange(e.target.value)}
            placeholder="1.0.0"
            className={versionError ? 'border-destructive' : ''}
          />
          {versionError && <p className="text-xs text-destructive">{versionError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe your mod..."
            rows={6}
            className={descError ? 'border-destructive' : ''}
          />
          {descError && <p className="text-xs text-destructive">{descError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt">
            Prompt <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Enter the prompt for this mod..."
            rows={4}
            className={promptError ? 'border-destructive' : ''}
          />
          {promptError && <p className="text-xs text-destructive">{promptError}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
