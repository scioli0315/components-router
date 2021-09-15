import { defineComponent, inject, watchPostEffect } from 'vue'

import { propState, propToType } from './common'
import type { State, To } from './types'
import { useNavigate } from './useApi'
import { deepClone, getError } from './utils'
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
    replace: Boolean
  },

  setup(props: Props) {
    const isUse = inject(compoentsRouterUsed)
    if (!isUse) throw new TypeError(getError('Navigate'))

    const navigate = useNavigate()

    watchPostEffect(() => {
      const { to, replace, state } = props
      navigate(to, { replace, state: state ? deepClone(state) : undefined })
    })

    return () => null
  }
})

export default Navigate
