// https://github.com/ReactTraining/react-router/blob/dev/packages/react-router/index.tsx

import type { Mutable, Params, PathMatch, PathPattern } from '../types'

type Result = [RegExp, string[]]

const cache: Record<string, Record<string, Result>> = {}
const cacheLimit = 10000
let cacheCount = 0

const trimTrailingSlashes = (path: string) => path.replace(/\/+$/, '')
export const normalizeSlashes = (path: string): string => path.replace(/\/\/+/g, '/')
const joinPaths = (paths: string[]) => normalizeSlashes(paths.join('/'))
const splitPath = (path: string) => normalizeSlashes(path).split('/')
const safelyDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    return value
  }
}

const compilePath = (path: string, caseSensitive = false, end = true): Result => {
  const cacheKey = `${caseSensitive}${end}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

  if (pathCache[path]) return pathCache[path]

  const keys: string[] = []
  let source = `^(${path
    .replace(/^\/*/, '/') // Make sure it has a leading /
    .replace(/\/?\*?$/, '') // Ignore trailing / and /*, we'll handle it below
    .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
    .replace(/:(\w+)/g, (_: string, key: string) => {
      keys.push(key)
      return '([^\\/]+)'
    })})`

  if (path.endsWith('*')) {
    if (path.endsWith('/*')) {
      source += '(?:\\/(.+)|\\/?)' // Don't include the / in params['*']
    } else {
      source += '(.*)'
    }
    keys.push('*')
  } else if (end) {
    source += '\\/?'
  }

  if (end) source += '$'

  const flags = caseSensitive ? undefined : 'i'
  const matcher = new RegExp(source, flags)

  const result: Result = [matcher, keys]

  if (cacheCount < cacheLimit) {
    pathCache[path] = result
    cacheCount++
  }

  return result
}

/**
 * matchPath
 * @param pattern
 * @param pathname
 */
export const matchPath = <ParamKey extends string = string>(
  pattern: PathPattern | string,
  pathname: string
): PathMatch<ParamKey> | null => {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true }
  }
  const [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end)
  const match = pathname.match(matcher)

  if (!match) return null

  const matchedPathname = match[1]
  const values = match.slice(2)
  const params: Params = paramNames.reduce<Mutable<Params>>((memo, paramName, index) => {
    memo[paramName] = safelyDecodeURIComponent(values[index] || '')
    return memo
  }, {})

  return { params, pathname: matchedPathname, pattern }
}

/**
 * resolvePathname
 * @param toPathname
 * @param fromPathname
 */
export const resolvePathname = (toPathname: string, fromPathname: string): string => {
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
