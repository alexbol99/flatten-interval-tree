import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
    // ESM build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/main.mjs',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: './dist',
                rootDir: './src'
            })
        ]
    },

    // CommonJS build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/main.cjs',
            format: 'cjs',
            sourcemap: true,
            exports: 'named'
        },
        plugins: [
            nodeResolve(),
            typescript({ tsconfig: './tsconfig.json' })
        ]
    },

    // UMD build (browser)
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/main.umd.js',
            format: 'umd',
            name: 'IntervalTree',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser()
        ]
    }
];