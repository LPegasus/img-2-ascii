import { describe, it } from 'node:test';
import assert from 'node:assert';
import { convertToAscii, calculateBrightness } from '../src/ascii-converter.ts';

describe('ascii-converter', () => {
  it('calculateBrightness returns value between 0 and 1', () => {
    // 白色 (255, 255, 255) -> 1
    const white = calculateBrightness(255, 255, 255);
    assert.strictEqual(white, 1);

    // 黑色 (0, 0, 0) -> 0
    const black = calculateBrightness(0, 0, 0);
    assert.strictEqual(black, 0);

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
    assert.strictEqual(result, '@');
  });

  it('convertToAscii handles invert option', () => {
    const pixelData = {
      data: new Uint8ClampedArray([0, 0, 0, 255]), // 黑色
      width: 1,
      height: 1
    };
    const result = convertToAscii(pixelData, { charset: '@ ', invert: true });
    assert.strictEqual(result, '@');
  });
});
