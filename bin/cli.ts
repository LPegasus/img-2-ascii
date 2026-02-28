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

// Only run when executed directly (not when imported)
// Normalize path separators for cross-platform compatibility
// For absolute Windows paths, add extra slash after file://
let normalizedArgv = process.argv[1]?.replace(/\\/g, '/');
if (normalizedArgv && /^[a-z]:/i.test(normalizedArgv)) {
  // Windows absolute path - add extra slash
  normalizedArgv = '/' + normalizedArgv;
}
const expectedUrl = `file://${normalizedArgv}`;

if (import.meta.url === expectedUrl) {
  program.parse();
}

export { program };
