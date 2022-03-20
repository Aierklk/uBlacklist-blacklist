const fs = require('fs/promises')
const CHARTSET = 'utf-8'

const READERROR = []
const WRITEERROR = []

exports.READERROR = READERROR
exports.WRITEERROR = WRITEERROR

/**
 * 读取文件
 * @param {string} path 
 * @param {boolean} throwError
 * @returns {Promise<Buffer>}
 */
exports.readFile = (path, throwError) => fs.readFile(path, CHARTSET).catch(error => {
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
exports.writeFile = (file, data, throwError) => fs.writeFile(file, data, CHARTSET).catch(error => {
    WRITEERROR.push(`write '${file}' error... ${error}`)
    if (throwError) {
        throw error
    }
})

/**
 * 写入JSON
 * @param {string} file
 * @param {boolean} needHasKey
 * @param {string} key 
 * @param {string | number | boolean | Array} value 
 */
exports.writeJSON = (file, needHasKey, key, value) => {
    readFile(file)
        .then(data => {
            let hasKey
            needHasKey
                ? hasKey = data.hasOwnProperty(key)
                : hasKey = true

            if (hasKey) {
                data[key] = value
                return writeFile(file, CONFIG)
            } else {
                return false
            }
        })
}