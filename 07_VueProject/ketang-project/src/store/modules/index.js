// 利用webpack的context搜索文件夹
const files = require.context('.', true, /\.js$/);

const modules = {};

files.keys().forEach(key => {
    const path = key.replace(/(\.\/|\.js)/g, ''); // 去除开头的./和后面的.js  ./home/actions.js ====> home/actions
    if (path === 'index') return;
    let [namespace, type] = path.split('/');
    if (!modules[namespace]) {
        modules[namespace] = {
            namespaced: true, // 都增加命名空间
        };
    }
    modules[namespace][type] = files(key).default; // 获取文件导出结果
})

export default modules;