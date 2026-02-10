export const MAX_FILE_COUNT = 10;
export const MAX_TEXT_FILE_COUNT = 5;
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB per file

export function validateFileCount(fileCount: number): { valid: boolean; message?: string } {
  if (fileCount === 0) {
    return { valid: false, message: 'At least one file is required' };
  }
  if (fileCount > MAX_FILE_COUNT) {
    return { valid: false, message: `Maximum ${MAX_FILE_COUNT} files allowed` };
  }
  return { valid: true };
}

export function validateFileSize(size: number): { valid: boolean; message?: string } {
  if (size > MAX_FILE_SIZE) {
    return { valid: false, message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
