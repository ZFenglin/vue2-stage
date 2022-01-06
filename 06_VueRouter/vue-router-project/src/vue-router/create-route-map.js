export function createRouteMap(routes, oldPathMap) {
    // 如果有oldPathMap，则需要将routes格式化和哦iu，放到oldPathMap中
    let pathMap = oldPathMap || Object.create(null)
    routes.forEach(route => {
        addRouteRecord(route, pathMap)
    });
    return {
        pathMap
    }
}

function addRouteRecord(route, pathMap, parent) {
    let path = parent ? `${parent.path}/${route.path}` : route.path
    // 将记录和路径关联起来
    let record = {
        // 最终路径会匹配到这个记录，里面可以自定义属性
        path: path,
        component: route.component,
        props: route.props || {},
        parent: parent,
    }
    pathMap[path] = record
    route.children && route.children.forEach(childRoute => {
        addRouteRecord(childRoute, pathMap, record) // 循环儿子时，父路径也传入
    })
}