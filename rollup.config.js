export default {
    input: 'index.js',
    output: [
        {
            file: 'dist/interval-tree.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/interval-tree.esm.js',
            format: 'esm'
        }
    ]
};
