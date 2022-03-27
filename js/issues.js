const {writeFile} = require('./base')

const list = process.argv[2]

const BASEPATH = `../`
const cacheFile = `${BASEPATH}cache.txt`

writeFile(cacheFile, list.join(''), true)