const path = require('path')
module.exports = {
  pluginOptions: {
    // vue add style-resources-loader  添加处理sass的插件
    'style-resources-loader': {
      preProcessor: 'scss', // 自动引入，可以在每个页面都使用
      patterns: [
        path.resolve(__dirname, 'src/assets/common.scss')
      ]
    }
  },
  // 配置 px2rem postcss-plugin-px2rem lib-flexible
  css: {
    loaderOptions: {
      postcss: {
        plugins: [ // vant-ui
          require('postcss-plugin-px2rem')({
            rootValue: 37.5, // 设计稿大小 375
            exclude: /node_module/,
          }),
        ]
      }
    }
  },
}
