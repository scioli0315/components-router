import { InjectionKey } from 'vue'

import { RouterState } from '../types'

const routerStateKey: InjectionKey<RouterState> = Symbol('routerStateKey')
const compoentsRouterActive: InjectionKey<boolean> = Symbol('compoentsRouterActive')

const compoentsRouterKey = Symbol('compoentsRouterKey')

export { compoentsRouterActive, routerStateKey, compoentsRouterKey }
