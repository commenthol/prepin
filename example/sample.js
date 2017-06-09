// #ifndef small
const big = require('./big-package')
// #else
// # let big // define the alternative
// #endif

if (big) {
  console.log('built with ' + big)
} else {
  console.log('small build...')
}
