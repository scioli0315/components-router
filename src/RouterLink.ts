import { defineComponent, h, inject, unref } from 'vue'

import { propState, propToType } from './common'
import type { State, To } from './types'
import { useResolvedPath } from './useApi'
import { getError, queryToSearch } from './utils'
import { matchPath } from './utils/reactRouter'
import { routerStateKey } from './utils/symbolKey'

interface Props {
  to: To
  state?: State
  target?: string
  custom?: boolean
  caseSensitive?: boolean
  end?: boolean
  replace?: boolean
  activeClass?: string
  exactActiveClass?: string
}

const RouterLink = defineComponent({
  name: 'RouterLink',

  props: {
    to: {
      type: propToType,
      default: ''
    },
    state: propState,
    target: {
      type: String,
      default: '_self'
    },
    custom: Boolean,
    caseSensitive: Boolean,
    end: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String
  },

  setup(props: Props, { slots }) {
    const routerState = inject(routerStateKey)

    if (!routerState) throw new TypeError(getError('RouterLink'))
    const {
      navigator,
      location,
      linkActive: {
        linkActiveClass = 'router-link-active',
        linkExactActiveClass = 'router-link-exact-active'
      }
    } = routerState

    const to = useResolvedPath(props.to)
    const onClick = (e: MouseEvent, navigate: () => void) => {
      const { target } = props

      if (target === '_self') {
        e.preventDefault()
        navigate()
      }
    }

    const getClassActive = (path: string) => {
      const {
        end,
        caseSensitive,
        activeClass = linkActiveClass,
        exactActiveClass = linkExactActiveClass
      } = props

      const matchResult = matchPath({ path, end, caseSensitive }, location.pathname)

      const isExactActive = matchResult && matchResult.path === location.pathname
      const isActive = !!matchResult

      return {
        class: {
          [activeClass]: !isExactActive && isActive,
          [exactActiveClass]: isExactActive
        },
        active: {
          isActive,
          isExactActive
        }
      }
    }

    return () => {
      const { replace, state, custom, target } = props
      const path = queryToSearch(unref(to))
      const href = navigator.createHref(path)
      const classActive = getClassActive(path.pathname || '')

      const navigate = () => {
        const { pathname, search, hash } = location
        if (href === `${pathname}${search}${hash}`) return
        navigator[replace ? 'replace' : 'push'](path, state)
      }

      return custom
        ? slots.default && slots.default({ href, ...classActive.active, navigate })
        : h(
            'a',
            {
              onClick: (e: MouseEvent) => {
                onClick(e, navigate)
              },
              href,
              target,
              class: classActive.class
            },
            slots.default && slots.default()
          )
    }
  }
})

export default RouterLink
