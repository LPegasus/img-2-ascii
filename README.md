# image-to-ascii

Convert images to ASCII art in terminal.

## Install

```bash
npm install @lp/image-to-ascii
```

## CLI Usage

```bash
# From local file
img2ascii ./photo.png
img2ascii ./photo.png --width 80
img2ascii ./photo.png --color
img2ascii ./photo.png --color --invert

# From URL
img2ascii https://example.com/image.png
```

## API Usage

```typescript
import { fileToAscii, urlToAscii } from '@lp/image-to-ascii';

const result = await fileToAscii('./photo.png', {
  width: 80,
  color: false,
  invert: false,
  charset: '@%#*+=-:. '
});

console.log(result.text);
```

## Options

| Option | CLI | API | Default |
|--------|-----|-----|---------|
| Output width | `-w, --width <number>` | `width: number` | Auto-detect terminal |
| Colored output | `-c, --color` | `color: boolean` | false |
| Invert brightness | `-i, --invert` | `invert: boolean` | false |
| Custom charset | `-s, --charset <string>` | `charset: string` | `@%#*+=-:. ` |

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Run CLI
npm start -- ./photo.png
```
