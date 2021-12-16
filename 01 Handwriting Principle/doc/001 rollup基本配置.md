# rollup基本配置

## 环境配置

```BASH
npm init
npm install rollup @babel/core @babel/preset-env rollup-plugin-babel -D
```

## 配置 rollup.config.js

```JS
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
```

## 配置 .babelrc

```JSON
{
    // 预设，进行代码转译
    "presets": [
        "@babel/preset-env"
    ]
}
```

## package.json 设置启动

```JSON
 {
     "scripts": {
         // -c 指定文件 -w 监听
        "serve": "rollup -c -w"
    },
 }
```

## 创建文件

pro/src/index.js
pro/index.html
