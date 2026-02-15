/**
 * Web Share API helpers for sharing URLs and files with capability checks and fallbacks.
 */

/**
 * Check if the Web Share API is available in the current browser context.
 */
export function canShareUrl(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Check if the browser supports sharing files via the Web Share API.
 */
export function canShareFiles(): boolean {
  if (!canShareUrl()) return false;
  
  try {
    // Check if navigator.canShare exists and supports files
    if ('canShare' in navigator) {
      return navigator.canShare({ files: [] });
    }
    // Fallback: assume file sharing is supported if share API exists
    return true;
  } catch {
    return false;
  }
}

/**
 * Share a URL using the Web Share API.
 * @param url - The URL to share
 * @param title - Optional title for the share
 * @param text - Optional text description
 * @returns Promise that resolves to true if shared successfully, false otherwise
 */
export async function shareUrl(url: string, title?: string, text?: string): Promise<boolean> {
  if (!canShareUrl()) {
    return false;
  }

  try {
    await navigator.share({
      url,
      title,
      text,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Share files using the Web Share API.
 * @param files - Array of File objects to share
 * @param title - Optional title for the share
 * @param text - Optional text description
 * @returns Promise that resolves to true if shared successfully, false otherwise
 */
export async function shareFiles(files: File[], title?: string, text?: string): Promise<boolean> {
  if (!canShareFiles()) {
    return false;
  }

  try {
    // Check if these specific files can be shared
    if ('canShare' in navigator && !navigator.canShare({ files })) {
      return false;
    }

    await navigator.share({
      files,
      title,
      text,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    console.error('Share files failed:', error);
    return false;
  }
}

/**
 * Copy text to clipboard as a fallback when Web Share is not available.
 * @param text - The text to copy
 * @returns Promise that resolves to true if copied successfully, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
}
