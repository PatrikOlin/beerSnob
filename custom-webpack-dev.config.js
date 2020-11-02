const ExtenstionReloader = require('webpack-extension-reloader')
const config = require('./custom-webpack.config')

module.exports = {
  ...config,
  mode: 'development',
  plugins: [new ExtenstionReloader({
    reloadPage: true,
    entries: {
      background: 'background'
    }
  })]
}
