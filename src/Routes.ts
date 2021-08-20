import { defineComponent, h, inject } from 'vue'

import { getError } from './utils'
import { compoentsRouterUsed } from './utils/symbolKey'

const Routes = defineComponent({
  name: 'Routes',

  setup(props, { slots }) {
    const isUse = inject(compoentsRouterUsed)
    if (!isUse) throw new TypeError(getError('Routes'))

    return () => slots.default && h(slots.default, { __routes: true })
  }
})

export default Routes
