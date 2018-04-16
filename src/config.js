const Config = require('configstore')
const pkg = require('../package.json')

module.exports = new Config(pkg.name, {
  qiniu: {
    AK: '',
    SK: ''
  }
})
