---
sidebarDepth: 0
---

# 编程式的导航

除了使用 `<RouterLink>` 创建 a 标签来定义导航链接，我们还可以借助 `useNavigate` 返回的`navigate`方法，通过编写代码来实现。

## 路径皆相对

当 `to` 值为非数字时：

```ts
// 当前路径为 /app/dashboard

navigate('/stats') // <a href="/stats">
navigate('stats') // <a href="/app/dashboard/stats">
navigate('../stats') // <a href="/app/stats">
navigate('../../stats') // <a href="/stats">
```

## navigate(to)

想要导航到不同的 URL，则使用 `navigate` 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

该方法的参数可以是一个数字或字符串路径，或者一个描述地址的对象。例如：

### to: number

```js
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)

// 后退一步记录，等同于 history.back()
router.go(-1)
```

### to: string

```js
// 字符串
navigate('home')

navigate('register?plan=private')
```

### to: object

```js
// 对象
navigate({ pathname: 'home' })

// 带查询参数，变成 /register?plan=private
navigate({ pathname: 'register', query: { plan: 'private' } })
```

## navigate(to, options)

传入 `options` 对象，有以下属性：

```
replace?: boolean
state?: State
```

### `replace: true`

`replace: true`，替换掉当前的 history 记录。

### `state`

`state` 属性设置的内容会被传递到 `location.state` 中，通过 `useLocation`，可以获取 state 值。
