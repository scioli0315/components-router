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
  RouterState,
  State,
  To,
  Transition
} from './types'
import {
  emptyMatch,
  emptyObject,
  getCurrentParentProps,
  getError,
  queryToSearch,
  resolvePath
} from './utils'
import { matchPath } from './utils/reactRouter'
import { compoentsRouterUsed, routerStateKey } from './utils/symbolKey'

/**
 * useNavigate
 */
export function useNavigate(): NavigateFunction {
  const routerState = inject(routerStateKey)
  if (!routerState) throw new TypeError(getError(`useRouter`))

  const { __match } = getCurrentParentProps()
  const { basename, navigator } = routerState

  const navigate: NavigateFunction = (
    to = '',
    { replace, state }: NavigateOptions = emptyObject
  ) => {
    if (typeof to === 'number') {
      navigator.go(to)
    } else {
      const match = unref(__match) || emptyMatch
      const path = queryToSearch(resolvePath(to, match.pathname, basename))
      navigator[replace ? 'replace' : 'push'](path, state)
    }
  }

  return navigate
}

/**
 * useLocation
 */
export function useLocation<S extends State = State>(): Location<S> {
  const routerState = inject(routerStateKey) as RouterState<S>
  if (!routerState) throw new TypeError(getError(`useLocation`))

  return routerState.location
}

/**
 * useQuery
 */
export function useQuery<T extends Query = Query>(): Readonly<Ref<T>> {
  const isUse = inject(compoentsRouterUsed)
  if (!isUse) throw new TypeError(getError(`useQuery`))

  const query: Ref<any> = ref(emptyObject)
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
export function useMatch(pattern: MaybeRef<PathPattern | string>): Readonly<Ref<PathMatch | null>> {
  const isUse = inject(compoentsRouterUsed)
  if (!isUse) throw new TypeError(getError(`useMatch`))

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
export function useParams<Key extends string = string>(): ComputedRef<Params<Key>> {
  const isUse = inject(compoentsRouterUsed)
  if (!isUse) throw new TypeError(getError('useParams'))

  const { __match } = getCurrentParentProps<Key>()

  return computed(() => __match?.value.params || (emptyObject as Params<Key>))
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
    const unblock = navigator.block((tx: Transition) => {
      if (!unref(when)) {
        unblock()
        tx.retry()
        return
      }

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
  const isUse = inject(compoentsRouterUsed)
  if (!isUse) throw new TypeError(getError(`usePrompt`))

  const blocker = computed(() => ({ retry }: Transition) => {
    if (window.confirm(unref(message))) retry()
  })

  useBlocker(unref(blocker), when)
}

/**
 * useResolvedPath
 * @param to
 */
export function useResolvedPath(to: MaybeRef<To>): ComputedRef<Path> {
  const routerState = inject(routerStateKey)
  if (!routerState) throw new TypeError(getError(`useResolvedPath`))

  const { __match } = getCurrentParentProps()
  const { basename } = routerState

  const _to = ref(to)

  return computed(() => {
    const _match = unref(__match) || emptyMatch
    return resolvePath(unref(_to), _match.pathname, basename)
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
