# image-to-ascii Project Maintenance

## Project Structure

```
├── bin/cli.ts              # CLI entry point
├── src/
│   ├── index.ts           # Main API exports
│   ├── image-loader.ts    # Load from file/URL
│   ├── image-processor.ts # Resize, grayscale, pixel data
│   ├── ascii-converter.ts# Pixels to ASCII chars
│   ├── color-renderer.ts # Colored output with chalk
│   └── terminal.ts       # Terminal width detection
├── test/                  # Unit tests
├── dist/                 # Build output
├── tsup.config.ts        # Build configuration
└── package.json
```

## Key Files to Modify

| Feature | Files to Modify |
|---------|----------------|
| CLI arguments | `bin/cli.ts` |
| Image loading | `src/image-loader.ts` |
| Image processing | `src/image-processor.ts` |
| ASCII conversion | `src/ascii-converter.ts` |
| Color output | `src/color-renderer.ts` |
| Terminal detection | `src/terminal.ts` |

## Build Commands

```bash
npm run build    # Build with tsup
npm run start    # Run CLI in dev mode (tsx)
npm test         # Run tests
```

## Build Output

- `dist/cli.js` - CLI executable
- `dist/index.js` - Module for import
- `dist/index.d.ts` - TypeScript definitions

## Common Tasks

### Add new CLI option
1. Edit `bin/cli.ts` - add option with commander
2. Pass to API in `src/index.ts`

### Modify character set
Edit default in `src/ascii-converter.ts`:
```typescript
const { charset = '@%#*+=-:. ' } = options;
```

### Fix image processing
Check `src/image-processor.ts` - handles channel conversion (1/3/4 channels).

## Dependencies

| Package | Purpose |
|---------|---------|
| sharp | Image processing |
| chalk | ANSI colors |
| commander | CLI args |
| tsup | Build tool |
