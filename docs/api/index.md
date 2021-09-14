---
sidebar: auto
---

# API 参考

## `Composition API`

Components Router 提供多少 Composition API 使用。

**⚡ 警告 ⚡** Composition API 仅可以在`setup()`中使用。

```tsx
import { useNavigate, useLocation, useParams, useQuery } from 'components-router'

export default defineComponent({
  setup() {
    // Composition API须在 setup 中使用
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const query = useQuery()
  }
})
```

### `useNavigate`

- **类型** `(): NavigateFunction`

```ts
interface NavigateFunction = (to: To | number, options: NavigateOptions = {})

interface NavigateOptions {
  replace?: boolean
  state?: State
}
```

useNavigate 返回一个 `navigate` 路径方法，你可以使用该路径方法编写编程式导航，参考[编程式导航](/guide/essentials/navigation.html)。

**⚡ 警告 ⚡** 目标路径的跳转与`<RouterLink>`行为一致，会相对于父级 Route 的 path 值，[参考`<RouterLink>`](/api/#routerlink)文档。

获取 `navigate` 路径方法：

```tsx
import { useNavigate } from 'components-router'

export default defineComponent({
  setup() {
    const navigate = useNavigate()
    function handleClick() {
      navigate('/home')
    }
    return () => <button onClick={handleClick}>Submit</button>
  }
})
```

### `useLocation`

- **类型** `(): Location`

`useLocation` 返回当前 URL 的 `Location` 对象。它是一个 `reactive` 对象，可以通过 `watch` 侦听 URL 变化。

获取 `location` 对象：

```typescript
import { useLocation } from 'components-router'
import { watch } from 'vue'

export default defineComponent({
  setup() {
    const location = useLocation()

    watch([location], () => {
      console.log(location.pathname)
    })
  }
})
```

`Location` 包含一下属性：

```typescript
{
  key: 'ac3df4',
  pathname: '/somewhere',
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

### `useParams`

- **类型** `(): Ref<Params>`

`useParams` 返回相对于当前组件的**父级**`<Route>`匹配到的路径参数，值为 `Ref` 对象，取值需要添加`.value`。

```tsx
import { Route, Routes, useParams } from 'components-router'

const Blog = defineComponent({
  setup() {
    // ！！！ 这里才能获取父级<Route>的路径参数
    const params = useParams()
    return () => <h2>{params.value.slug}</h2>
  }
})

const Home = defineComponent({
  setup() {
    // ！！！ 注意，这里是获取不到路径参数
    return () => (
      <Routes>
        <Route path="/">
          <h1>Home</h1>
        </Route>
        <Route path="/blog/:slug">
          <Blog />
        </Route>
      </Routes>
    )
  }
})
```

### `useQuery`

- **类型** `(): Ref<Query>`

  useQuery 返回一个`Ref`对象，表示 URL 查询参数。例如，对于路径 /foo?user=1，返回 `{user: "1"}`，如果没有查询参数，则返回空对象。

### `useBlocker`

- **类型** `(blocker: Blocker, when: Ref<boolean> | boolean = true): void`

  自定义回调操作，用于在离开页面之前提示用户。

  - `blocker` 回调路径方法，自定义执行操作后执行 tx.retry()。
    - 解构：`{action, location, retry} = tx`。
  - `when` 你可以始终渲染它，而可以通过 when 来阻止或允许进行相应的导航。

  ```tsx
  import { useBlocker } from 'components-router'
  export default defineComponent({
    setup() {
      const when = ref(true)

      useBlocker(({ action, location, retry }) => {
        // 你要做的事情
        console.log(action)
        console.log(location)
        retry()
      }, when)
    }
  })
  ```

### `usePrompt`

- **类型** `(message: Ref<string> | string, when: Ref<boolean> | boolean = true): void`

  使用 `window.confirm` 在用户离开页面之前提示用户。

  - `message` 提示用户的消息。
  - `when` 你可以始终渲染它，而可以通过 when 来阻止或允许进行相应的导航。

  ```tsx
  import { usePrompt } from 'components-router'
  export default defineComponent({
    setup() {
      const when = ref(true)

      usePrompt('你要说的话', when)
    }
  })
  ```

### `useHref`

- **类型** `(to: Ref<To> | To): Ref<string>`

  根据传入 To 值生成**相对于父级**`<Route>` 的超链接 href 值，值为 Ref 对象，取值需要添加`.value`。

  - `to` 要生成 href 的对象或字符串，详情可参考[to 文档](/api/#to-2)。

  ```ts
  // 若当前展示组件的父级<Route path>为 /about/user

  const href = useHref('/detail')
  console.log(href.value) // 输出：/detail

  // or
  const href = useHref('detail')
  console.log(href.value) // 输出：/about/user/detail

  //or
  const href = useHref('../detail')
  console.log(href.value) // 输出：/about/detail
  ```

### `useResolvedPath`

- **类型** `(to: Ref<To> | To): Ref<Path>`

  ```ts
  interface Path {
    pathname: string
    query: Query
    hash: string
  }
  ```

  根据传入 To 值获取**相对于父级**`<Route>`的 Path 值，值为 Ref 对象，取值需要添加`.value`。

  - `to` 要生成 Path 的对象或字符串，详情可参考[to 文档](/api/#to-2)。

  ```ts
  // 若当前展示组件的父级<Route path>为 /about/user

  const path = useResolvedPath('/detail')
  console.log(path.value) // 输出：{pathname: "/detail", query: {}, hash: ""}

  // or
  const path = useResolvedPath('detail')
  console.log(path.value) // 输出：{pathname: "/about/user/detail", query: {}, hash: ""}

  // or
  const path = useResolvedPath('../detail')
  console.log(path.value) // 输出：{pathname: "/about/detail", query: {}, hash: ""}
  ```

### `useMatch`

- **类型** `(pattern: Ref<PathPattern | string> | PathPattern | string): Ref<PathMatch | null>`

  ```ts
  type PathPattern = { path: string; caseSensitive?: boolean; end?: boolean }

  interface PathMatch<ParamKey extends string = string> {
    pattern: PathPattern
    pathname: string
    params: Params<ParamKey>
  }
  ```

  根据传入匹配规则，获取与当前 URL 的匹配值，值为 Ref 对象，取值需要添加`.value`。

  ```ts
  // 当前URL为/about/user
  const match = useMatch('/about/:type')

  console.log(match.value)
  // 输出：{path: "/about/:type", pathname: "/about/user", params: { type: "user" }}
  ```

## `<BrowserRouter>`

```tsx
import { BrowserRouter as Router, Route } from 'components-router'

export default defineComponent({
  setup() {
    return () => (
      <Router>
        <Route path="/">
          <h1>Home</h1>
        </Route>
        <Route path="/hello">
          <h1>Hello</h1>
        </Route>
      </Router>
    )
  }
})
```

### `basename`

- **类型** `string`

  属性值会添加到以 `Router` 为父级组件内的所有路由 `<Route>` “path”前。

  ```html
  <Router basename="/about">
    <Route path="user">
      <!--此路由的匹配path值为：/about/user -->
      <h1>/about/user</h1>
    </Route>
  </Router>
  ```

### `linkActiveClass`

- **类型** `string`
- **默认值** `"router-link-active"`

  全局配置 `<RouterLink> `默认激活的 class。参考 [`<RouterLink>`](/api/#routerlink)。

### `linkExactActiveClass`

- **类型** `string`
- **默认值** `"router-link-exact-active"`

  全局配置 `<RouterLink> `默认精确激活的 class。参考 [`<RouterLink>`](/api/#routerlink)。

## `<HashRouter>`

```tsx
import { HashRouter as Router, Route } from 'components-router'

export default defineComponent({
  setup() {
    return () => (
      <Router>
        <Route path="/">
          <h1>Home</h1>
        </Route>
        <Route path="/hello">
          <h1>Hello</h1>
        </Route>
      </Router>
    )
  }
})
```

### `basename`

- **类型** `string`

  属性值会添加到以 `Router` 为父级组件内的所有路由 `<Route>` “path”前。

  ```html
  <Router basename="/about">
    <Route path="user">
      <!--此路由的匹配path值为：/about/user -->
      <h1>/about/user</h1>
    </Router>
  </Routes>
  ```

### `linkActiveClass`

- **类型** `string`
- **默认值** `"router-link-active"`

  全局配置 `<RouterLink> `默认激活的 class。参考 [`<RouterLink>`](/api/#routerlink)。

### `linkExactActiveClass`

- **类型** `string`
- **默认值** `"router-link-exact-active"`

  全局配置 `<RouterLink> `默认精确激活的 class。参考 [`<RouterLink>`](/api/#routerlink)。

## `<RouterLink>`

`<RouterLink>` 组件支持用户在具有路由功能的应用中点击导航。 通过 `to` 属性指定目标地址。默认渲染成带有链接的 `<a>` 标签，可以通过配置 `custom` 属性进行自定义。

生成的目标地址会相对于当前组件的父级`<Route>`，其形式更像命令行`cd`的用法，例如：

```cpp
// 当前路径为 /app/dashboard

<RouterLink to="/stats">               // <a href="/stats">
<RouterLink to="stats">                // <a href="/app/dashboard/stats">
<RouterLink to="../stats">             // <a href="/app/stats">
<RouterLink to="../../stats">          // <a href="/stats">

// 命令行当前路径为 /app/dashboard
cd /stats                        // pwd is /stats
cd stats                         // pwd is /app/dashboard/stats
cd ../stats                      // pwd is /app/stats
cd ../../stats                   // pwd is /stats
```

### `to`

- **类型** `string | object`
- **required**

  表示目标路由的链接。当被点击后，内部会立刻把 [to](/api/#to-2) 的值传到 `history.push()`，这个值可以是一个字符串或者是描述目标位置的对象。

  **字符串形式**

  ```tsx
  <RouterLink to="/about">About</RouterLink>

  <RouterLink to="/courses?sort=name#the-hash">Courses</RouterLink>
  ```

  **对象形式**

  ```tsx
  <RouterLink
    to={{
      pathname: '/courses',
      query: { name: '张三' },
      hash: '#the-hash'
    }}
    state={{ fromDashboard: true }}
  />
  ```

### `state`

- **类型** `object`

  `state` 属性设置的内容会被传递到 `location.state` 中。

  ```tsx
  <RouterLink to="/courses" state={{ fromDashboard: true }} />
  ```

### `custom`

- **类型** `boolean`
- **默认值** `false`

  **通过插槽自定义组件**

  通过插槽 `v-slots` 自定义 `RouterLink` 组件。

  自定义插槽传入一个对象，你可添加自定义操作，包含以下属性：

  - href -（string）URL
  - navigate -（function）跳转至`to`指定链接的方法，执行`navigate()`后立即跳转
  - isActive -（boolean）链接是否匹配
  - isExactActive -（boolean）链接是否被精确匹配

  **注意**: 在 jsx 中，应该使用 `v-slots` 代替 `v-slot`。

  **jsx 示例：**

  ```tsx
  // jsx 语法
  const customLink = {
    default: ({ href, navigate, isActive, isExactActive }) => (
      <span
        onClick={(e) => {
          e.preventDefault()
          navigate()
        }}
        class={{
          'router-link-active': isActive,
          'router-link-exact-active': isExactActive
        }}
      >
        {href}
      </span>
    )
  }

  return () => <RouterLink to="/hello" custom v-slots={customLink} />
  ```

  ```tsx
  // or jsx 语法
  return () => (
    <RouterLink to="/hello" custom>
      {({ href, navigate, isActive, isExactActive }) => (
        <span
          onClick={(e) => {
            e.preventDefault()
            navigate()
          }}
          class={{
            'router-link-active': isActive,
            'router-link-exact-active': isExactActive
          }}
        >
          {href}
        </span>
      )}
    </RouterLink>
  )
  ```

  **单文件组件 示例：**

  ```html
  <!-- template 语法 -->
  <RouterLink to="/hello" custom v-slot="{ href, navigate, isActive, isExactActive }>
      <span
        @click="
          (e) => {
            e.preventDefault()
            navigate()
          }
        "
        :class="{
          'router-link-active': isActive,
          'router-link-exact-active': isExactActive
        }"
        >{{ href }}</span
      >
  </RouterLink>
  ```

### `replace`

- **类型** `boolean`
- **默认值** `false`

  设置 `replace` 属性，点击会调用 `history.replace()`，导航不会留下 history 记录。

  ```tsx
  <RouterLink to="/courses" replace />
  ```

### `caseSensitive`

- **类型** `boolean`
- **默认值** `false`

  区分大小写。

### `end`

- **类型** `boolean`
- **默认值** `false`

  全部匹配。

### `target`

- **类型** `string`
- **默认值** `"_self"`

  规定在何处打开链接文档。

  ```tsx
  //在新窗口中打开被链接
  <RouterLink to="/courses" target=“_blank” />
  ```

### `activeClass`

- **类型** `string`
- **默认值** `"router-link-active"`

  设置链接匹配时使用的 `CSS` 类名。默认值可以通过路由的构造选项 `linkActiveClass` 来全局配置。

### `exactActiveClass`

- **类型** `string`
- **默认值** `"router-link-exact-active"`

  配置当链接被精确匹配的时候应该激活的 `class`。注意默认值也是可以通过路由构造路径方法选项 `linkExactActiveClass` 进行全局配置的。

## `<Routes>`

渲染与地址匹配的第一个`<Route>`。

**这与只使用一堆`<Route>`有什么不同？**

`<Routes>` 仅渲染子路由中的匹配到的第一个路由。相反，每一个成功匹配地址的 `<Route>` 都会被渲染。思考下面的代码：

```tsx
import { Route } from 'components-router'

