# 引言

Components Router 是一个适用于 [Vue.js(3.0)](http://v3.vuejs.org) 组件式路由管理器，可以像写组件一样写路由，但仅可在 [Composition API](https://v3.vuejs.org/api/composition-api.html) 下使用，所有功能都不会注入到 `this`上，包含的功能有：

- 模块化构建路由层级
- 跳转中止/重定向
- 路径参数、查询参数、通配符
- 带有自动激活的 CSS class 的链接
- HTML5 历史模式或 hash 模式
- 声明重定向路由组件
- 声明未找到路由组件
