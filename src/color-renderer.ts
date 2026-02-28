import chalk from 'chalk';
import type { PixelData, AsciiOptions } from './ascii-converter.js';

export function renderColored(pixelData: PixelData, options: AsciiOptions = {}): string {
  const { charset = '@%#*+=-:. ', invert = false } = options;
  // 反转字符集，使索引0对应最暗，索引max对应最亮
  const chars = charset.split('').reverse();
  const charCount = chars.length;

  const lines: string[] = [];

  for (let y = 0; y < pixelData.height; y++) {
    let line = '';
    for (let x = 0; x < pixelData.width; x++) {
      const idx = (y * pixelData.width + x) * 4;
      const r = pixelData.data[idx];
      const g = pixelData.data[idx + 1];
      const b = pixelData.data[idx + 2];

      // 计算亮度
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      const adjustedBrightness = invert ? 1 - brightness : brightness;
      const charIndex = Math.floor(adjustedBrightness * (charCount - 1));
      const char = chars[charIndex];

      // 使用 chalk 颜色
      line += chalk.rgb(r, g, b)(char);
    }
    lines.push(line);
  }

  return lines.join('\n');
}
