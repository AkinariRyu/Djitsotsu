export function generateTag(): string {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}