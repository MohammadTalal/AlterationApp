// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })


module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  transpileDependencies: [
    'vuetify' // or other dependencies you need to transpile
  ],
  configureWebpack: {
    devtool: 'source-map'
  }
};
