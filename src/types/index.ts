import type {
  Action,
  Blocker,
  History,
  Location as HistoryLocation,
  PartialPath as HistoryPartialPath,
  State,
  Transition,
  Update
} from 'history'
import { Ref } from 'vue'

export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined
}
export type Query = { [key: string]: undefined | string | string[] | Query | Query[] }
export type To = string | PartialPath
export type PathPattern = { path: string; caseSensitive?: boolean; end?: boolean }
export type PartialPath = Partial<Path>
export type MaybeRef<T> = Ref<T> | T
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export interface Location<S extends State = State> extends HistoryLocation<S> {
  query: Query
}

export type PartialLocation = Partial<Location>

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

export interface PathMatch<ParamKey extends string = string> {
  pattern: PathPattern
  pathname: string
  params: Params<ParamKey>
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

export { HistoryPartialPath, Action, Blocker, Transition, State, History, Update }
