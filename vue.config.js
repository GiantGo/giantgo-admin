const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))
      .set('base', resolve('src/base'))
      .set('static', resolve('src/static'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000/',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath = 'https://cdn.runighcat.com/'
    } else {
      // mutate for development...
    }
  }
}
