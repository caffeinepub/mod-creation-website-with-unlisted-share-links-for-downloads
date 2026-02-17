export function generateUnlistedId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 32;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getShareUrl(unlistedId: string): string {
  const origin = window.location.origin;
  return `${origin}/#/mod/${unlistedId}`;
}

export function getCharacterShareUrl(unlistedId: string): string {
  const origin = window.location.origin;
  return `${origin}/#/character/${unlistedId}`;
}
