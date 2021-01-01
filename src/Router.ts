import { defineComponent, h, onUnmounted, PropType, provide, reactive, readonly, ref } from 'vue'

import type { History, Location } from './types'
import { emptyObject, firstChar, lastChar, locationKey } from './utils'
import routersCache from './utils/routersCache'
import { compoentsRouterActive, compoentsRouterKey, routerStateKey } from './utils/symbolKey'

const Router = defineComponent({
  name: 'Router',

  props: {
    basename: {
      type: String,
      default: ''
    },
    history: {
      type: Object as PropType<History>,
      required: true
    },
    linkActive: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  setup(props, { slots }) {
    const basename = firstChar(lastChar(props.basename)) || '/'
    const cache = routersCache()
    const location = reactive({ ...props.history.location })
    const routerState = {
      navigator: props.history,
      location,
      linkActive: props.linkActive,
      basename
    }

    const routerMatch = ref({ path: basename, pathname: basename, params: emptyObject })

    const unlisten = props.history.listen(({ location: lca }: { location: Location }) => {
      cache.clear()
      locationKey.forEach((k) => {
        if (k === 'state') {
          location[k] = lca[k]
        } else {
          location[k] = lca[k]
        }
      })
    })

    onUnmounted(() => {
      unlisten()
    })

    provide(routerStateKey, readonly(routerState))
    provide(compoentsRouterActive, true)

    return () =>
      slots.default
        ? h(slots.default, {
            compoentsRouter: compoentsRouterKey,
            match: routerMatch
          })
        : null
  }
})

export default Router
