const fs = require('fs')
const tldjs = require('tldjs')
const excludeList = require('./exclude').excludeList


const head = '*://'
const tail = '/*'


const charSet = 'utf8'
const cacheFile = './cache.txt'
const listFile = './blacklist.txt'

const clearCacheFlag = true


// 拼接数据
const splic = function (value) {

    return head + value + tail
}


// 清除缓存
const clearCache = function () {

    fs.writeFile(cacheFile, '', charSet, (err) => {

        if (err) {
            throw err
        }
    })
}


// 写入数据
const writeData = function (list) {

    fs.writeFile(listFile, list, charSet, (err) => {

        if (err) {
            throw err
        } 

        clearCacheFlag && clearCache()
    })
}


// 去重
const unique = function (list) {

    fs.readFile(listFile, charSet, (err, data) => {
        if (err) {
            throw err
        }
    
        const array = new Set(data.split('\r\n'))

        for (const item of list) {
            array.add(item)
        }

        writeData(Array.from(array).join('\r\n'))
    })
}


// 排除
const exclude = function (item, isValid, hostname) {

    if (!isValid || !hostname) {
        return true 
    }

    if (item.startsWith('@')) {
        return true
    }


    for (const exclude of excludeList) {
        if (hostname.includes(exclude)) {
            return true
        }
    }

    return false
}


// 读取文件
fs.readFile(cacheFile, charSet, (err, data) => {


    if (err) {
        throw err
    }


    const cleanList = new Set()
    const array = data.split('\n')


    for (let item of array) {

        item = item.replace(head, '')
        item = item.replace(tail, '')

        
        let {
            isValid,
            isIp,
            hostname
        } = tldjs.parse(item)


        if (exclude(item, isValid, hostname)) {
            continue
        }


        const length = hostname.split('.').length

        
        ;(length === 2 && !isIp)
            ? (hostname = '*.' + hostname) 
            : null
        
        ;(hostname.startsWith('www') && length === 3)
            ? (hostname = hostname.replace('www', '*'))
            : null


        cleanList.add(splic(hostname))
    }


    if (cleanList.size) {
        unique(cleanList)
    }
})