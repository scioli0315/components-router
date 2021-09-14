import { hasOwn } from '@vue/shared'
import qs from 'qs'
import { ComponentInternalInstance, getCurrentInstance, Ref, toRaw } from 'vue'

import type { HistoryPartialPath, MatchResult, Params, PartialPath, Path, To } from '../types'
import { normalizeSlashes, resolvePathname } from './reactRouter'
import { compoentsRouter } from './symbolKey'

export const emptyObject = {}

export const emptyPath = { pathname: '', query: {}, hash: '' }

export const emptyMatch = { path: '', url: '', params: emptyObject }

export const getError = (msg: string): string => {
  return `${msg} 须在 "BrowserRouter"、"HashRouter" 中使用`
}

/**
 * initial
 * @param str
 * @param insert
 */
export const initial = (str = '', insert = ''): string => {
  if (str === insert) return ''
  if (!!str && !str.startsWith(insert)) return `${insert}${str}`
  return str || ''
}

/**
 * lastLetter
 * @param str
 */
export const lastLetter = (str = ''): string => {
  return str.replace(/^\/*/, '/').replace(/\/+$/, '')
}

/**
 * createRoutePath
 * @param parentPath
 * @param path
 */
export const createRoutePath = (parentPath: string, path = ''): string => {
  if (!path) return parentPath
  let _parentPath = lastLetter(parentPath)
  const pos = _parentPath.indexOf('/*')
  if (pos >= 0) {
    _parentPath = parentPath.substr(0, pos)
  }

  return `${_parentPath}${lastLetter(initial(path, '/'))}`
}

/**
 * queryToSearch
 * @param to
 */
export const queryToSearch = (to: To): HistoryPartialPath => {
  const partialPath = typeof to === 'string' ? { pathname: to } : to

  const search = initial(qs.stringify(partialPath.query, { arrayFormat: 'brackets' }), '?')

  return { hash: initial(partialPath.hash, '#'), pathname: partialPath.pathname || '', search }
}

/**
 * parsePath
 * @param to
 */
export const parsePath = (to: To): PartialPath => {
  if (!to) return {}
  if (typeof to !== 'string') {
    const path = { hash: '', query: {}, ...to }
    path.hash = initial(path.hash, '#')
    return path
  }

  const partialPath: PartialPath = {}
  const hashIndex = to.indexOf('#')
  if (hashIndex >= 0) {
    partialPath.hash = to.substr(hashIndex)
    to = to.substr(0, hashIndex)
  }

  const searchIndex = to.indexOf('?')
  if (searchIndex >= 0) {
    const search = to.substr(searchIndex)
    partialPath.query = qs.parse(search || '', {
      ignoreQueryPrefix: true
    })
    to = to.substr(0, searchIndex)
  }

  if (to) {
    partialPath.pathname = to
  }

  return partialPath
}

/**
 * getCurrentParent
 * @param parent
 */
export const getCurrentParent = (
  parent?: ComponentInternalInstance
): ComponentInternalInstance | null => {
  const instance = parent || getCurrentInstance()
  if (!(instance && instance.parent)) {
    return null
  }
  if (instance.parent.props.__compoentsRouter === compoentsRouter) {
    return instance.parent
  }
  const result = getCurrentParent(instance.parent)

  return result
}

type ParentProps<T extends Params = Params> = {
  __compoentsRouter: typeof compoentsRouter
  __match: Ref<MatchResult<T>> | null
  __routes?: boolean
}

/**
 * getCurrentParentProps
 * @param parent
 */
export const getCurrentParentProps = <T extends Params = Params>(
  parent?: ComponentInternalInstance | null
): ParentProps<T> => {
  const crParent = parent || getCurrentParent()
  if (!crParent) {
    return {
      __compoentsRouter: compoentsRouter,
      __match: null
    }
  }
  return crParent.props as ParentProps<T>
}

/**
 * resolvePath
 * @param to
 * @param fromPathname
 * @param basename
 */
export const resolvePath = (to: To, fromPathname = '/', basename = ''): Path => {
  const { pathname: toPathname, query = {}, hash = '' } = parsePath(to)

  const pathname = toPathname
    ? resolvePathname(
        toPathname,
        toPathname.startsWith('/')
          ? basename
            ? normalizeSlashes(`/${basename}`)
            : '/'
          : fromPathname
      )
    : fromPathname

  return { pathname, query, hash }
}

/**
 * deepClone
 * @param _
 * @param hash
 */
export const deepClone = (_: any, hash = new WeakMap()): any => {
  const v = toRaw(_)
  if (v instanceof RegExp) return new RegExp(v)
  if (v instanceof Date) return new Date(v)
  if (v === null || typeof v !== 'object') return v
  if (hash.has(v)) {
    return hash.get(v)
  }

  const newState: any = new v.constructor()
  hash.set(v, newState)
  for (const k in v) {
    if (hasOwn(v, k)) {
      newState[k] = deepClone(v[k], hash)
    }
  }

  const symbols = Object.getOwnPropertySymbols(v)
  for (let i = 0; i < symbols.length; i++) {
    if (hasOwn(v, symbols[i])) {
      newState[symbols[i]] = deepClone(v[symbols[i]], hash)
    }
  }

  return newState
}
