import { defineComponent, inject } from 'vue'

import { propState, propToType } from './common'
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
      type: propToType,
      required: true
    },
    state: propState,
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
