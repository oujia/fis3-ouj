var path = require('path');

module.exports = function(fis, isMount) {
    var sets = {
        'namespace': '',
        'statics': 'static2',
        'views': 'protected/views2'
    };

    var matchRules = {
        '/{widget,component,statics}/**': {
            isMod : true,
            release: '/${statics}/$0'
        },
        '/map.json': {
            release: '/${views}/config/map.json'
        },
        '/{widget,page}/**.html': {
            isMod : true,
            isHtmlLike : true,
            url: '$&', //此处注意，php加载的时候已带tpl目录，所以路径得修正
            release: '/${views}/$&'
        },
        '/doc/**': {
            release : false
        },
        '/statics/js/(**.js)': {
            isMod : false,
            release : '/${statics}/js/$1'
        },
        '/statics/js/{mod,jquery-1.11.3,underscore}.js': {
            isMod : false,
            packTo: '/${statics}/pkg/lib.js'   
        },
        '/statics/js/mod.js': {
            packOrder: -100
        },
        '*.scss': {
            parser: fis.plugin('sass'), //启用fis-parser-sass插件
            rExt: '.css'
        },
        '/statics/sass/(**.scss)': {
            useSprite: true,
            postprocessor: fis.plugin('autoprefixer', {
                browsers: ['> 1%', 'last 2 versions'],
                cascade: true
            }),
            release: '/${statics}/css/$1'
        },
        '/statics/img/(**.{png,jpg,gif,jpeg})': {
            release: '/${statics}/img/$1',
            url: '/${statics}/img/$1'
        },
        '/statics/sass/(**.{png,jpg,gif,jpeg})': {
            release: '/${statics}/img/sprite/$1',
            url: '/${statics}/img/sprite/$1'
        },
        '_*.scss': {
            release: false
        },
        '/{widget,component}/**.{css,scss,less,sass}': {
            useSprite: true,
            postprocessor: fis.plugin('autoprefixer', {
                browsers: ['> 1%', 'last 2 versions'],
                cascade: true
            })
        },
        '/{widget,component}/*/sass/(**.png)': {
            release: '/${statics}/img/sprite/$1',
            url: '/${statics}/img/sprite/$1'
        },
        '::package': {
            //打包合拼js
            postpackager: fis.plugin('loader', {
                resourceType: 'mod',
                allInOne: {
                    js: '/${statics}/pkg/${filepath}.js',
                    css: '/${statics}/pkg/${filepath}.css'
                },
                useInlineMap: true
            }),
            //合拼图片
            spriter: fis.plugin('csssprites', {
                scale : 1,
                margin: 10
            })
        }
    }
    function mount() {
        fis.set('system.localNPMFolder', path.join(__dirname, 'node_modules'));
        fis.set('project.ignore', ['**.cmd', '**.sh']);

        fis.util.map(sets, function(key, value) {
            fis.set(key, value);
        });

        fis.util.map(matchRules, function(selector, rules) {
            fis.match(selector, rules);
        });

        // 模块化支持
        fis.hook('module', {
            mode: 'commonJs'
        });
        
        // map.json
        // fis.match('::package', {
        //     postpackager: function createMap(ret) {
        //         var path = require('path')
        //         var root = fis.project.getProjectPath();
        //         var map = fis.file.wrap(path.join(root, fis.get('namespace') + '-map.json'));;
        //         map.setContent(JSON.stringify(ret.map, null, map.optimizer ? null : 4));
        //         ret.pkg[map.subpath] = map;
        //     }
        // });
        
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
    }

    if (isMount !== false) {
        mount();
    }

    return {
        loadPath: path.join(__dirname, 'node_modules'),
        sets: sets,
        matchRules: matchRules
    }
};
