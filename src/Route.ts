import { defineComponent, getCurrentInstance, h, inject, unref } from 'vue'

import { useMatch } from './useApi'
import { emptyMatch, getCrParentProps, getError, routePath } from './utils'
import routersCache from './utils/routersCache'
import { compoentsRouterActive } from './utils/symbolKey'

interface Props {
  path: string
  caseSensitive?: boolean
}

const Route = defineComponent({
  name: 'Route',

  props: {
    path: {
      type: String,
      required: true
    },
    caseSensitive: Boolean
  },

  setup(props: Props, { slots }) {
    const isActive = inject(compoentsRouterActive)
    if (!isActive) throw new TypeError(getError('Route'))

    const cache = routersCache()
    const instance = getCurrentInstance()
    const { match: parentMatch, compoentsRouter } = getCrParentProps()
    const _parentMatch = unref(parentMatch) || emptyMatch

    const path = routePath(_parentMatch.path, props.path)
    const match = useMatch({ path, caseSensitive: !!props.caseSensitive })

    const parentRoutes = () => {
      if (instance?.parent?.props.routes) return cache.getValue(instance.parent.uid)
      return false
    }

    return () => {
      if (!match.value || parentRoutes()) return null
      return slots.default
        ? h(slots.default, {
            compoentsRouter,
            match
          })
        : null
    }
  }
})

export default Route
