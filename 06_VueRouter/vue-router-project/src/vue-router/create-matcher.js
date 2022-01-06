import { createRouteMap } from "./create-route-map"

export function createMatcher(routes) {
    // 路径和记录进行匹配
    let { pathMap } = createRouteMap(routes)

    // 动态加载路由（动态路由实现，将新的路由插入到老的路由映射表中）
    // 找到对应的父记录，给他单独添加一个儿子记录
    function addRoutes(routes) {
        // 将新的路由添加到路由表pathMap中
        createRouteMap(routes, pathMap)
    }

    function match(path) {
        return pathMap[path]
    }


    return {
        addRoutes,
        match
    }
}