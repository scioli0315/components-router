import { defineComponent, h, inject } from 'vue'

import { getError } from './utils'
import { compoentsRouterActive } from './utils/symbolKey'

const Routes = defineComponent({
  name: 'Routes',

  setup(props, { slots }) {
    const isActive = inject(compoentsRouterActive)
    if (!isActive) throw new TypeError(getError('Routes'))

    return () => {
      return slots.default
        ? h(slots.default, {
            routes: true
          })
        : null
    }
  }
})

export default Routes
