# uBlacklist-blacklist
使用uBlacklist插件对域名进行屏蔽

## 说明
屏蔽域名列表

请注意，本名单仅是个人日常使用时的屏蔽域名记录，并不适合所有人。如有有问题请提issues。

## 贡献列表
### 方式1：pull request
````javascript
git checkout xxx
npm install
# input any text to cache.text
npm run start
````
### 方式2（推荐）：issue
发起一个新的issue，Labels选择`autocommit`，在issue中列出想要添加或剔除的值，然后submit。
例如

````text
title: any text
comment：
*://www.xxxx.com/*
@*://*.yyyy.com/*
````
提出issue后会我会对值进行检查，通过后我会回复ok，此时机器人会自动合并到列表，合并成功后会关闭issue。 

##### 以@开头的值会从列表中剔除。

### 配置文件 `json/config.json`
````javascript
{
    "blacklistIndex": 0, // 屏蔽名单索引
    "cacheIndex": 0, // 缓存名单索引
    "needCleanCache": true, // 清理缓存文件
    "reserveRequireURI": true, // 保留requireURI
    "blackIP": true, // 屏蔽IP
    "mode": "hostname", // 模式 'hostname' | 'domain'
    "inspectCount": 30 // 检查次数
}
````
### cache文件
将ublacklist的中列表拷贝进 `cache.txt` ，执行命令 `npm run start`

以 `@` 开头的值将在 `blacklist.txt` 中被移除，匹配模式为 `hostname`

## 订阅地址
https://raw.githubusercontent.com/Aierklk/uBlacklist-blacklist/main/blacklist.txt

## 插件地址
Chrome: https://chrome.google.com/webstore/detail/ublacklist/pncfbmialoiaghdehhbnbhkkgmjanfhe

Safari: https://apps.apple.com/us/app/ublacklist-for-safari/id1547912640

Firefox: https://addons.mozilla.org/en-US/firefox/addon/ublacklist/

## Features
- [X] cache合并
- [X] issues合并
- [X] issues剔除
- [ ] blacklist检查