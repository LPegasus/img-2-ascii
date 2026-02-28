# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**image-to-ascii** is a CLI tool that converts images to ASCII art. Built with Node.js and TypeScript.

## Quick Start

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run CLI
node dist/bin/cli.js <image-path-or-url> [options]

# Run in development mode
npm start -- <image-path-or-url> [options]

# Run tests
npm test
```

## CLI Options

| Option | Description |
|--------|-------------|
| `-w, --width <number>` | Output width (default: auto-detect terminal width) |
| `-c, --color` | Enable colored output |
| `-i, --invert` | Invert brightness |
| `-s, --charset <string>` | Custom character set (default: `@%#*+=-:. `) |

## Examples

```bash
# Local file
node dist/bin/cli.js ./photo.png
node dist/bin/cli.js ./photo.png --width 80
node dist/bin/cli.js ./photo.png --color
node dist/bin/cli.js ./photo.png --color --invert

# From URL
node dist/bin/cli.js https://example.com/image.png
```

## Architecture

```
src/
├── index.ts           # Main API exports
├── image-loader.ts    # Load images from file/URL/buffer
├── image-processor.ts # Resize, grayscale, get pixel data
├── ascii-converter.ts # Convert pixels to ASCII characters
├── color-renderer.ts  # Colored output with chalk
└── terminal.ts       # Terminal width detection

bin/
└── cli.ts            # CLI entry point

test/
├── terminal.test.ts
└── ascii-converter.test.ts
```

## Key Modules

### image-loader.ts
- `loadFromFile(path)` - Load local image file
- `loadFromUrl(url)` - Fetch image from URL (uses native fetch)
- `loadImage(source)` - Auto-detect file or URL

### image-processor.ts
- `resizeImage(image, width)` - Resize with 0.5 aspect ratio
- `getPixelData(image, grayscale)` - Get RGBA pixel data (handles 1/3/4 channel images)
- `processImage(image, width, grayscale)` - Main processing pipeline

### ascii-converter.ts
- `calculateBrightness(r, g, b)` - Calculate luminance: `0.299*R + 0.587*G + 0.114*B`
- `convertToAscii(pixelData, options)` - Convert pixels to ASCII characters

### color-renderer.ts
- `renderColored(pixelData, options)` - Render with ANSI RGB colors using chalk

## Tech Stack

- **Language**: TypeScript
- **Image Processing**: sharp
- **CLI**: commander
- **Colors**: chalk
- **Testing**: Node.js built-in test module
