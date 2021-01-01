const path = require('path')
const build = require('./scripts')
const dev = require('./scripts/dev')

let buildInfo = {}
if (process.env.NODE_ENV === 'production') {
  buildInfo = build(process)
} else {
  buildInfo = dev()
}

module.exports = {
  productionSourceMap: false,
  ...buildInfo.config,
  chainWebpack: (config) => {
    config.resolve.alias.set('@playground', path.join(__dirname, 'playground'))
    config.resolve.alias.set('@src', path.join(__dirname, 'src'))
  }
}
