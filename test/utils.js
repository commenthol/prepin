/* global describe, it */

const assert = require('assert')
const {evaluate, splitlines} = require('../src/utils')

describe('#utils', function () {
  it('should split into lines', function () {
    const str = `
1
2\ndue
3\r\ntre
4
`
    const res = splitlines(str)
    assert.deepEqual(res, ['', '1', '2', 'due', '3', 'tre', '4', ''])
  })

  it('should evaluate to true', function () {
    const res = evaluate({flag: 1})('flag === 1')
    assert.equal(res, true)
  })

  it('should evaluate defined(flag) to true', function () {
    const res = evaluate({flag: 1})('defined(flag)')
    assert.equal(res, true)
  })

  it('should evaluate defined(flag) to false', function () {
    const res = evaluate({})('defined(flag)')
    assert.equal(res, false)
  })
})
