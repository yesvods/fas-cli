const path = require('path')
const SDK = require('./sdk')
const config = require('./config')
const walk = require('./walk')
const chalk = require('chalk')
const _ = require('lodash')

const _root = process.cwd()

const { AK, SK } = config.get('qiniu')

const publish = async bucketName => {
  if (!AK | !SK)
    return console.log(`
${chalk.red('You may need to set AK and SK first:')}
${chalk.green('$')} fas config
`)

  const pkg = require(path.resolve(_root, 'package.json'))

  const dir = _.get(pkg, 'fas.dir', 'dist')
  const dirPath = path.resolve(_root, dir)

  bucketName = bucketName || _.get(pkg, 'fas.name')
  if (!bucketName)
    return console.log(`${chalk.red('fas name')} is required in package.json`)

  const sdk = new SDK({
    AK,
    SK,
    bucketName
  })

  const files = walk(path.resolve(_root, dir))

  const result = await Promise.all(
    files.map(async file => {
      const key = file.slice(dirPath.length + 1)
      const {
        body,
        info: { status }
      } = await sdk.upload(path.resolve(_root, file), { key })
      if (status === 200) {
        console.log(`${chalk.green('✔')} ${body.key}`)
      } else {
        console.log(`❗️ ${file}`)
        console.log(chalk.red('  ' + body.error))
        console.log(`
${chalk.red('Make sure the bucket ' + bucketName + ' has been created.')}
`)
        process.exit()
      }
    })
  )
}
module.exports = publish
