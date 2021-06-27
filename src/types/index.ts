import type {
  Action,
  Blocker,
  History,
  Location,
  PartialPath as HistoryPartialPath,
  State,
  Transition,
  Update
} from 'history'
import { Ref } from 'vue'

export type LocationKey = 'hash' | 'key' | 'pathname' | 'search' | 'state'
export type Params = Record<string, string>
export type Query = { [key: string]: undefined | string | string[] | Query | Query[] }
export type To = string | PartialPath
export type PathPattern = string | { path: string; caseSensitive?: boolean; end?: boolean }

export interface RouterState {
  basename: string
  navigator: History
  location: Location
  linkActive: RouterProps
}

export interface RouterProps {
  basename?: string
  linkActiveClass?: string
  linkExactActiveClass?: string
}

export interface Path {
  pathname: string
  query: Query
  hash: string
}

export interface PartialPath {
  pathname?: string
  query?: Query
  hash?: string
}

export interface PathMatch {
  path: string
  pathname: string
  params: Params
}

export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void
  (delta: number): void
}

export interface NavigateOptions {
  replace?: boolean
  state?: State
}

export type MaybeRef<T> = Ref<T> | T

export { HistoryPartialPath, Action, Blocker, Transition, State, History, Location, Update }
