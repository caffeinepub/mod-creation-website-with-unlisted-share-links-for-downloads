// Stub types for mod functionality (backend does not support mods yet)
export interface ModFile {
  filename: string;
  contentType: string;
  content: Uint8Array;
}

export interface ModData {
  id: string;
  title: string;
  description: string;
  prompt: string;
  version: string;
  creator: any;
  gameName: string;
  files: ModFile[];
  unlistedId: string;
  enabled: boolean;
}
