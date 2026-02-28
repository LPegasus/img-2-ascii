import sharp from 'sharp';

export async function resizeImage(image: sharp.Sharp, targetWidth: number): Promise<sharp.Sharp> {
  const metadata = await image.clone().metadata();
  const originalWidth = metadata.width || targetWidth;
  const aspectRatio = 0.5; // 字符宽高比

  const targetHeight = Math.floor((metadata.height || targetWidth) / originalWidth * targetWidth * aspectRatio);

  return image.resize(targetWidth, targetHeight, { fit: 'fill' });
}

export async function toGrayscale(image: sharp.Sharp): Promise<sharp.Sharp> {
  return image.grayscale();
}

export async function getPixelData(image: sharp.Sharp, grayscale: boolean = true): Promise<{
  data: Uint8ClampedArray;
  width: number;
  height: number;
}> {
  let pipeline = image;
  if (grayscale) {
    pipeline = pipeline.grayscale();
  }

  // 获取原始像素数据
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const expectedLength = width * height * 4; // RGBA

  // 转换为 RGBA 格式
  const rgbaData = new Uint8ClampedArray(expectedLength);

  if (channels === 1) {
    // 灰度图：每个像素 1 个值，扩展到 RGBA
    for (let i = 0; i < width * height; i++) {
      const gray = data[i];
      rgbaData[i * 4] = gray;     // R
      rgbaData[i * 4 + 1] = gray; // G
      rgbaData[i * 4 + 2] = gray; // B
      rgbaData[i * 4 + 3] = 255;  // A
    }
  } else if (channels === 3) {
    // RGB 图：每个像素 3 个值，添加 alpha
    for (let i = 0; i < width * height; i++) {
      rgbaData[i * 4] = data[i * 3];     // R
      rgbaData[i * 4 + 1] = data[i * 3 + 1]; // G
      rgbaData[i * 4 + 2] = data[i * 3 + 2]; // B
      rgbaData[i * 4 + 3] = 255;             // A
    }
  } else if (channels === 4) {
    // RGBA 图：直接复制
    rgbaData.set(data);
  } else {
    throw new Error(`Unsupported channel count: ${channels}`);
  }

  return {
    data: rgbaData,
    width,
    height
  };
}

export async function processImage(image: sharp.Sharp, width: number, grayscale: boolean = true): Promise<{
  data: Uint8ClampedArray;
  width: number;
  height: number;
}> {
  const resized = await resizeImage(image, width);
  return getPixelData(resized, grayscale);
}
