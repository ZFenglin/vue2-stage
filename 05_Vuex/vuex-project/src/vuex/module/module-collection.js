import { forEach } from "../utils"
import Moudle from "./moudle"

class ModuleCollection {
    constructor(options) {
        // 对数据进行格式化操作
        this.root = null
        this.register([], options)
    }
    register(path, rootModule) {
        let newModule = new Moudle(rootModule)
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

        if (rootModule.modules) {
            // 存在子模块注册
            forEach(rootModule.modules, (module, key) => {
                this.register(path.concat(key), module)
            })
        }
    }
}

export default ModuleCollection