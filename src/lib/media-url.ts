export const CANONICAL_R2_URL = "https://media.beylikduzu25.com";

const LEGACY_R2_URL = "https://media.beylikduzu24.com";

export function normalizeMediaUrl(value: string): string {
  if (value === LEGACY_R2_URL || value.startsWith(`${LEGACY_R2_URL}/`)) {
    return `${CANONICAL_R2_URL}${value.slice(LEGACY_R2_URL.length)}`;
  }

  return value;
}
