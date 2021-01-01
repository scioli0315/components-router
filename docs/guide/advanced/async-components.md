# 异步组件

使用`defineAsyncComponent`创建一个只有在需要时才会加载的异步组件，请参考 Vue3 API [defineAsyncComponent](https://v3.cn.vuejs.org/api/global-api.html#defineasynccomponent)。

```tsx
import { Route, Routes } from 'components-router'
import { defineComponent, defineAsyncComponent } from 'vue'

import LoadingComponent from './components/LoadingComponent.vue'

const Home = defineAsyncComponent({
  loader: () => import('./components/Home.vue'),
  loadingComponent: LoadingComponent
})
const Hello = defineAsyncComponent({
  loader: () => import('./components/Hello.vue')
  loadingComponent: LoadingComponent
})

export default defineComponent({
  setup() {
    return () => (
      <Routes>
        <Route path="/">
          <Home />
        </Route>
        <Route path="hello">
          <Hello />
        </Route>
      </Routes>
    )
  }
})
```
