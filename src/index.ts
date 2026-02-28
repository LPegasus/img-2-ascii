import { loadImage } from './image-loader.js';
import { processImage } from './image-processor.js';
import { convertToAscii, AsciiOptions, PixelData } from './ascii-converter.js';
import { renderColored } from './color-renderer.js';
import { getTerminalWidth } from './terminal.js';

export interface AsciiResult {
  text: string;
  width: number;
  height: number;
}

export async function fileToAscii(path: string, options: AsciiOptions = {}): Promise<AsciiResult> {
  const image = await loadImage(path);
  const width = options.width || getTerminalWidth();
  const pixelData = await processImage(image, width, !options.color);

  return generateAscii(pixelData, options, width);
}

export async function urlToAscii(url: string, options: AsciiOptions = {}): Promise<AsciiResult> {
  const image = await loadImage(url);
  const width = options.width || getTerminalWidth();
  const pixelData = await processImage(image, width, !options.color);

  return generateAscii(pixelData, options, width);
}

export async function bufferToAscii(buffer: Buffer, options: AsciiOptions = {}): Promise<AsciiResult> {
  const sharp = (await import('sharp')).default;
  const image = sharp(buffer);
  const width = options.width || getTerminalWidth();
  const pixelData = await processImage(image, width, !options.color);

  return generateAscii(pixelData, options, width);
}

async function generateAscii(pixelData: PixelData, options: AsciiOptions, width: number): Promise<AsciiResult> {
  let text: string;

  if (options.color) {
    text = renderColored(pixelData, options);
  } else {
    text = convertToAscii(pixelData, options);
  }

  return {
    text,
    width: pixelData.width,
    height: pixelData.height
  };
}

export type { AsciiOptions } from './ascii-converter.js';
