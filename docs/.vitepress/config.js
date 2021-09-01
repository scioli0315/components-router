const config = {
  lang: 'zh-CN',
  title: 'Components Router',
  description: 'Vue.js 组件式路由管理器',
  head: [['link', { rel: 'icon', href: `/logo.png` }]],
  // serviceWorker: true,
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Components Router',
      description: 'Vue.js 组件式路由管理器。'
    }
  },
  themeConfig: {
    repo: 'scioli0315/components-router',
    // docsRepo: '',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: false,

    nav: [
      {
        text: '指南',
        link: '/guide/index.html'
      },
      {
        text: 'API 参考',
        link: '/api/index.html'
      },
      {
        text: '更新记录',
        link: 'https://github.com/scioli0315/components-router/blob/master/CHANGELOG.md'
      }
    ],

    sidebar: [
      {
        text: '引言',
        link: '/introduction.html'
      },
      {
        text: '安装',
        link: '/installation.html'
      },
      {
        text: '基础',
        collapsable: false,
        children: [
          {
            text: '起步',
            link: '/guide/index.html'
          },
          {
            text: '主要组件',
            link: '/guide/essentials/primary-components.html'
          },
          {
            text: 'JSX 和 template',
            link: '/guide/essentials/jsx-template.html'
          },
          {
            text: '动态路由匹配',
            link: '/guide/essentials/dynamic-matching.html'
          },
          {
            text: '嵌套路由',
            link: '/guide/essentials/nested-routes.html'
          },
          {
            text: '编程式的导航',
            link: '/guide/essentials/navigation.html'
          },
          {
            text: 'HTML5 History 模式',
            link: '/guide/essentials/history-mode.html'
          }
        ]
      },
      {
        text: '进阶',
        collapsable: false,
        children: [
          {
            text: '异步组件',
            link: '/guide/advanced/async-components.html'
          }
        ]
      }
    ]
  }
}

module.exports = config
