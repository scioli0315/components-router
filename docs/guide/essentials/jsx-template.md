# JSX 和 template

## template

如若保持组件名在 jsx 和 template 称一致性。

```vue
<template>
  <!-- ✓ GOOD -->
  <CoolComponent />
  <UnregisteredComponent />

  <!-- ✗ BAD -->
  <cool-component />
  <unregistered-component />
</template>
<script>
export default {
  components: {
    CoolComponent
  }
}
</script>
```

配置 eslint 的 rules：

```js
// .eslintrc.js

rules: {
  // ...
  'vue/component-name-in-template-casing': [
    'error',
    'PascalCase',
    {
      registeredComponentsOnly: false
    }
  ]
  // ...
}
```

## jsx

文档大部分示例采用了 jsx 的语法格式。jsx 的语法格式于 React 不太一样， 详细的配置文档和语法文档，请参考[Vue 3 Babel JSX 插件](https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md)。

**注意**，提供的 Composition API，返回值大部分是 Ref 对象，在 jsx 中使用需要使用 `.value`。例：

```tsx
const Blog = defineComponent({
  setup() {
    // 当前链接是 /register?plan=private
    const query = useQuery()
    return () => <h2>{query.value.plan}</h2>
  }
})
```
