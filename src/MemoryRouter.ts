import { createMemoryHistory as createHistory } from 'history'
import { defineComponent, PropType } from 'vue'

import { base, props } from './common'
import { InitialEntry } from './types'

const MemoryRouter = defineComponent({
  name: 'MemoryRouter',

  props: {
    ...props,
    initialEntry: {
      type: [String, Object] as PropType<InitialEntry>
    }
  },

  setup(props, { slots }) {
    const history = createHistory({
      initialEntries: props.initialEntry ? [props.initialEntry] : undefined
    })

    return base(props, slots, history)
  }
})

export default MemoryRouter
