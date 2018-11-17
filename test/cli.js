/* globals describe, it */

const assert = require('assert')
const cli = require('../bin/prepin.js')

describe('#cli', function () {
  it.skip('should display help', function (done) {
    process.on('exit', (code) => {
      assert.strictEqual(code, 1)
      done()
    })
    cli(['--help'])
  })
  it('should get macros', function () {
    const res = cli('-m one=111 -m two=22 -m three sample.js'.split(' '))
    assert.deepStrictEqual(res, {
      macros: { one: '111', two: '22', three: true },
      input: 'sample.js'
    })
  })

  it('should read from stdin and output to sample.js', function () {
    const res = cli('-m one=111 -m two=22 -m three -o sample.js'.split(' '))
    assert.deepStrictEqual(res, {
      macros: { one: '111', two: '22', three: true },
      output: 'sample.js'
    })
  })
})