export default defineComponent({
  setup() {
    return () => (
      <>
        <Route path="/about">
          <h1>About</h1>
        </Route>
        <Route path="/:user">
          <h1>User</h1>
        </Route>
        <Route path="*">
          <h1>404</h1>
        </Route>
      </>
    )
  }
})
```

如果现在的 URL 是 `/about` ，那么 `<h1>About</h1>`、`<h1>User</h1>` 和 `<h1>404</h1>` 都会被渲染，因为它们都与路径(path)匹配。这种设计，允许我们以多种方式将多个 `<Route>` 组合到我们的应用程序中，例如侧栏(sidebars)，面包屑(breadcrumbs)，tabs 等等。 当我们只想渲染一个 `<Route>`。如果我们现在处于 `/about`，以下是使用 `Routes` 的方法来实现：

```tsx
import { Routes, Route } from 'components-router'

export default defineComponent({
  setup() {
    return () => (
      <Routes>
        <Route path="/">
          <h1>Home</h1>
        </Route>
        <Route path="/about">
          <h1>About</h1>
        </Route>
        <Route path="/:user">
          <h1>User</h1>
        </Route>
        <Route path="*">
          <h1>404</h1>
        </Route>
      </Routes>
    )
  }
})
```

现在，如果地址处于 `/about`， `<Routes>` 将匹配 `path="/about"` 后渲染 `<h1>About</h1>` 并停止寻找匹配。 同样，如果地址处于 `/michael` ， `<User>` 将被渲染。

## `<Route>`

根据 URL 显示 UI， `Route` 中 `path` 路径与当前 URL 匹配时显示子组件。

```tsx
<>
  <Route path="/home">
    <h1>Home</h1>
  </Route>
  <Route path="/login">
    <h1>Login</h1>
  </Route>
