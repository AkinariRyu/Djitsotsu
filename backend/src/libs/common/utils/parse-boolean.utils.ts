export function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lowerValue = value.trim().toLowerCase();
    if (lowerValue === 'true') {
      return true;
    }
    if (lowerValue === 'false') {
      return false;
    }
  }

  throw new Error(
    `Failed to convert value "${value}" to a boolean.`
  );
}