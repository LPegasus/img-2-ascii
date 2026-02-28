# Image to ASCII CLI - 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个 CLI 工具，输入图片 (本地文件或 URL)，输出 ASCII art 打印到终端

**Architecture:** TypeScript 项目，模块化拆分 (loader/processor/converter/renderer)，使用 sharp 处理图片

**Tech Stack:** TypeScript, sharp, commander, chalk, Node.js built-in test

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

**Step 1: 创建 package.json**

```json
{
  "name": "image-to-ascii",
  "version": "1.0.0",
  "description": "Convert images to ASCII art",
  "type": "module",
  "bin": {
    "img2ascii": "./bin/cli.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "tsx bin/cli.ts",
    "test": "node --test test/**/*.test.ts"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^12.1.0",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "tsx": "^4.15.0",
    "typescript": "^5.4.5"
  }
}
```

**Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  },
  "include": ["src/**/*", "bin/**/*", "test/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: 安装依赖**

Run: `npm install`
Expected: 安装完成

**Step 4: Commit**

```bash
git init
git add package.json tsconfig.json
git commit -m "chore: init project with dependencies"
```

---

## Task 2: terminal.ts - 终端检测模块

**Files:**
- Create: `src/terminal.ts`
- Test: `test/terminal.test.ts`

**Step 1: 写失败的测试**

```typescript
import { describe, it, assert } from 'node:test';
import { getTerminalWidth, supportsColor } from '../src/terminal.js';

describe('terminal', () => {
  it('getTerminalWidth returns number', () => {
    const width = getTerminalWidth();
    assert.equal(typeof width, 'number');
    assert.ok(width > 0);
  });

  it('supportsColor returns boolean', () => {
    const color = supportsColor();
    assert.equal(typeof color, 'boolean');
  });
});
```

**Step 2: 运行测试验证失败**

Run: `npm test test/terminal.test.ts`
Expected: FAIL - module not found

**Step 3: 写实现代码**

```typescript
export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

export function supportsColor(): boolean {
  return process.stdout.isTTY === true;
}
```

**Step 4: 运行测试验证通过**

Run: `npm test test/terminal.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/terminal.ts test/terminal.test.ts
git commit -m "feat: add terminal detection module"
```

---

## Task 3: ascii-converter.ts - ASCII 转换核心

**Files:**
- Create: `src/ascii-converter.ts`
- Test: `test/ascii-converter.test.ts`

**Step 1: 写失败的测试**

```typescript
import { describe, it, assert } from 'node:test';
import { convertToAscii, calculateBrightness } from '../src/ascii-converter.js';

describe('ascii-converter', () => {
  it('calculateBrightness returns value between 0 and 1', () => {
    // 白色 (255, 255, 255) -> 1
    const white = calculateBrightness(255, 255, 255);
    assert.equal(white, 1);

    // 黑色 (0, 0, 0) -> 0
    const black = calculateBrightness(0, 0, 0);
    assert.equal(black, 0);

    // 灰色 (128, 128, 128) -> ~0.5
    const gray = calculateBrightness(128, 128, 128);
    assert.ok(gray > 0.4 && gray < 0.6);
  });

  it('convertToAscii maps brightness to charset', () => {
    const pixelData = {
      data: new Uint8ClampedArray([255, 255, 255, 255]), // 白色
      width: 1,
      height: 1
    };
    const result = convertToAscii(pixelData, { charset: '@ ' });
    assert.equal(result, '@');
  });
});
```

**Step 2: 运行测试验证失败**

Run: `npm test test/ascii-converter.test.ts`
Expected: FAIL - module not found

**Step 3: 写实现代码**

```typescript
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
  const chars = charset.split('');
  const charCount = chars.length;

  const lines: string[] = [];

  for (let y = 0; y < pixelData.height; y++) {
    let line = '';
    for (let x = 0; x < pixelData.width; x++) {
      const idx = (y * pixelData.width + x) * 4;
      const r = pixelData.data[idx];
      const g = pixelData.data[idx + 1];
      const b = pixelData.data[idx + 2];

      let brightness = calculateBrightness(r, g, b);
      if (invert) brightness = 1 - brightness;

      const charIndex = Math.floor(brightness * (charCount - 1));
      line += chars[charIndex];
    }
    lines.push(line);
  }

  return lines.join('\n');
}
```

**Step 4: 运行测试验证通过**

Run: `npm test test/ascii-converter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/ascii-converter.ts test/ascii-converter.test.ts
git commit -m "feat: add ASCII converter module"
```

---

## Task 4: image-processor.ts - 图片预处理

**Files:**
- Create: `src/image-processor.ts`

**Step 1: 写实现代码**

```typescript
import sharp from 'sharp';

export interface ResizeOptions {
  width: number;
}

export async function resizeImage(image: sharp.Sharp, width: number): Promise<sharp.Sharp> {
  const metadata = await image.metadata();
  const originalWidth = metadata.width || width;
  const aspectRatio = 0.5; // 字符宽高比

  const height = Math.floor((metadata.height || width) / originalWidth * width * aspectRatio);

  return image.resize(width, height, { fit: 'fill' });
}

export async function toGrayscale(image: sharp.Sharp): Promise<sharp.Sharp> {
  return image.grayscale();
}

export async function getPixelData(image: sharp.Sharp, width: number): Promise<{
  data: Uint8ClampedArray;
  width: number;
  height: number;
}> {
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    data: new Uint8ClampedArray(data),
    width: info.width,
    height: info.height
  };
}

export async function processImage(image: sharp.Sharp, width: number, grayscale: boolean = true) {
  let processed = image;
  resizeImage(processed processed = await, width);
  if (grayscale) {
    processed = await toGrayscale(processed);
  }
  return getPixelData(processed, width);
}
```

**Step 2: Commit**

```bash
git add src/image-processor.ts
git commit -m "feat: add image processor module"
```

---

## Task 5: image-loader.ts - 图片加载

**Files:**
- Create: `src/image-loader.ts`

**Step 1: 写实现代码**

```typescript
import sharp from 'sharp';
import { readFile } from 'fs/promises';

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
```

**Step 2: Commit**

```bash
git add src/image-loader.ts
git commit -m "feat: add image loader module"
```

---

## Task 6: color-renderer.ts - 彩色输出

**Files:**
- Create: `src/color-renderer.ts`

**Step 1: 写实现代码**

```typescript
import chalk from 'chalk';
import { PixelData, AsciiOptions } from './ascii-converter.js';

export function renderColored(pixelData: PixelData, options: AsciiOptions = {}): string {
  const { charset = '@%#*+=-:. ', invert = false } = options;
  const chars = charset.split('');
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
```

**Step 2: Commit**

```bash
git add src/color-renderer.ts
git commit -m "feat: add color renderer module"
```

---

## Task 7: src/index.ts - 主入口

**Files:**
- Create: `src/index.ts`

**Step 1: 写实现代码**

```typescript
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
  const image = await sharp(buffer);
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

export { AsciiOptions } from './ascii-converter.js';
```

**Step 2: Commit**

```bash
git add src/index.ts
git commit -m "feat: add main API exports"
```

---

## Task 8: bin/cli.ts - CLI 入口

**Files:**
- Create: `bin/cli.ts`

**Step 1: 写实现代码**

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { fileToAscii, urlToAscii } from '../src/index.js';

const program = new Command();

program
  .name('img2ascii')
  .description('Convert images to ASCII art')
  .version('1.0.0')
  .argument('<image>', 'Image file path or URL')
  .option('-w, --width <number>', 'Output width (default: auto-detect terminal width)')
  .option('-c, --color', 'Enable colored output')
  .option('-i, --invert', 'Invert brightness')
  .option('-s, --charset <string>', 'Custom character set', '@%#*+=-:. ')
  .action(async (image: string, options) => {
    try {
      const width = options.width ? parseInt(options.width) : undefined;

      const result = image.startsWith('http://') || image.startsWith('https://')
        ? await urlToAscii(image, { width, color: options.color, invert: options.invert, charset: options.charset })
        : await fileToAscii(image, { width, color: options.color, invert: options.invert, charset: options.charset });

      console.log(result.text);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
```

**Step 2: 确保 bin 目录存在**

Run: `mkdir -p bin` (如果不存在)

**Step 3: Commit**

```bash
git add bin/cli.ts
git commit -m "feat: add CLI entry point"
```

---

## Task 9: 手动测试验证

**Step 1: 测试 CLI 运行**

Run: `npm start ./test/fixtures/test.png`
Expected: 输出 ASCII art

Run: `npm start https://example.com/image.png`
Expected: 输出 ASCII art

**Step 2: 测试参数**

Run: `npm start ./test/fixtures/test.png -- --width 40`
Expected: 窄输出

Run: `npm start ./test/fixtures/test.png -- --color`
Expected: 彩色输出

Run: `npm start ./test/fixtures/test.png -- --invert`
Expected: 反转亮度

**Step 3: Commit**

```bash
git add .
git commit -m "test: verify CLI functionality"
```

---

## 完成

所有任务完成后，项目结构如下:

```
image-to-ascii/
├── bin/
│   └── cli.ts
├── src/
│   ├── index.ts
│   ├── image-loader.ts
│   ├── image-processor.ts
│   ├── ascii-converter.ts
│   ├── color-renderer.ts
│   └── terminal.ts
├── test/
│   ├── terminal.test.ts
│   └── ascii-converter.test.ts
├── package.json
├── tsconfig.json
└── README.md
```
