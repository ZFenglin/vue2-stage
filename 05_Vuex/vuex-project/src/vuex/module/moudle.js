import { forEach } from "../utils"

class Moudle {
    constructor(rootModule) {
        this._raw = rootModule
        this._children = {}
        this.state = this._raw.state
    }
    getChild(childName) {
        return this._children[childName]
    }
    addChild(childName, module) {
        this._children[childName] = module
    }
    forEachGetter(cb) {
        this._raw.getters && forEach(this._raw.getters, cb)
    }
    forEachMutation(cb) {
        this._raw.mutations && forEach(this._raw.mutations, cb)
    }
    forEachAction(cb) {
        this._raw.actions && forEach(this._raw.actions, cb)
    }
    forEachChild(cb) {
        this._children && forEach(this._children, cb)
    }
    // 用于于表示他自己是否写了namespaced
    get namespaced() {
        return !!this._raw.namespaced
    }
}

export default Moudle