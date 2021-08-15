import { createBrowserHistory as createHistory } from 'history'
import { defineComponent } from 'vue'

import { base, props } from './common'
import type { RouterProps } from './types'

const BrowserRouter = defineComponent({
  name: 'BrowserRouter',

  props,

  setup(props: RouterProps, { slots }) {
    const history = createHistory()

    return base(props, slots, history)
  }
})

export default BrowserRouter
