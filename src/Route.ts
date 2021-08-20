import { defineComponent, getCurrentInstance, h, inject, unref } from 'vue'

import { useMatch } from './useApi'
import { createRoutePath, emptyMatch, getCurrentParentProps, getError } from './utils'
import routersCache from './utils/routersCache'
import { compoentsRouterUsed } from './utils/symbolKey'

interface Props {
  path: string
  caseSensitive: boolean
  end: boolean
}

const Route = defineComponent({
  name: 'Route',

  props: {
    path: {
      type: String,
      required: true
    },
    caseSensitive: {
      type: Boolean,
      default: false
    },
    end: {
      type: Boolean,
      default: true
    }
  },

  setup(props: Props, { slots }) {
    const isUse = inject(compoentsRouterUsed)
    if (!isUse) throw new TypeError(getError('Route'))

    const cache = routersCache()
    const { parent } = getCurrentInstance() || {}
    const { __match: parentMatch, __compoentsRouter } = getCurrentParentProps()
    const _parentMatch = unref(parentMatch) || emptyMatch

    const path = createRoutePath(_parentMatch.path, props.path)
    const __match = useMatch({ path, caseSensitive: props.caseSensitive, end: props.end })
    const parentRoutes = () => (parent?.props.__routes ? cache.getValue(parent.uid) : false)

    return () => {
      if (!__match.value || parentRoutes()) return null

      return slots.default && h(slots.default, { __compoentsRouter, __match })
    }
  }
})

export default Route
