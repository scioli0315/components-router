import qs from 'qs'
import { ComponentInternalInstance, getCurrentInstance, Ref } from 'vue'

import type { HistoryPartialPath, LocationKey, PartialPath, Path, PathMatch, To } from '../types'
import { compoentsRouterKey } from './symbolKey'

export const emptyObject = {}

export const emptyPath = { pathname: '', query: {}, hash: '' }

export const emptyMatch = { path: '', pathname: '', params: emptyObject }

export const locationKey: LocationKey[] = ['hash', 'key', 'pathname', 'search', 'state']

export const getError = (msg: string): string => {
  return `${msg} 须在 "BrowserRouter"、"HashRouter" 内的组件中使用`
}

/**
 * firstChar
 * @param str
 * @param insert
 */
export const firstChar = (str = '', insert = ''): string => {
  if (str === insert) return ''
  if (!!str && !str.startsWith(insert)) return `${insert}${str}`
  return str || ''
}

/**
 * lastChar
 * @param str
 */
export const lastChar = (str = ''): string => {
  return str.replace(/^\/*/, '/').replace(/\/+$/, '')
}

/**
 * routePath
 * @param parentPath
 * @param path
 */
export const routePath = (parentPath: string, path = ''): string => {
  if (!path) return parentPath
  let _parentPath = lastChar(parentPath)
  const pos = _parentPath.indexOf('/*')
  if (pos >= 0) {
    _parentPath = parentPath.substr(0, pos)
  }

  return `${_parentPath}${lastChar(firstChar(path, '/'))}`
}

/**
 * queryToSearch
 * @param to
 */
export const queryToSearch = (to: To): HistoryPartialPath => {
  const partialPath = typeof to === 'string' ? { pathname: to } : to

  const search = firstChar(qs.stringify(partialPath.query, { arrayFormat: 'brackets' }), '?')

  return { hash: firstChar(partialPath.hash), pathname: partialPath.pathname || '', search }
}

/**
 * parsePath
 * @param to
 */
export const parsePath = (to: To): PartialPath => {
  if (typeof to !== 'string') return { hash: '', query: {}, ...to }

  const partialPath: PartialPath = {}

  if (to) {
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
  }

  return partialPath
}

type ParentProps = {
  compoentsRouter: typeof compoentsRouterKey
  match: Ref<PathMatch> | null
  routes?: boolean
}

/**
 * getCrParent
 * @param parent
 */
export const getCrParent = (
  parent?: ComponentInternalInstance
): ComponentInternalInstance | null => {
  const instance = parent || getCurrentInstance()
  if (!(instance && instance.parent)) {
    return null
  }
  if (instance.parent.props.compoentsRouter === compoentsRouterKey) {
    return instance.parent
  }
  const result = getCrParent(instance.parent)

  return result
}

/**
 * getCrParentProps
 * @param parent
 */
export const getCrParentProps = (parent?: ComponentInternalInstance | null): ParentProps => {
  const crParent = parent || getCrParent()
  if (!crParent) {
    return {
      compoentsRouter: compoentsRouterKey,
      match: null
    }
  }
  return crParent.props as ParentProps
}

const trimTrailingSlashes = (path: string) => path.replace(/\/+$/, '')
const normalizeSlashes = (path: string) => path.replace(/\/\/+/g, '/')
const joinPaths = (paths: string[]) => normalizeSlashes(paths.join('/'))
const splitPath = (path: string) => normalizeSlashes(path).split('/')

/**
 * resolvePathname
 * @param toPathname
 * @param fromPathname
 */
const resolvePathname = (toPathname: string, fromPathname: string): string => {
  const segments = splitPath(trimTrailingSlashes(fromPathname))
  const relativeSegments = splitPath(toPathname)

  relativeSegments.forEach((segment) => {
    if (segment === '..') {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop()
    } else if (segment !== '.') {
      segments.push(segment)
    }
  })

  return segments.length > 1 ? joinPaths(segments) : '/'
}

/**
 * resolvePath
 * @param to
 * @param fromPathname
 */
export const resolvePath = (to: To, fromPathname = '/'): Path => {
  const { pathname: toPathname, query = {}, hash = '' } = parsePath(to)

  const pathname = toPathname
    ? resolvePathname(toPathname, toPathname.startsWith('/') ? '/' : fromPathname)
    : fromPathname

  return { pathname, query, hash }
}
