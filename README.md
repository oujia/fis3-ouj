# fis3-ouj
基于FIS3的前端组件化解决方案

### 文档

- coming soon

### 使用方法

**安装**

```
npm install -g fis3
npm install -g fis3-ouj
```

**配置使用**
```js
// vi fis-conf.js

fis.require('ouj')(fis);

```

**目录结构**
```
site
 ├── widget  #组件的资源目录
 │     ├── header
 │     │     ├── header.html
 │     │     ├── js
 │     │     ├── sass
 │     │     └── img
 │     └── footer
 │           ├── footer.html
 │           ├── js
 │           ├── sass
 │           └── img
 │
 ├── page  #模板页面文件目录，也包含用于继承的模板页面
 │     ├── index.html
 │     └── book_index.html 
 │
 ├── statics  #非组件静态资源目录，包括模板页面引用的静态资源和其他静态资源
 │     ├── js
 │     ├── sass
 │     └── img
 │
 ├── component  #JS组件，CSS组件， [参考component规范](https://github.com/componentjs/component) 
 ├── test   #测试相关目录
 ├── fis-conf.js  #配置文件
 ├── debug.sh  #开发环境执行命令
 ├── prod.sh  #生成环境执行命令
 └── map.json
```
