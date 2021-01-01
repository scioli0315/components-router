import { createHashHistory as createHistory } from 'history'
import { defineComponent, h } from 'vue'

import Router from './Router'
import type { RouterProps } from './types'

const HashRouter = defineComponent({
  name: 'HashRouter',

  props: {
    basename: {
      type: String,
      default: ''
    },
    linkActiveClass: String,
    linkExactActiveClass: String
  },

  setup(props: RouterProps, { slots }) {
    const history = createHistory()

    return () => {
      const { linkActiveClass, linkExactActiveClass, basename } = props
      return h(
        Router,
        { history, basename, linkActive: { linkActiveClass, linkExactActiveClass } },
        {
          default: () => slots.default && slots.default()
        }
      )
    }
  }
})

export default HashRouter
