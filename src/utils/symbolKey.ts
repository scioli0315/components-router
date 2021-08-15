import { InjectionKey } from 'vue'

import { RouterState } from '../types'

const routerStateKey: InjectionKey<RouterState> = Symbol('router stateKey')
const compoentsRouterActive: InjectionKey<boolean> = Symbol('compoents router active')

const compoentsRouter = Symbol('compoents router')

export { compoentsRouterActive, routerStateKey, compoentsRouter }
