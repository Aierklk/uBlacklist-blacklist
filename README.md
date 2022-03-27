# uBlacklist-blacklist
使用uBlacklist插件对域名进行屏蔽

## 说明
屏蔽域名列表

请注意，本名单仅是个人日常使用时的屏蔽域名记录，并不适合所有人。如有有问题请提issues。
## 使用
````javascript
npm install
npm run start
````
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
- [ ] issues合并
- [ ] issues剔除
- [ ] blacklist检查