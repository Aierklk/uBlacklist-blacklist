const {writeFile} = require('./base')

const list = process.argv[2]

const BASEPATH = `../`
const cacheFile = `${BASEPATH}cache.txt`

if (typeof list === 'string') {
    writeFile(cacheFile, list, true)
} else {
    throw 'input is not a string.'
}
