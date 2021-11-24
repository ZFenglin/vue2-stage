import babel from "rollup-plugin-babel";

export default {
    input: './src/index.js',
    output: {
        format: 'umd', // umd格式，支持amd和commonjs规范，并且会挂在windows上 window.Vue 
        name: 'Vue',
        file: 'dist/vue.js',
        sourcemap: true, // es5（打包出来） -> es6
    },
    plugins: [
        babel({
            // 利用babel转化，移除node_moudles
            // ** 表示任意文件任意目录
            exclude: 'node_moudles/**',
        })
    ]
}