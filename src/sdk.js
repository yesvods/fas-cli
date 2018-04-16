const qiniu = require('qiniu')
const path = require('path')

class SDK {
  constructor({ AK, SK, bucketName, config = {}, dir = 'dist' }) {
    this.AK = AK
    this.SK = SK
    this.bucketName = bucketName
    this.config = config
    this.dir = dir
    this.init()
  }

  init() {
    this.zoneMap = ['z0', 'z1', 'z2', 'na0'].reduce((memo, key) => {
      memo[key] = qiniu.zone[`Zone_${key}`]
      return memo
    }, {})
    this.config = Object.assign(
      {
        zone: this.zoneMap['z0'],
        useCdnDomain: true
      },
      this.config
    )
    this.mac = new qiniu.auth.digest.Mac(this.AK, this.SK)
  }

  setConfig(config) {
    if (config.zoneKey) config.zone = this.zoneMap[config.zoneKey]
    this.config = config
  }

  echoToken(policyOptions) {
    if (typeof policyOptions === 'string')
      policyOptions = {
        scope: policyOptions
      }

    const putPolicy = new qiniu.rs.PutPolicy(policyOptions)
    return putPolicy.uploadToken(this.mac)
  }

  echoFileKey(localFile) {
    const index = localFile.indexOf(this.dir)
    return localFile.slice(index + this.dir.length + 1)
  }

  upload(localFile, { key, overwrite = true } = {}) {
    if (!key) key = this.echoFileKey(localFile)
    const config = new qiniu.conf.Config(this.config)
    const putExtra = new qiniu.form_up.PutExtra()

    const baseName = path.basename(localFile)
    const expires = baseName === 'index.html' ? 0 : 7200
    const uploadToken = this.echoToken({
      scope: overwrite ? `${this.bucketName}:${key}` : this.bucketName,
      expires
    })
    const formUploader = new qiniu.form_up.FormUploader(config)

    return new Promise((resolve, reject) => {
      formUploader.putFile(
        uploadToken,
        key,
        localFile,
        putExtra,
        (err, body, info) => {
          if (err) return reject(err)
          resolve({ body, info })
        }
      )
    })
  }
}

module.exports = SDK
