/* global describe, it */

const assert = require('assert')
const Parser = require('../src/parser')

describe('#Parser', function () {
  it('should parse #ifdef when flag is defined', function () {
    const data = ['// #ifdef flag', 'test = 1', '// #endif'].join('\n')
    const res = new Parser({flag: true}).parse(data)
    assert.deepEqual(res, [ '// #ifdef flag', 'test = 1', '// #endif' ])
  })

  it('should parse #ifndef when flag is defined', function () {
    const data = ['// #ifndef flag', 'test = 1', '// #endif'].join('\n')
    const res = new Parser({flag: false}).parse(data)
    assert.deepEqual(res, [ '// #ifndef flag', '// # test = 1', '// #endif' ])
  })

  it('should parse #ifndef when flag is not defined', function () {
    const data = ['// #ifndef flag', 'test = 1', '// #endif'].join('\n')
    const res = new Parser({}).parse(data)
    assert.deepEqual(res, [ '// #ifndef flag', 'test = 1', '// #endif' ])
  })

  it('should parse #ifdef when flag is not defined', function () {
    const data = ['// #ifdef flag', 'test = 1', '// #endif'].join('\n')
    const res = new Parser({}).parse(data)
    assert.deepEqual(res, [ '// #ifdef flag', '// # test = 1', '// #endif' ])
  })

  it('should parse #if when flag is defined', function () {
    const data = ['// #if flag', 'test = 1', '// #endif'].join('\n')
    const res = new Parser({flag: true}).parse(data)
    assert.deepEqual(res, [ '// #if flag', 'test = 1', '// #endif' ])
  })

  it('should parse #if with expression', function () {
    const data = ['// #if flag == 1', 'test = 1', '// #endif'].join('\n')
    const res = new Parser({flag: 1}).parse(data)
    assert.deepEqual(res, [ '// #if flag == 1', 'test = 1', '// #endif' ])
  })

  it('should parse #if #elif with expression flag = 0', function () {
    const data = [
      '// #if flag == 1',
      'var test = 1',
      '// #elif flag == 2',
      'var test = 2',
      '// #else',
      'var test = 3',
      '// #endif',
      'var cont'
    ].join('\n')
    const res = new Parser({flag: 0}).parse(data)
    assert.deepEqual(res, [
      '// #if flag == 1',
      '// # var test = 1',
      '// #elif flag == 2',
      '// # var test = 2',
      '// #else',
      'var test = 3',
      '// #endif',
      'var cont'
    ])
  })

  it('should parse #if #elif with expression flag = 1', function () {
    const data = [
      '//#if flag == 1',
      '// # var test = 1',
      '//#elif flag == 2',
      '// # var test = 2',
      '//#else',
      'var test = 3',
      '//#endif',
      'var cont'
    ].join('\n')
    const res = new Parser({flag: 1}).parse(data)
    assert.deepEqual(res, [
      '//#if flag == 1',
      'var test = 1',
      '//#elif flag == 2',
      '// # var test = 2',
      '//#else',
      '// # var test = 3',
      '//#endif',
      'var cont'
    ])
  })

  it('should parse #ifndef if flag is not defined', function () {
    const data = [
      '// #ifndef flag',
      '// # var test = 1',
      '// #else',
      'var test = 3',
      '// #endif',
      'var cont'
    ].join('\n')
    const res = new Parser({}).parse(data)
    assert.deepEqual(res, [
      '// #ifndef flag',
      'var test = 1',
      '// #else',
      '// # var test = 3',
      '// #endif',
      'var cont'
    ])
  })

  it('throws error on wrong block', function () {
    const data = [
      '// #if flag == 1',
      '// # var test = 1',
      '// #if flag == 2',
      '// # var test = 2',
      '// #else',
      'var test = 3',
      '// #endif',
      'var cont'
    ].join('\n')
    assert.throws(function () {
      new Parser({flag: 1}).parse(data)
    }, /got #if expected #elif, #else, #endif/)
  })
})
