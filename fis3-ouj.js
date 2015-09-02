var fis = module.exports = require('fis3');

fis.require.prefixes.unshift('fis3-ouj');
fis.cli.name = 'fis3-ouj';
fis.cli.info = require('./package.json');

fis.set('project.ignore', ['**.cmd', '**.sh', 'fis3-conf.js', 'fis-conf.js']);

var domain = "";

var statics = '/static2';
var views = '/protected/views2';

//模块化方案，本项目选中CommonJS方案(同样支持异步加载哈)
fis.hook('module', {
  mode: 'commonJs'
});

// widget发布时产出到 /static 目录下
fis.match('/{widget,component,statics}/**', {
    isMod : true,
    release: statics + '/$0' 
});

//资源配置表
fis.match('/map.json',{
    release: views + '/config/map.json'
});

//页面和widget模板
fis.match("/{widget,page}/**.html",{
    isMod : true,
    isHtmlLike : true,
    url: '$&', //此处注意，php加载的时候已带tpl目录，所以路径得修正
    release: views + '/$&'
});

//文档不发布
fis.match("/doc/**",{
    release : false
});

//开启组件同名依赖
// fis.match('*.{html,js}', {
//   useSameNameRequire: true
// });

//合拼公共库
fis.match('/statics/js/(**.js)', {
    isMod : false,
    release : statics + '/js/$1'
}).match('/statics/js/{mod,jquery-1.11.3,underscore}.js', {
    isMod : false,
    packTo: statics + '/pkg/lib.js'
});

//mod.js顺序前移
fis.match('/statics/js/mod.js', {
    packOrder: -100
});

fis.match('*.scss', {
    parser: fis.plugin('sass'), //启用fis-parser-sass插件
    rExt: '.css'
})

//statics样式
fis.match('/statics/sass/(**.scss)', {
    useSprite: true,
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['> 1%', 'last 2 versions'],
        cascade: true
    }),
    release: statics + '/css/$1'
});

//statics图片合拼
fis.match('/statics/img/(**.{png,jpg,gif,jpeg})', {
    release: statics + '/img/$1',
    url: statics + '/img/$1'
}).match(/^\/statics\/sass\/(.*\.(png|jpg|gif|jpeg))$/i, {
    release: statics + '/img/sprite/$1',
    url: statics + '/img/sprite/$1'
});

fis.match('_*.scss', {
    release: false
});

// widget样式
fis.match('/{widget,component}/**.{css,scss,less,sass}', {
    useSprite: true,
    postprocessor: fis.plugin('autoprefixer', {
        browsers: ['> 1%', 'last 2 versions'],
        cascade: true
    })
});

fis.match('/{widget,component}/*/sass/(**.png)', {
    release: statics + '/img/sprite/$1',
    url: statics + '/img/sprite/$1'
});

fis.match('::package', { 
    //打包合拼js
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        allInOne: {
            js: statics + '/pkg/${filepath}.js',
            css: statics + '/pkg/${filepath}.css'
        },
        useInlineMap: true
    }),
    //合拼图片
    spriter: fis.plugin('csssprites', {
        scale : 1,
        margin: 10
    })
});

fis.media('debug').match('*.{js,css,png}', {
    useHash: false,
    optimizer: null
});

fis.media('prod').match('*.{css,scss}', {
    useHash: true,
    optimizer: fis.plugin('clean-css')
}).match('*.js', {
    useHash: true,
    optimizer: fis.plugin('uglify-js', {
        mangle: {
            expect: ['require', 'define', '$'] //不想被压的
        }
    })
}).match('*.png', {
    useHash: true,
    optimizer: fis.plugin('png-compressor')
});