import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import unoConfig from '../../uno.config.ts';

const rootPackageJson = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf-8')) as {
  version: string;
};

function iconParkPlugin() {
  return {
    name: 'vite-plugin-icon-park',
    enforce: 'pre' as const,
    transform(source: string, id: string) {
      if (!id.endsWith('.tsx') || id.includes('node_modules')) return null;
      if (!source.includes('@icon-park/react')) return null;
      const transformedSource = source.replace(
        /import\s+\{\s+([a-zA-Z, ]*)\s+\}\s+from\s+['"]@icon-park\/react['"](;?)/g,
        function (str, match) {
          if (!match) return str;
          const components = match.split(',');
          const importComponent = str.replace(
            match,
            components.map((key: string) => `${key} as _${key.trim()}`).join(', ')
          );
          const hoc = `import IconParkHOC from '@renderer/components/IconParkHOC';
          ${components.map((key: string) => `const ${key.trim()} = IconParkHOC(_${key.trim()})`).join(';\n')}`;
          return importComponent + ';' + hoc;
        }
      );
      if (transformedSource !== source) return { code: transformedSource, map: null } as { code: string; map: null };
      return null;
    },
  };
}

const rendererRoot = resolve('packages/desktop/src/renderer');

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    root: rendererRoot,
    base: './',
    publicDir: resolve('public'),
    appType: 'mpa',
    server: {
      port: 5173,
      strictPort: true,
      hmr: {
        host: 'localhost',
      },
    },
    resolve: {
      alias: {
        '@': resolve('packages/desktop/src'),
        '@common': resolve('packages/desktop/src/common'),
        '@renderer': resolve('packages/desktop/src/renderer'),
        '@process': resolve('packages/desktop/src/process'),
        '@worker': resolve('packages/desktop/src/process/worker'),
        streamdown: resolve('node_modules/streamdown/dist/index.js'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    plugins: [UnoCSS(unoConfig), iconParkPlugin()],
    build: {
      target: 'es2022',
      outDir: resolve('out/renderer'),
      emptyOutDir: true,
      sourcemap: isDevelopment,
      minify: !isDevelopment,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true,
      rollupOptions: {
        input: {
          index: resolve(rendererRoot, 'index.html'),
          pet: resolve(rendererRoot, 'pet/pet.html'),
          'pet-hit': resolve(rendererRoot, 'pet/pet-hit.html'),
          'pet-confirm': resolve(rendererRoot, 'pet/pet-confirm.html'),
        },
        external: ['node:crypto', 'crypto'],
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.env': JSON.stringify(process.env.env),
      'process.env.PANAI_MULTI_INSTANCE': JSON.stringify(process.env.PANAI_MULTI_INSTANCE ?? ''),
      'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN ?? ''),
      __APP_VERSION__: JSON.stringify(rootPackageJson.version),
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['electron'],
    },
  };
});
