---
name: image-to-ascii-cli
description: Use when converting images to ASCII art or building CLI tools with image processing
---

# image-to-ascii CLI Tool

## Overview
Convert images to ASCII art in terminal. Built with TypeScript, sharp, commander, chalk.

## When to Use
- User asks to convert image to ASCII art
- Building CLI tools that process images
- Need to display images as text in terminal

## Quick Start

```bash
# CLI usage
node dist/cli.js ./photo.png
node dist/cli.js ./photo.png --width 80
node dist/cli.js ./photo.png --color
node dist/cli.js https://example.com/image.png

# As module
import { fileToAscii, urlToAscii } from './dist/index.js';
```

## Project Structure

| File | Purpose |
|------|---------|
| `bin/cli.ts` | CLI entry point |
| `src/index.ts` | Main API exports |
| `src/image-loader.ts` | Load from file/URL |
| `src/image-processor.ts` | Resize, grayscale, pixel data |
| `src/ascii-converter.ts` | Pixels to ASCII chars |
| `src/color-renderer.ts` | Colored output |
| `src/terminal.ts` | Terminal width detection |

## Key APIs

```typescript
// Load from file
import { fileToAscii } from './dist/index.js';
const result = await fileToAscii('./image.png', { width: 80, color: false });

// Load from URL
import { urlToAscii } from './dist/index.js';
const result = await urlToAscii('https://example.com/image.png', options);

// Result structure
interface AsciiResult {
  text: string;    // ASCII art string
  width: number;  // pixel width
  height: number; // pixel height
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | auto | Output width |
| `color` | boolean | false | Enable ANSI colors |
| `invert` | boolean | false | Invert brightness |
| `charset` | string | `@%#*+=-:. ` | Character set |

## Build

```bash
npm install
npm run build    # outputs to dist/
npm run start   # dev mode with tsx
npm test        # run tests
```

## Common Issues

**Grayscale images show empty rows**: Check `src/image-processor.ts` - must handle channel conversion (1/3/4 channels).

**Color mode height mismatch**: Ensure both color and grayscale modes use same pixel data pipeline.
