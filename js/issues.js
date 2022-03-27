const {writeFile} = require('./base')

const list = process.argv[2]

const BASEPATH = `../`
const cacheFile = `${BASEPATH}cache.txt`

console.info(typeof list)

writeFile(cacheFile, list.join(''), true)