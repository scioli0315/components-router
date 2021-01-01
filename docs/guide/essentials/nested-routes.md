# 嵌套路由

## 基础

实际生活中的应用界面，通常由多层嵌套的组件组合而成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层组件，例如：

```
/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

借助 `components-router`，使用嵌套路由配置，就可以很简单地表达这种关系。

```tsx
const App = defineComponent({
  setup() {
    retrun () => (
      <Routes>
        <Route path="/">
          <Home />
        </Route>
        <Route path="user/:id/*">
          <User />
        </Route>
      </Routes>
    )
  }
})

const User = defineComponent({
  setup() {
    retrun () => (
      <Routes>
        <Route path="profile">
          <Profile />
        </Route>
        <Route path="posts">
          <Posts />
        </Route>
      </Routes>
    )
  }
})
```

此时，基于上面的配置，当你访问 /user/foo 时，User 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个 空的 子路由：

```tsx
<Routes>
  <Route path="/">
    <UserHome />
  </Route>
  // ...其它子路由
</Routes>
```

## 多组嵌套

无论您在哪里，您都可以使用`<Routes>` 。每个`<Routes>`都是独立的，并会渲染匹配的子路由。

```tsx
<div>
  <Sidebar>
    <Routes>
      <Route path="/">
        <MainNav />
      </Route>
      <Route path="dashboard">
        <DashboardNav />
      </Route>
    </Routes>
  </Sidebar>

  <MainContent>
    <Routes>
      <Route path="/">
        <Home />
      </Route>
      <Route path="dashboard/*">
        <Dashboard>
          <Route path="invoices">
            <Invoices />
          </Route>
          <Route path="team">
            <Team />
          </Route>
        </Dashboard>
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Routes>
  </MainContent>
</div>
```

## 路径皆相对

**要注意，以 `/` 开头的嵌套路径会`/`被无视。所有 Route 的路径都会使用父级 Route 的路径作为相对路径，这与系统文件夹一致。**

```tsx
<Route path="user/*">
  // path值为：/user/*
  <Route path="foo/*">
    // path值为：/user/foo/*
    <Route path="posts">
      // path值为：/user/foo/posts
      <Other />
    </Route>
  </Route>
</Route>
```

## `/* 通配符`

路径里的通配符`/*`，会被子路由中的路径替换，多过个通配符会忽略后面的通配符。

```tsx
<Routes>
  <Route path="user/*">
    // path值为：/user/*
    <Route path="foo">
      // path值为：/user/foo
      <Route path="posts">
        // path值为：/user/foo/posts
        <Other />
      </Route>
    </Route>
  </Route>
  <Route path="article/:type/*">
    // path值为：/article/:type/*
    <Route path=":id">
      // path值为：/article/:type/:id
      <Other />
    </Route>
  </Route>
</Routes>
```

```tsx
  // ！！！警告
  // /*后面的会被忽略
  <Route path="goods/*/:type">
    // path值为：/goods/*
    <Route path=":id">
      // path值为：/goods/:id
    </Route>
  </Route>

  <Route path="article/:type">
    // path值为：/article/:type
    <Route path=":id">
      // 无法匹配到
    </Route>
  </Route>
</Routes>
```
