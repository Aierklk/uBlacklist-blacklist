const tldjs = require('tldjs')
const excludeList = require('./exclude')
const {READERROR, WRITEERROR, readFile, writeFile} = require('./base')

const HEAD = `*://*.`
const TAIL = `/*`
const SBR = `\r\n`

const BR = /\r?\n/
const HN = /\*?\:?\/\/|\*\.|\/\*/g

let TOTALCOUNT = 0
let ADDEDCOUNT = 0
let REMOVEDCOUNT = 0
let CONFIG = {}
const removeList = []

const BASEPATH = `../`
const JSONPATH = `${BASEPATH}json/`
const configFile = `${JSONPATH}config.json`
const cacheFile = `${BASEPATH}cache.txt`
const listFile = `${BASEPATH}blacklist.txt`

/**
 * 读取配置文件
 */
const readConfig = async function () {
    await readFile(configFile, true)
        .then(config => CONFIG = JSON.parse(config))
    
    return CONFIG
}

/**
 * 拼接数据
 * @param {string} value 
 * @param {string} requireURI 
 * @returns {string | null}
 */
const splice = function (value, requireURI) {
    if (!value) {
        return null
    }

    if (CONFIG.reserveRequireURI) {
        value += requireURI
    }

    return HEAD + value + TAIL
}

/**
 * 清除缓存
 */
const cleanCache = function () {
    writeFile(cacheFile, '')
}

/**
 * 排除
 * TODO: 更好的检查排除列表
 * @param {tldjs.parse} parse 
 * @returns {boolean} true 排除当前值，false 不排除当前值
 */
const exclude = function (parse) {
    if (!parse.isValid) {
        return true 
    }

    if (parse.isIp && CONFIG.blackIP) {
        return false
    } else if (parse.isIp && !CONFIG.blackIP) {
        return true
    }

    for (const exclude of excludeList) {
        if (parse.domain.includes(exclude)) {
            return true
        }
    }

    return false
}

/**
 * 去重
 * @param {string[]} list 
 * @returns {Promise<void>}
 */
const unique = async function (list) {
    if (!list.size && !removeList.length) {
        return
    }
    return readFile(listFile)
        .then(data => {
            const blacklist = data.split(BR)
            removeList.forEach((item1) => {
                blacklist.forEach((item2, index) => {
                    const result = item2.includes(item1)
                    if (result) {
                        blacklist.splice(index, 1)
                        REMOVEDCOUNT++
                    }
                })
            })

            const array = new Set(blacklist)
            const oldSize = array.size
            list.forEach(item => array.add(item))
            ADDEDCOUNT = array.size - oldSize
            return writeData(Array.from(array).join(SBR))
        })
}

/**
 * 写入数据
 * @param {*} list
 */
const writeData = async function (list) {
    return writeFile(listFile, list)
        .then(() => {
            CONFIG.needCleanCache && cleanCache()
        })
}

/**
 * 读取缓存文件
 */
const readCacheFile = async function () {
    await readFile(cacheFile)
        .then(data => {
            const cleanList = new Set()
            const array = data.split(BR)
            const l = TOTALCOUNT = array.length

            for (let i = 0; i < l; i++) {

                const item = array[i].replace(HN, '')
                const parse = tldjs.parse(item)
                const requireURI = item.replace(parse.hostname, '')

                if (item.startsWith('@')) {
                    removeList.push(parse.hostname)
                    continue
                }

                if (exclude(parse)) {
                    continue
                }

                cleanList.add(splice(parse[CONFIG.mode], requireURI))
            }

            return unique(cleanList)
        })
}


/**
 * 初始化
 */
const init = async function (config) {
    if (config) {
        CONFIG = config
    } else {
        await readConfig()
    }

    readCacheFile()
        .then(() => {
            console.assert(!READERROR.length, READERROR)
            console.assert(!WRITEERROR.length, WRITEERROR)
            console.info(`本次数据量总计：${TOTALCOUNT - 1}条。添加：${ADDEDCOUNT}条，移除：${REMOVEDCOUNT}条。`)
        })
}

init()