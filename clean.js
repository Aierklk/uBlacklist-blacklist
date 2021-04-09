const fs = require('fs')
const tldjs = require('tldjs')


const head = '*://'
const tail = '/*'


const charSet = 'utf8'
const cacheFile = './cache.txt'
const listFile = './blacklist.txt'


// 拼接数据
const splic = function (value, isIp) {

    if (isIp) {
        return head + value + tail
    }

    return head + '*.' + value + tail
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

        clearCache()
    })
}


// 去重
const uniqueDate = function (list) {

    fs.readFile(listFile, charSet, (err, data) => {
        if (err) {
            throw err
        }
    
        const array = new Set(data)

        for (const item of list) {
            array.add(item)
        }

        writeData(Array.from(array).join('\r\n'))
    })
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

        
        const result = tldjs.parse(item)

            
        if (!result.isValid) {
            continue 
        }


        if (result.isIp) {
            cleanList.add(splic(result.hostname, true))
        } else {
            cleanList.add(splic(result.domain))
        }
    }


    if (cleanList.size) {
        uniqueDate(cleanList)
    }
})