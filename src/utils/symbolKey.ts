import { InjectionKey } from 'vue'

import { RouterState } from '../types'

const routerStateKey: InjectionKey<RouterState> = Symbol('router state key')
const compoentsRouterUsed: InjectionKey<boolean> = Symbol('compoents router used')

const compoentsRouter = Symbol('compoents router')

export { compoentsRouterUsed, routerStateKey, compoentsRouter }
