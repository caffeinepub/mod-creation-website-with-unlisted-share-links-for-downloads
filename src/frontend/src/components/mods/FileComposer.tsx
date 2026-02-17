import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { validateFileSize, formatFileSize, MAX_FILE_COUNT, MAX_TEXT_FILE_COUNT } from '../../lib/fileLimits';
import type { ModFile } from '../../lib/modTypes';

interface FileComposerProps {
  files: ModFile[];
  onChange: (files: ModFile[]) => void;
}

export default function FileComposer({ files, onChange }: FileComposerProps) {
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [textFileName, setTextFileName] = useState('');
  const [textContent, setTextContent] = useState('');

  const textFileCount = files.filter(f => f.contentType === 'text/plain').length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: ModFile[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      if (files.length + newFiles.length >= MAX_FILE_COUNT) {
        toast.error(`Maximum ${MAX_FILE_COUNT} files allowed`);
        break;
      }

      const sizeValidation = validateFileSize(file.size);
      if (!sizeValidation.valid) {
        toast.error(`${file.name}: ${sizeValidation.message}`);
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      newFiles.push({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        content: uint8Array,
      });
    }

    if (newFiles.length > 0) {
      onChange([...files, ...newFiles]);
      toast.success(`Added ${newFiles.length} file(s)`);
    }

    e.target.value = '';
  };

  const handleCreateTextFile = () => {
    if (!textFileName.trim()) {
      toast.error('Please enter a filename');
      return;
    }

    if (textFileCount >= MAX_TEXT_FILE_COUNT) {
      toast.error(`Maximum ${MAX_TEXT_FILE_COUNT} text files allowed`);
      return;
    }

    const encoder = new TextEncoder();
    const content = encoder.encode(textContent);

    const newFile: ModFile = {
      filename: textFileName.trim(),
      contentType: 'text/plain',
      content,
    };

    onChange([...files, newFile]);
    toast.success('Text file created');
    setTextFileName('');
    setTextContent('');
    setTextDialogOpen(false);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
    toast.success('File removed');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
              <Upload className="h-4 w-4" />
              <span>Upload Files</span>
            </div>
          </Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={files.length >= MAX_FILE_COUNT}
          />
        </div>

        <Dialog open={textDialogOpen} onOpenChange={setTextDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={textFileCount >= MAX_TEXT_FILE_COUNT}>
              <Plus className="h-4 w-4 mr-2" />
              Create Text File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Text File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filename">Filename</Label>
                <Input
                  id="filename"
                  value={textFileName}
                  onChange={(e) => setTextFileName(e.target.value)}
                  placeholder="config.txt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter file content..."
                  rows={10}
                />
              </div>
              <Button onClick={handleCreateTextFile} className="w-full">
                Create File
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Files ({files.length}/{MAX_FILE_COUNT})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.contentType} • {formatFileSize(file.content.length)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
