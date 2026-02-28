import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getTerminalWidth, supportsColor } from '../src/terminal.ts';

describe('terminal', () => {
  it('getTerminalWidth returns number', () => {
    const width = getTerminalWidth();
    assert.strictEqual(typeof width, 'number');
    assert.ok(width > 0);
  });

  it('supportsColor returns boolean', () => {
    const color = supportsColor();
    assert.strictEqual(typeof color, 'boolean');
  });
});
