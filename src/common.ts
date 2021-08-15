import type { History } from 'history'
import { h, PropType, Slots, VNode } from 'vue'

import Router from './Router'
import type { RouterProps, State, To } from './types'

export const props = {
  basename: {
    type: String,
    default: ''
  },
  linkActiveClass: String,
  linkExactActiveClass: String
}

export const propToType = [String, Object] as PropType<To>

export const propState = {
  type: Object as PropType<State>,
  default: null
}

export const base = (props: RouterProps, slots: Slots, history: History): (() => VNode) => {
  return () => {
    const { linkActiveClass, linkExactActiveClass, basename } = props

    return h(
      Router,
      { history, basename, linkActive: { linkActiveClass, linkExactActiveClass } },
      {
        default: () => slots.default && slots.default()
      }
    )
  }
}
