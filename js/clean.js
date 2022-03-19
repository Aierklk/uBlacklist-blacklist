const fs = require('fs/promises')
const tldjs = require('tldjs')
const excludeList = require('./exclude')

const HEAD = `*://*.`
const TAIL = `/*`
const SBR = `\r\n`
const CHARTSET = 'utf-8'

const BR = /\r?\n/
const HN = /\*?\:?\/\/|\*\.|\/\*/g

let TOTALCOUNT = 0
let ADDEDCOUNT = 0
let CONFIG = {}
const READERROR = []
const WRITEERROR = []

const BASEPATH = '../'
const JSONPATH = `${BASEPATH}json/`
const configFile = `${JSONPATH}config.json`
const cacheFile = `${BASEPATH}cache.txt`
const listFile = `${BASEPATH}blacklist.txt`

/**
 * 读取文件
 * @param {string} path 
 * @param {boolean} throwError
 * @returns {Promise<Buffer>}
 */
const readFile = (path, throwError) => fs.readFile(path, CHARTSET).catch(error => {
    READERROR.push(`read '${path}' error... ${error}`)
    if (throwError) {
        throw error
    }
})

/**
 * 写入文件
 * @param {string} file 
 * @param {buffer} data 
 * @param {boolean} throwError
 * @returns {Promise<void>}
 */
const writeFile = (file, data, throwError) => fs.writeFile(file, data, CHARTSET).catch(error => {
    WRITEERROR.push(`write '${file}' error... ${error}`)
    if (throwError) {
        throw error
    }
})


/**
 * 读取配置文件
 */
 const readConfig = async function () {
    await readFile(configFile, true)
        .then(config => CONFIG = JSON.parse(config))
    
    return CONFIG
}

/**
 * 写入配置
 * @param {string} key 
 * @param {string | number | boolean | Array} value 
 */
const writeConfig = async function (key, value) {
    const hasKey = CONFIG.hasOwnProperty(key)
    if (hasKey) {
        CONFIG[key] = value
        await writeFile(configFile, CONFIG)
        return true
    } else {
        return false
    }
}

/**
 * 拼接数据
 * @param {string} value 
 * @returns {string}
 */
const splice = function (value) {
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
        // TODO: 更好的检查排除列表
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
    if (!list.size) {
        return
    }
    return readFile(listFile)
        .then(data => {
            const array = new Set(data.split(BR))
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
            const l = array.length
            TOTALCOUNT = l

            for (let i = 0; i < l; i++) {

                let item = array[i]
                if (item.startsWith('@')) {
                    // TODO: 检查blacklist中是否存在
                    continue
                }

                item = item.replace(HN, '')
                const parse = tldjs.parse(item)

                if (exclude(parse)) {
                    continue
                }

                switch (CONFIG.mode) {
                    case 'domain':
                        cleanList.add(splice(parse.domain))
                        break
                    case 'hostname':
                        cleanList.add(splice(parse.hostname))
                        break
                }
            }

            return cleanList
        })
        .then(cleanList => {
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
            console.info(`本次数据量总计：${TOTALCOUNT}条，添加：${ADDEDCOUNT}条。`)
        })
}

init()