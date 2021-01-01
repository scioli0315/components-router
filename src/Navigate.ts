import { defineComponent, inject, PropType } from 'vue'

import type { State, To } from './types'
import { useNavigate } from './useApi'
import { getError } from './utils'
import { compoentsRouterActive } from './utils/symbolKey'

interface Props {
  to: To
  state?: State
  replace?: boolean
}

const Navigate = defineComponent({
  name: 'Navigate',

  props: {
    to: {
      type: [String, Object] as PropType<To>,
      required: true
    },
    state: {
      type: Object as PropType<State>,
      default: null
    },
    from: String,
    replace: Boolean
  },

  setup(props: Props) {
    const isActive = inject(compoentsRouterActive)

    if (!isActive) throw new TypeError(getError('Navigate'))

    const navigate = useNavigate()

    return () => {
      const { to, replace, state } = props
      navigate(to, { replace, state })
      return null
    }
  }
})

export default Navigate
