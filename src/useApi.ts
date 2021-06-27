import qs from 'qs'
import {
  computed,
  ComputedRef,
  inject,
  onUnmounted,
  readonly,
  Ref,
  ref,
  unref,
  watch,
  watchEffect
} from 'vue'

import type {
  Blocker,
  Location,
  MaybeRef,
  NavigateFunction,
  NavigateOptions,
  Params,
  Path,
  PathMatch,
  PathPattern,
  Query,
  To,
  Transition
} from './types'
import {
  emptyMatch,
  emptyObject,
  getCrParentProps,
  getError,
  queryToSearch,
  resolvePath
} from './utils'
import matchPath from './utils/mathPath'
import { compoentsRouterActive, routerStateKey } from './utils/symbolKey'

/**
 * useNavigate
 */
export function useNavigate(): NavigateFunction {
  const routerState = inject(routerStateKey)
  if (!routerState) throw new TypeError(getError(`useRouter`))

  const { match } = getCrParentProps()
  const { navigator } = routerState

  const navigate: NavigateFunction = (to: To | number, options: NavigateOptions = {}) => {
    if (typeof to === 'number') {
      navigator.go(to)
    } else {
      const _match = unref(match) || emptyMatch
      const path = queryToSearch(resolvePath(to, _match.pathname))
      navigator[options.replace ? 'replace' : 'push'](path, options.state)
    }
  }

  return navigate
}

/**
 * useLocation
 */
export function useLocation(): Location {
  const routerState = inject(routerStateKey)
  if (!routerState) throw new TypeError(getError(`useLocation`))

  return routerState.location
}

/**
 * useQuery
 */
export function useQuery(): Ref<Query> {
  const isActive = inject(compoentsRouterActive)
  if (!isActive) throw new TypeError(getError(`useQuery`))

  const query = ref(emptyObject)
  const location = useLocation()

  const stop = watch(
    () => location.search,
    () => {
      const value = qs.parse(location.search || '', {
        ignoreQueryPrefix: true
      })
      query.value = Object.keys(value).length > 0 ? value : emptyObject
    },
    { immediate: true }
  )

  onUnmounted(stop)

  return readonly(query)
}

/**
 * useMatch
 * @param pattern
 */
export function useMatch(pattern: MaybeRef<PathPattern>): Ref<PathMatch | null> {
  const isActive = inject(compoentsRouterActive)
  if (!isActive) throw new TypeError(getError(`useMatch`))

  const location = useLocation()
  const match: Ref<PathMatch | null> = ref(null)
  const _pattern = ref(pattern)

  const stop = watch(
    [() => location.pathname, _pattern],
    () => {
      match.value = matchPath(unref(pattern), location.pathname)
    },
    { immediate: true }
  )

  onUnmounted(stop)

  return readonly(match)
}

/**
 * useParams
 */
export function useParams(): ComputedRef<Params> {
  const isActive = inject(compoentsRouterActive)
  if (!isActive) throw new TypeError(getError('useParams'))

  const { match } = getCrParentProps()

  return computed(() => match?.value.params || emptyObject)
}

/**
 * useBlocker
 * @param blocker
 * @param when
 */
export function useBlocker(blocker: Blocker, when: MaybeRef<boolean> = true): void {
  const routerState = inject(routerStateKey)
  if (!routerState) throw new TypeError(getError(`useBlocker`))

  const { navigator } = routerState

  const stop = watchEffect(() => {
    if (!unref(when)) return
    const unblock = navigator.block((tx: Transition) => {
      blocker({
        ...tx,
        retry: () => {
          unblock()
          tx.retry()
        }
      })
    })
  })

  onUnmounted(stop)
}

/**
 * usePrompt
 * @param message
 * @param when
 */
export function usePrompt(message: MaybeRef<string>, when: MaybeRef<boolean> = true): void {
  const isActive = inject(compoentsRouterActive)
  if (!isActive) throw new TypeError(getError(`usePrompt`))

  const blocker = computed(() => (tx: Transition) => {
    if (window.confirm(unref(message))) tx.retry()
  })

  useBlocker(unref(blocker), when)
}

/**
 * useResolvedPath
 * @param to
 */
export function useResolvedPath(to: MaybeRef<To>): ComputedRef<Path> {
  const isActive = inject(compoentsRouterActive)
  if (!isActive) throw new TypeError(getError(`useResolvedPath`))

  const { match } = getCrParentProps()
  const _to = ref(to)

  return computed(() => {
    const _match = unref(match) || emptyMatch
    return resolvePath(unref(_to), _match.pathname)
  })
}

/**
 * useHref
 * @param to
 */
export function useHref(to: MaybeRef<To>): ComputedRef<string> {
  const routerState = inject(routerStateKey)
  if (!routerState) throw new TypeError(getError(`useHref`))

  const { navigator } = routerState
  const path = useResolvedPath(to)

  return computed(() => navigator.createHref(path.value))
}
