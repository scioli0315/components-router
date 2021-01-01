# 起步

用 Vue.js + Components Router 创建单页应用，是非常简单的。使用 Vue.js ，我们已经可以通过组合组件来组成应用程序，当您要把 Components Router 添加进来，我们需要做的是，使用 (Route) 包裹您的组件 (components)，并告诉 Components Router 显示组件的 path 即可。下面是个基本例子：

```vue
// App.vue
<script lang="tsx">
import { Navigate, Route, RouterLink, Routes } from 'components-router'
import { defineComponent } from 'vue'

const Home = () => <div>Home</div>
const Hello = () => <div>Hello</div>
const About = () => <div>About</div>

export default defineComponent({
  setup() {
    return () => (
      <>
        <ul>
          <li>
            <RouterLink to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/hello">Hello</RouterLink>
          </li>
          <li>
            <RouterLink to="/about">About</RouterLink>
          </li>
        </ul>
        <Routes>
          <Route path="/home">
            <Navigate to="/" />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/hello">
            <Hello />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Routes>
      </>
    )
  }
})
</script>
```

```vue
// Router.vue
<script lang="tsx">
import { HashRouter as Router } from 'components-router'
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
</script>
```

```typescript
// main.ts
import { createApp } from 'vue'

import Router from './Router.vue'

createApp(Router).mount('#app')
```