</>
```

### `path`

- **类型** `string`
- **required**

  指定一个路由映射到一个组件。

  ```tsx
  <Route path="/user/login">
    <h1>Login</h1>
  </Route>
  ```

### `caseSensitive`

- **类型** `boolean`
- **默认值** `false`

  是否区分路由大小写。

  ```tsx
  <Route caseSensitive path="/one">
    <About />
  </Route>
  ```

  | path | location.pathname | caseSensitive | 是否匹配 |
  | ---- | ----------------- | ------------- | -------- |
  | /one | /one              | true          | 是       |
  | /One | /one              | true          | 否       |
  | /One | /one              | false         | 是       |

### `end`

- **类型** `boolean`
- **默认值** `true`

  是否全匹配。

  ```tsx
  // 两者效果一直
  <Route end={false} path="/path" />

  <Route path="/path/*" />
  ```

## `<Navigate>`

被渲染时，跳转至 `to` 指定的地址。

```tsx
// 直接跳转至/courses
<Navigate to="/courses" />
```

### `to`

- **类型** `string | object`
- **required**

  类型参考[to 文档](/api/#to-2)。

### `replace`

- **类型** `boolean`
- **默认值** `false`

  替换在 `history` 堆栈中的当前条目。

### `state`

- **类型** `object`

  `state` 属性设置的内容会被传递到 `location.state` 中。

## Type

### To

```ts
type To = string | Partial<Path>
```

要跳转路径的查询参数，对象或者字符串。

对象包含以下属性：

- pathname: 跳转的路径
- query: 查询参数，key/value
- hash: URL 上的 hash，例如：#the-hash

```js
// 对象
{
  pathname: '/courses',
  query: { name: '张三', id: '1' },
  hash: '#the-hash'
}

//字符串
'/courses?sort=name#the-hash'
```

### State

```ts
type State = object | null
```

### Params

```ts
type Params = Record<string, string>
```

### Query

```ts
type Query = { [key: string]: undefined | string | string[] | Query | Query[] }
```

### Path

```ts
interface Path {
  pathname: string
  query: Query
  hash: string
}
```

### Location

```ts
interface Location<S extends State = State> extends Path {
  state: S
  key: string
}
```

### Blocker

```ts
interface Blocker<S extends State = State> {
  action: Action
  location: Location<S>
  retry(): void
}
```
