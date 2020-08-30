export default {
    title: 'Zain UI',
    menu: ['Getting Started', 'Components'],
    /** 忽略文件 */
    ignore: ['README.DEV.md'],
    /** GitHub Pages 指定在哪个子目录中部署文件 */
    base: '/zain-ui',
    /** build 构建输出目标文件夹 */
    dest: '../../docs',
    typescript: true,
    themeConfig: {
        mode: 'dark',
        /** 默认代码不展开 */
        showPlaygroundEditor: false
    }
}
