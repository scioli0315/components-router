<template>
  <ParentLayout />
</template>

<script>
import DefaultTheme from 'vitepress/theme'

export default {
  name: 'Layout',

  components: {
    ParentLayout: DefaultTheme.Layout
  }
}
</script>
