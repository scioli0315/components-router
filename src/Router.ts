import { defineComponent, h, onUnmounted, PropType, provide, reactive, readonly, ref } from 'vue'

import type { History } from './types'
import { emptyObject, initial, lastLetter } from './utils'
import routersCache from './utils/routersCache'
import {
  compoentsRouter as __compoentsRouter,
  compoentsRouterUsed,
  routerStateKey
} from './utils/symbolKey'

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
      default: () => ({})
    }
  },

  setup(props, { slots }) {
    const basename = initial(lastLetter(props.basename)) || '/'
    const cache = routersCache()
    const location = reactive({ ...props.history.location })

    const routerState = {
      navigator: props.history,
      location,
      linkActive: props.linkActive,
      basename
    }

    const __match = ref({ path: basename, pathname: basename, params: emptyObject })

    const unlisten = props.history.listen(
      ({ location: { hash, key, pathname, search, state } }) => {
        cache.clear()
        location.hash = hash
        location.key = key
        location.pathname = pathname
        location.search = search
        location.state = state
      }
    )
    onUnmounted(unlisten)

    provide(routerStateKey, readonly(routerState))
    provide(compoentsRouterUsed, true)

    return () => slots.default && h(slots.default, { __compoentsRouter, __match })
  }
})

export default Router
