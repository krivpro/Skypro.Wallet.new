export function authInputWidthCh(value: string, placeholderWithStar: string): string {
  if (value.length > 0) {
    return `${Math.max(value.length + 2.5, 8)}ch`
  }
  return `${Math.max(placeholderWithStar.length + 1, 10)}ch`
}
