<script lang="tsx">
import { Navigate, Route, RouterLink, Routes } from '@src/index'
import { defineComponent } from 'vue'

import logo from './assets/logo.png'
import About from './components/About.vue'
import Home from './components/Home.vue'

export default defineComponent({
  setup() {
    return () => (
      <>
        <img alt="Vue logo" class="logo" src={logo} />
        <ul>
          <li>
            <RouterLink to="">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="about">About</RouterLink>
          </li>
        </ul>
        <Routes>
          <Route path="home">
            <Navigate to="/" />
          </Route>
          <Route path="/">
            <Home msg="Home" />
          </Route>
          <Route path="about">
            <About msg="About" />
          </Route>
        </Routes>
      </>
    )
  }
})
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  width: 200px;
}
ul {
  display: flex;
  list-style: none;
  padding: 0;
  justify-content: center;
  li {
    margin: 0 12px;
  }
  a {
    color: #42b983;
  }
}
</style>
