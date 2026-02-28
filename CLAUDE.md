# CLAUDE.md

This file provides guidance to Claude Code when working on this project.

## Project Overview

**image-to-ascii** is a CLI tool that converts images to ASCII art. Built with Node.js and TypeScript.

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run CLI
node dist/cli.js <image> [options]

# Run in dev mode
npm start -- <image> [options]

# Test
npm test
```

## CLI Options

| Option | Description |
|--------|-------------|
| `-w, --width <number>` | Output width |
| `-c, --color` | Enable colored output |
| `-i, --invert` | Invert brightness |
| `-s, --charset <string>` | Custom character set |

## Architecture

```
bin/cli.ts           # CLI entry
src/
├── index.ts        # Main API
├── image-loader.ts # Load file/URL
├── image-processor.ts # Resize, pixels
├── ascii-converter.ts # To ASCII
├── color-renderer.ts # Colors
└── terminal.ts     # Terminal detection
```

## Key Modules

### image-processor.ts
- Handles image resizing with aspect ratio 0.5
- Converts any channel image (grayscale/RGB/RGBA) to RGBA
- Critical: must handle 1/3/4 channel conversion properly

### ascii-converter.ts
- `calculateBrightness(r, g, b)` - luminance formula
- `convertToAscii(pixelData, options)` - main conversion

## Build

Uses tsup for bundling:
- CLI: minified single file
- Module: with sourcemap and .d.ts

## Testing

```bash
npm test
```

Tests use Node.js built-in test module.
