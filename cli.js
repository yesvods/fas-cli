#!/usr/bin/env node

const meow = require('meow')

const updateNotifier = require('update-notifier')
const pkg = require('./package.json')

const fasCli = require('./')

updateNotifier({ pkg }).notify()

global.cli = meow(
  `
    Usage
      $ fas

    Example:
      $ fas -b static
`,
  {
    flags: {
      bucketName: {
        type: 'string',
        alias: 'b'
      }
    }
  }
)

fasCli()
