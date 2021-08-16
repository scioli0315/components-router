import { defineComponent, inject } from 'vue'

import { propState, propToType } from './common'
import type { State, To } from './types'
import { useNavigate } from './useApi'
import { getError } from './utils'
import { compoentsRouterUsed } from './utils/symbolKey'

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
    const isUse = inject(compoentsRouterUsed)

    if (!isUse) throw new TypeError(getError('Navigate'))

    const navigate = useNavigate()

    return () => {
      const { to, replace, state } = props
      setTimeout(() => {
        navigate(to, { replace, state })
      })
      return null
    }
  }
})

export default Navigate
