const developmentPlugins = [require('react-refresh/babel')];

const productionPlugins = [
    // babel-preset-react-optimize
    require('@babel/plugin-transform-react-constant-elements'),
    require('@babel/plugin-transform-react-inline-elements'),
    require('babel-plugin-transform-react-remove-prop-types')
];

/**
 * JavaScript 编译器模块
 * 已知触发途径：
 * require('@babel/register') 参数中添加 extensions 属性后执行会触发
 * webpack 设置有 loader: 'babel-loader' 执行后触发
 * @param {*} api
 */
module.exports = (api) => {
    const web = process.env.WEB_ENV === 'true';
    const development = process.env.BUILD_ENV === 'development';
    const commonjs = process.env.BABEL_ENV === 'cjs';
    // console.log('zain>>>>>process.env.WEB_ENV', process.env.WEB_ENV);
    // console.log('zain>>>>>process.env.BABEL_ENV', process.env.BABEL_ENV);

    /**
     * 必须加上 api.cache(true); 或 api.cache(false);
     * api.cache(true); 永久缓存计算出的配置，不再调用该函数。
     * api.cache(false); 不要缓存此配置，并且每次都重新执行该功能。
     * See docs about api at https://babeljs.io/docs/en/config-files#apicache
     */
    // 编译朱家角，参数必须为 false （gulp.series 同步执行两个任务，参数为 false 才能监听到 process.env.BABEL_ENV 的变化）
    api.cache(web ? true : false);

    return {
        presets: [
            // @babel/preset-env will automatically target our browserslist targets
            ...(web ? [require('@babel/preset-env')] : [[require('@babel/preset-env'), { modules: commonjs ? 'commonjs' : false }]]),
            require('@babel/preset-typescript'),
            [require('@babel/preset-react'), { development }]
        ],
        plugins: [
            // 支持类(class)中的静态函数、箭头函数...编译
            [require('@babel/plugin-proposal-class-properties'), { loose: true }],
            ...(web ? [] : [[require('@babel/plugin-transform-runtime'), { useESModules: !commonjs }]]),
            ...(development ? developmentPlugins : productionPlugins)
        ]
    };
};
