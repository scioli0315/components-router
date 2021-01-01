# 动态路由匹配

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 `User` 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 `components-router` 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

```tsx
const User = () => <div>User</div>

// 动态路径参数 以冒号开头
<Route path="/user/:id">
  <User />
</Route>
```

现在呢，像 `/user/foo` 和 `/user/bar` 都将映射到相同的路由。

一个“路径参数”使用冒号 `:` 标记。当匹配到一个路由时，参数值会被设置到
`useParams`，可以在每个组件的 `setup` 内使用。于是，我们可以更新 `User` 的模板，输出当前用户的 ID：

```tsx
import { useParams } from 'components-router'

const User = {
  setup() {
    const params = useParams()

    return () => <div>User {params.value.id}</div>
  }
}
```

你可以在一个路由中设置多段“路径参数”，对应的值都会设置到 `useParams` 中。例如：

| 模式                          | 匹配路径            | params                                 |
| ----------------------------- | ------------------- | -------------------------------------- |
| /user/:username               | /user/evan          | `{ username: 'evan' }`                 |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

除了 `useParams` 外，还提供了 `useQuery` (如果 URL 中有查询参数) 等等。你可以查看 [useQuery 文档](/api/#usequery) 的详细说明。

## 响应路由参数的变化

提醒一下，当使用路由参数时，例如从 `/user/foo` 导航到 `/user/bar`，**原来的组件实例会被复用**。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。**不过，这也意味着组件的生命周期钩子不会再被调用**。

复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) `useLocation` 对象：

```js
import { useLocation } from 'components-router'

const User = {
  setup() {
    const location = useLocation()

    watch([location], () => {
      // 对路由变化作出响应...
    })
  }
}
```

## 捕获所有路由或 404 Not found 路由

常规参数只会匹配被 `/` 分隔的 URL 片段中的字符。如果想匹配**任意路径**，我们可以使用通配符 `*`：

```tsx
// 会匹配所有路径
<Route path="*" />

// 会匹配以 `/user-` 开头的任意路径
<Route path="/user-*" />
```

当使用*通配符*路由时，请确保路由的顺序是正确的，也就是说含有*通配符*的路由应该放在最后。路由 `path="*"` 通常用于客户端 404 错误。如果你使用了*History 模式*，请确保[正确配置你的服务器](./history-mode.md)。

当使用一个*通配符*时，也可以通过 `useParams` 获取参数：

```js
// 给出一个路由 { path: '/user-*' }
navigate('/user-admin')
useParams() // {'*': 'admin'}
// 给出一个路由 { path: '*' }
navigate('/non-existing')
useParams() // {'*': 'non-existing'}
```

## 有效的匹配模式

仅仅支持以下几种 `*` 和 `:` 匹配格式：

```ruby
/groups
/groups/admin
/users/:id
/users/:id/messages
/files/*
/files/:id/*
/files-*
```

## 匹配优先级

有时候，同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。
