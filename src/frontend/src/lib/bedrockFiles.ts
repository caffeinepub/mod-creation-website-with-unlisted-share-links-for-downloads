import { validateFileSize, validateFileCount, MAX_FILE_SIZE } from './fileLimits';

/**
 * Allowed Minecraft Bedrock mod file extensions
 */
const ALLOWED_EXTENSIONS = ['.mcpack', '.mcaddon'];

/**
 * Check if a filename has a valid Bedrock mod extension
 */
export function isValidBedrockFile(filename: string): boolean {
  const lowerFilename = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some(ext => lowerFilename.endsWith(ext));
}

/**
 * Get the file extension from a filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
}

/**
 * Validate a single Bedrock file
 */
export function validateBedrockFile(file: File): { valid: boolean; message?: string } {
  // Check extension
  if (!isValidBedrockFile(file.name)) {
    return {
      valid: false,
      message: `"${file.name}" is not a valid Minecraft Bedrock mod file. Only .mcpack and .mcaddon files are supported.`,
    };
  }

  // Check file size
  const sizeValidation = validateFileSize(file.size);
  if (!sizeValidation.valid) {
    return {
      valid: false,
      message: `"${file.name}" is too large. ${sizeValidation.message}`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple Bedrock files
 */
export function validateBedrockFiles(files: File[]): { valid: boolean; message?: string } {
  // Check count
  const countValidation = validateFileCount(files.length);
  if (!countValidation.valid) {
    return countValidation;
  }

  // Check each file
  for (const file of files) {
    const fileValidation = validateBedrockFile(file);
    if (!fileValidation.valid) {
      return fileValidation;
    }
  }

  return { valid: true };
}

/**
 * Format file size limit for display
 */
export function getMaxFileSizeDisplay(): string {
  return `${MAX_FILE_SIZE / 1024 / 1024}MB`;
}
