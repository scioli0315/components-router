import qs from 'qs'
import { ComponentInternalInstance, getCurrentInstance, Ref } from 'vue'

import type { HistoryPartialPath, MatchResult, PartialPath, Path, To } from '../types'
import { normalizeSlashes, resolvePathname } from './reactRouter'
import { compoentsRouter } from './symbolKey'

export const emptyObject = {}

export const emptyPath = { pathname: '', query: {}, hash: '' }

export const emptyMatch = { path: '', pathname: '', params: emptyObject }

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

  return { hash: initial(partialPath.hash), pathname: partialPath.pathname || '', search }
}

/**
 * parsePath
 * @param to
 */
export const parsePath = (to: To): PartialPath => {
  if (typeof to !== 'string') return { hash: '', query: {}, ...to }
  if (!to) return {}

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

type ParentProps = {
  __compoentsRouter: typeof compoentsRouter
  __match: Ref<MatchResult> | null
  __routes?: boolean
}

/**
 * getCurrentParentProps
 * @param parent
 */
export const getCurrentParentProps = (parent?: ComponentInternalInstance | null): ParentProps => {
  const crParent = parent || getCurrentParent()
  if (!crParent) {
    return {
      __compoentsRouter: compoentsRouter,
      __match: null
    }
  }
  return crParent.props as ParentProps
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
