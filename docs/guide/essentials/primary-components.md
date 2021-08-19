# 主要组件

在 Components Router 中通常使用的组件有三种：

- 路由组件（作为根组件）: BrowserRouter（history 模式） 和 HashRouter（hash 模式）
- 路径匹配组件: Route 和 Routes
- 导航组件: RouterLink 和 Navigate

## 路由器

每个 Components Router 应用程序的核心应该是路由器组件。对于 Web 项目，components-router 提供 `<BrowserRouter>` 和 `<HashRouter>` 路由器。两者之间的主要区别在于它们存储 URL 和与 Web 服务器通信的方式。

- `<BrowserRouter>` 使用常规 URL 路径。 这些通常是外观最好的网址，但它们要求你的服务器配置正确。 配置[HTML5 History 模式
  ](/guide/essentials/history-mode.html)文档。
- `<HashRouter>` 将当前位置存储在 URL 的哈希部分中，因此 URL 看起来类似于 `http://example.com/#/your/page` , 由于哈希从不发送到服务器，因此这意味着不需要特殊的服务器配置。

要使用路由器，只需确保将其渲染在元素层次结构的根目录下即可。 通常，你会将顶级 `<App>` 元素包装在路由器中，如下所示：

```tsx
import { BrowserRouter as Router } from 'components-router'
import { defineComponent } from 'vue'

import App from './App.vue'

export default defineComponent({
  setup() {
    return () => (
      <Router>
        <App />
      </Router>
    )
  }
})
```

## 路线匹配器

有两个路线匹配组件：Routes 和 Route。渲染 `<Routes>` 时，它会搜索其子元素 `<Route>`，以查找其路径与当前 URL 匹配的元素。当找到一个时，它将渲染该 `<Route>`并忽略所有其它路由。这意味着你应该将 `<Route>`包含更多特定路径（通常较长）的路径放在不那么特定路径之前。

如果没有`<Route>`匹配，则`<Routes>` 不渲染任何内容（null）。

```tsx
import { Routes, Route } from 'components-router'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => (
      <Routes>
        // 如果当前URL是/，那么将渲染此路由，而其余路由将被忽略
        <Route path="/">
          <h2>Home</h2>
        </Route>
        // 如果当前URL是/about，那么将渲染此路由，而其余路由将被忽略
        <Route path="/about">
          <h2>About</h2>
        </Route>
        // 请注意这两个路由的顺序。 更具体的path="/contact/id"位于path="/contact"之前，因此在查看单个联系人时将显示这个<Route>
        <Route path="/contact/:id">
          <h2>Contact</h2>
        </Route>
        <Route path="/contact">
          <h2>AllContact</h2>
        </Route>
      </Routes>
    )
  }
})
```

## 导航

Components Router 提供了一个`<RouterLink>`组件来在你的应用程序中创建链接。 无论在何处渲染`<RouterLink>`，锚点都将渲染在 HTML 文档中。

任何时候要强制导航，都可以渲染`<Navigate>`。渲染`<Navigate>`时，它将会使用其 props 进行导航。

```tsx
<RouterLink to="/">Home</RouterLink>
// <a href="/">Home</a>

<Navigate to="/courses" />
// 直接跳转至/courses
```

**路径皆相对**，详情文档请查看[RouterLink](/api/#routerlink)。
