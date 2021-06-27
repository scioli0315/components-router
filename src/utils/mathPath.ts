import type { Params, PathMatch, PathPattern } from '../types'

type Result = {
  matcher: RegExp
  paramNames: string[]
}

const cache: Record<string, Record<string, Result>> = {}
const cacheLimit = 10000
let cacheCount = 0

const safelyDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '))
  } catch (error) {
    return value
  }
}

const compilePath = (path: string, caseSensitive: boolean, end: boolean): Result => {
  const cacheKey = `${caseSensitive}${end}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

  if (pathCache[path]) return pathCache[path]

  const paramNames: string[] = []
  let source = `^(${path
    .replace(/^\/*/, '/') // Make sure it has a leading /
    .replace(/\/?\*?$/, '') // Ignore trailing / and /*, we'll handle it below
    .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
    .replace(/:(\w+)/g, (_: string, key: string) => {
      paramNames.push(key)
      return '([^\\/]+)'
    })})`

  if (path.endsWith('*')) {
    if (path.endsWith('/*')) {
      source += '\\/?' // Don't include the / in params['*']
    }
    paramNames.push('*')
    source += '(.*)'
  } else if (end) {
    source += '\\/?'
  }

  if (end) source += '$'

  const flags = caseSensitive ? undefined : 'i'
  const matcher = new RegExp(source, flags)

  const result = { matcher, paramNames }

  if (cacheCount < cacheLimit) {
    pathCache[path] = result
    cacheCount++
  }

  return result
}

const matchPath = (pattern: PathPattern, pathname: string): PathMatch | null => {
  const {
    path,
    caseSensitive = false,
    end = true
  } = typeof pattern === 'string' ? { path: pattern } : pattern
  const { matcher, paramNames } = compilePath(path, caseSensitive, end)
  const match = pathname.match(matcher)

  if (!match) return null

  const matchedPathname = match[1]
  const values = match.slice(2)
  const params = paramNames.reduce((memo, paramName, index) => {
    memo[paramName] = safelyDecodeURIComponent(values[index])
    return memo
  }, {} as Params)

  return { path, pathname: matchedPathname, params }
}

export default matchPath
