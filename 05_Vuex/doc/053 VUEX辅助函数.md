# VUEX辅助函数

## 辅助函数使用

```js
import {
    mapState,
    mapGetters,
    mapMutations
} from "./vuex/index";
export default {
    name: "app",
    // mapXXX返回的是对象
    methods: {
        ...mapMutations(["changeAge"]),
        changeAgeAsync(payload) {
            this.$store.dispatch("changeAge", payload);
        },
    },
    computed: {
        ...mapState(["name"]),
        ...mapGetters(["myAge"]),
    },
};
```

## VUEX设置辅助函数

```js
export function mapState(stateList) {
    let obj = {};
    for (let i = 0; i < stateList.length; i++) {
        let stateName = stateList[i];
        obj[stateName] = function() {
            return this.$store.state[stateName];
        };
    }
    return obj;
}

export function mapGetters(gettersList) {
    let obj = {};
    for (let i = 0; i < gettersList.length; i++) {
        let getterName = gettersList[i];
        obj[getterName] = function() {
            return this.$store.getters[getterName];
        };
    }
    return obj;
}

export function mapMutations(mutationsList) {
    let obj = {};
    for (let i = 0; i < mutationsList.length; i++) {
        obj[mutationsList[i]] = function(payload) {
            this.$store.commit(mutationsList[i], payload);
        };
    }
    return obj;
}

export function mapActions(actionsList) {
    let obj = {};
    for (let i = 0; i < actionsList.length; i++) {
        obj[actionsList[i]] = function(payload) {
            this.$store.dispatch(actionsList[i], payload);
        };
    }
    return obj;
}
```
