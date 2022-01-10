import ElMenu from "./el-menu.vue";
import ElMenuItem from "./el-menu-item.vue";
import ElSubmenu from "./el-submenu.vue";
import resub from "./resub.vue";

// 复杂组件推荐JSX
export default {
  props: {
    data: {},
  },
  components: {
    ElMenu,
    ElMenuItem,
    ElSubmenu,
    resub,
  },
  render() {
    let renderChildren = (data) => {
      return data.map(
        child => {
          if (child.children) {
            return <el-submenu>
              <template slot="title">{child.title}</template>
              {renderChildren(child.children)}
            </el-submenu>
          } else {
            return <el-menu-item>{child.title}</el-menu-item>
          }
        }
      )
    }
    return (
      <el-menu>
        {renderChildren(this.data)}
      </el-menu>
    )
  }
};
