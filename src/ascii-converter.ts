export interface PixelData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface AsciiOptions {
  width?: number;
  charset?: string;
  color?: boolean;
  invert?: boolean;
}

export function calculateBrightness(r: number, g: number, b: number): number {
  return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
}

export function convertToAscii(pixelData: PixelData, options: AsciiOptions = {}): string {
  const { charset = '@%#*+=-:. ', invert = false } = options;
  // 反转字符集，使索引0对应最暗，索引max对应最亮
  const chars = charset.split('').reverse();
  const charCount = chars.length;

  const lines: string[] = [];

  for (let y = 0; y < pixelData.height; y++) {
    const row: string[] = [];
    for (let x = 0; x < pixelData.width; x++) {
      const idx = (y * pixelData.width + x) * 4;
      const r = pixelData.data[idx];
      const g = pixelData.data[idx + 1];
      const b = pixelData.data[idx + 2];

      let brightness = calculateBrightness(r, g, b);
      if (invert) brightness = 1 - brightness;

      const charIndex = Math.floor(brightness * (charCount - 1));
      row.push(chars[charIndex]);
    }
    lines.push(row.join(''));
  }

  return lines.join('\n');
}
