## Fas —— 前端部署工具

## 特性

* 支持七牛 CDN 空间上传
* 快速支持 vue 项目静态化


<img src="http://qnimagestore.scoii.com/fas.svg" width="500">

## 安装

```bash
$ npm i -g fas-cli
```

## 用法

```bash
# 设置七牛 AK 和 SK
$ fas config

# 有两种方式上传，默认会上传 dist 目录所有文件

$ fas -b static # 将 dist 目录的所有文件上传至七牛空间 static，需要确保 static已经创建
```

### 高级配置

配置`package.json`:

```js
{
  ...
  "fas": {
    "name": "static",
    "dir": "dist"
  }
}
```

其中`name`对应七牛空间的`bucketName`，`dir`为指定上传至空间的本地目录

## License

MIT © [Jogis](https://github.com/yesvods)
