import { defineConfig } from 'tsup';

export default defineConfig([
  // CLI 入口 - 打包成单个文件
  {
    entry: {
      cli: 'bin/cli.ts',
    },
    outDir: 'dist',
    format: 'esm',
    platform: 'node',
    bundle: true,
    minify: true,
    sourcemap: false,
    clean: true,
    external: [],
  },
  // 模块入口 - 打包成单个文件作为库
  {
    entry: {
      index: 'src/index.ts',
    },
    outDir: 'dist',
    format: 'esm',
    platform: 'node',
    bundle: true,
    minify: false,
    sourcemap: true,
    dts: true,
    clean: false,
    external: [],
  },
]);
