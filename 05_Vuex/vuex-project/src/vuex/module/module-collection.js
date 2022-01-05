import { forEach } from "../utils"
import Moudle from "./moudle"

class ModuleCollection {
    constructor(options) {
        // 对数据进行格式化操作
        this.root = null
        this.register([], options)
    }
    getNamespace(path) {
        // 返回一个字符串 a/b/c
        let root = this.root
        let ns = path.reduce((ns, key) => {
            let module = root.getChild(key)
            root = module
            return module.namespaced ? ns + key + '/' : ns
        }, '')
        return ns
    }
    register(path, rawModule) {
        let newModule = new Moudle(rawModule)
        rawModule.newModule = newModule //  自定义属性
        if (path.length == 0) {
            // 根模块
            this.root = newModule
        } else {
            // [a] // [a,c]
            // 找父亲
            let parent = path.slice(0, -1).reduce((memo, current) => {
                return memo.getChild(current)
            }, this.root)
            parent.addChild(path[path.length - 1], newModule)
        }

        if (rawModule.modules) {
            // 存在子模块注册
            forEach(rawModule.modules, (module, key) => {
                this.register(path.concat(key), module)
            })
        }
    }
}

export default ModuleCollection