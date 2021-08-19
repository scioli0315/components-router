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

export type Params = Record<string, string>
export type Query = { [key: string]: undefined | string | string[] | Query | Query[] }
export type To = string | PartialPath
export type PathPattern = string | { path: string; caseSensitive?: boolean; end?: boolean }
export type PartialPath = Partial<Path>
export type MaybeRef<T> = Ref<T> | T

export interface LinkActive {
  linkActiveClass: string
  linkExactActiveClass: string
}

export interface RouterState<S extends State = State> {
  basename: string
  navigator: History<S>
  location: Location<S>
  linkActive: LinkActive
}

export interface RouterProps extends Partial<LinkActive> {
  basename?: string
}

export interface Path {
  pathname: string
  query: Query
  hash: string
}

export interface MatchResult<T extends Params = Params> {
  path: string
  pathname: string
  params: T
}

export interface NavigateFunction {
  (to?: To | number, options?: NavigateOptions): void
  (delta: number): void
}

export interface NavigateOptions {
  replace?: boolean
  state?: State
}

export interface RouterLinkSlotProps {
  href: string
  isActive: boolean
  isExactActive: boolean
  navigate(): void
}

export { HistoryPartialPath, Action, Blocker, Transition, State, History, Location, Update }
