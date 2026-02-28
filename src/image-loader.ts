import sharp from 'sharp';

export type ImageSource = string; // file path or URL

export async function loadFromFile(path: string): Promise<sharp.Sharp> {
  return sharp(path);
}

export async function loadFromUrl(url: string): Promise<sharp.Sharp> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return sharp(Buffer.from(arrayBuffer));
}

export async function loadFromBuffer(buffer: Buffer): Promise<sharp.Sharp> {
  return sharp(buffer);
}

export async function loadImage(source: string): Promise<sharp.Sharp> {
  // 判断是 URL 还是本地文件
  if (source.startsWith('http://') || source.startsWith('https://')) {
    return loadFromUrl(source);
  }
  return loadFromFile(source);
}
