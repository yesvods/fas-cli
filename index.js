const publish = require('./src/publish')
const prompt = require('prompt')
const config = require('./src/config')

const parseRoute = route => {
  if (route === 'config') {
    prompt.start()
    prompt.get(['AK', 'SK'], (err, result) => {
      const { AK, SK } = result
      config.set('qiniu', { AK, SK })
    })
  }
}

module.exports = () => {
  const route = cli.input[0]
  const { bucketName } = cli.flags
  if (route) {
    parseRoute(route)
  } else {
    publish(bucketName)
  }
}
