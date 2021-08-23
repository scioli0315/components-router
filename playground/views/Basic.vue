<script lang="tsx">
import { Navigate, Route, RouterLink, Routes } from '@src/index'
import { defineComponent } from 'vue'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
)

export default defineComponent({
  setup() {
    return () => (
      <div>
        <ul>
          <li>
            <RouterLink to="home">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="about">About</RouterLink>
          </li>
          <li>
            <RouterLink to="dashboard">Dashboard</RouterLink>
          </li>
        </ul>

        <Routes>
          <Route path="/">
            <Navigate to="home" replace />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Routes>
      </div>
    )
  }
})
</script>
