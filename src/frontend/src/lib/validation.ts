export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateModTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { valid: false, message: 'Mod title is required' };
  }
  if (title.length > 100) {
    return { valid: false, message: 'Mod title must be 100 characters or less' };
  }
  return { valid: true };
}

export function validateGameName(gameName: string): ValidationResult {
  if (!gameName || gameName.trim().length === 0) {
    return { valid: false, message: 'Game name is required' };
  }
  if (gameName.length > 100) {
    return { valid: false, message: 'Game name must be 100 characters or less' };
  }
  return { valid: true };
}

export function validateModVersion(version: string): ValidationResult {
  if (!version || version.trim().length === 0) {
    return { valid: false, message: 'Version is required' };
  }
  return { valid: true };
}

export function validateModDescription(description: string): ValidationResult {
  if (!description || description.trim().length === 0) {
    return { valid: false, message: 'Description is required' };
  }
  if (description.length > 2000) {
    return { valid: false, message: 'Description must be 2000 characters or less' };
  }
  return { valid: true };
}

export function validateModPrompt(prompt: string): ValidationResult {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, message: 'Prompt is required' };
  }
  if (prompt.length > 2000) {
    return { valid: false, message: 'Prompt must be 2000 characters or less' };
  }
  return { valid: true };
}
