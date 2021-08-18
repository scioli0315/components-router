<script lang="tsx">
import { Location, Navigate, Route, RouterLink, Routes, useLocation, useNavigate } from '@src/index'
import { defineComponent, inject, InjectionKey, provide, Ref, ref } from 'vue'

type CB = () => void
type FN = (cb: CB) => void
const userKey: InjectionKey<Ref<null | string>> = Symbol('user')
const signinKey: InjectionKey<FN> = Symbol('signin')
const signoutKey: InjectionKey<FN> = Symbol('signout')

const fakeAuth = {
  isAuthenticated: false,
  signin(cb: CB) {
    fakeAuth.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb: CB) {
    fakeAuth.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const PublicPage = () => <h3>Public</h3>

const ProtectedPage = () => <h3>Protected</h3>

const ProvideAuth = defineComponent({
  setup(props, { slots }) {
    const user: Ref<null | string> = ref(null)
    const signin = (cb: CB) => {
      return fakeAuth.signin(() => {
        user.value = 'user'
        cb()
      })
    }

    const signout = (cb: CB) => {
      return fakeAuth.signout(() => {
        user.value = null
        cb()
      })
    }

    provide(userKey, user)
    provide(signinKey, signin)
    provide(signoutKey, signout)

    return () => slots.default?.()
  }
})

const AuthButton = defineComponent({
  setup() {
    const navigate = useNavigate()
    const user = inject(userKey)
    const signout = inject(signoutKey)

    return () =>
      user?.value ? (
        <p>
          Welcome!{' '}
          <button
            onClick={() => {
              signout?.(() => navigate())
            }}
          >
            Sign out
          </button>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )
  }
})

const PrivateRoute = defineComponent({
  props: {
    path: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    const user = inject(userKey)
    const location = useLocation()

    return () => (
      <Route path={props.path}>
        {user?.value ? slots.default?.() : <Navigate to="../login" state={{ from: location }} />}
      </Route>
    )
  }
})

const LoginPage = defineComponent({
  setup() {
    const navigate = useNavigate()
    const location = useLocation()
    const signin = inject(signinKey)

    const { from } = (location.state || { from: { pathname: '/' } }) as { from: Location }

    const login = () => {
      signin?.(() => {
        navigate(from, { replace: true })
      })
    }

    return () => (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={login}>Log in</button>
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <ProvideAuth>
        <div>
          <AuthButton />

          <ul>
            <li>
              <RouterLink to="public">Public Page</RouterLink>
            </li>
            <li>
              <RouterLink to="protected">Protected Page</RouterLink>
            </li>
          </ul>

          <Routes>
            <Route path="/public">
              <PublicPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/protected">
              <ProtectedPage />
            </PrivateRoute>
          </Routes>
        </div>
      </ProvideAuth>
    )
  }
})
</script>
