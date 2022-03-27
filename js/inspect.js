const { Resolver } = require('dns')
const { readFile, writeFile, writeJSON } = require('./base')

const BASEPATH = `../`
const JSONPATH = `${BASEPATH}json/`
const configFile = `${JSONPATH}config.json`
const inspectJSON = `${JSONPATH}inspect.json`
const cacheFile = `${BASEPATH}cache.txt`
const listFile = `${BASEPATH}blacklist.txt`

let resolver = null
let inspectCount = null

/**
 * 读取配置文件
 */
const readConfig = function () {
    readFile(configFile)
        .then(config => inspectCount = config.inspectCount)
}

/**
 * 读取inspect文件
 */
const readInspect = function () {
    return readFile(inspectJSON)
        .then(data => { return Promise.resolve(JSON.parse(data)) })
}


const init = function () {
    resolver = new Resolver()
    resolver.setServers(['114.114.114.114', '8.8.8.8'])
}

init()




resolver.resolve4('example.org', (err, addresses) => {
  // ...
})