<script lang="tsx">
import { Navigate, Route, RouterLink, Routes, useLocation } from '@src/index'
import { defineComponent } from 'vue'

const Home = () => <h3>Home</h3>

const WillMatch = () => <h3>Matched!</h3>

const NoMatch = defineComponent({
  setup() {
    const location = useLocation()

    return () => (
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <div>
        <ul>
          <li>
            <RouterLink>Home</RouterLink>
          </li>
          <li>
            <RouterLink to="old-match">Old Match, to be redirected</RouterLink>
          </li>
          <li>
            <RouterLink to="will-match">Will Match</RouterLink>
          </li>
          <li>
            <RouterLink to="will-not-match">Will Not Match</RouterLink>
          </li>
          <li>
            <RouterLink to="also/will/not/match">Also Will Not Match</RouterLink>
          </li>
        </ul>

        <Routes>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/old-match">
            <Navigate to="../will-match" />
          </Route>
          <Route path="/will-match">
            <WillMatch />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Routes>
      </div>
    )
  }
})
</script>
