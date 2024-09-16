import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import esbuild from 'esbuild';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'fix-esm',
          setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
              if (args.path.startsWith('vite-plugin-glsl')) {
                return { path: args.path, external: true };
              }
            });
          },
        },
      ],
    },
  },
  plugins: [
    glsl({
      include: '**/*.glsl'
    })
  ]
});