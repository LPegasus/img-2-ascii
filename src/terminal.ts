export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

export function supportsColor(): boolean {
  return process.stdout.isTTY === true;
}
