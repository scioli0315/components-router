<script lang="tsx">
import { Navigate, Route, RouterLink, Routes } from '@src/index'
import { defineComponent } from 'vue'

import logo from './assets/logo.png'
import Auth from './views/Auth.vue'
import Basic from './views/Basic.vue'
import CustomLink from './views/CustomLink.vue'
import NoMatch from './views/NoMatch.vue'
import PreventingTransitions from './views/PreventingTransitions.vue'
import QueryParams from './views/QueryParams.vue'
import Recursive from './views/Recursive.vue'
import URLParams from './views/URLParams.vue'

export default defineComponent({
  setup() {
    return () => (
      <>
        <img v-show={false} alt="logo" class="logo" src={logo} />
        <ul>
          <li>
            <RouterLink to="basic">Basic</RouterLink>
          </li>
          <li>
            <RouterLink to="url-params">URL Params</RouterLink>
          </li>
          <li>
            <RouterLink to="auth-workflow">Redirects (Auth)</RouterLink>
          </li>
          <li>
            <RouterLink to="custom-link">Custom Link</RouterLink>
          </li>
          <li>
            <RouterLink to="preventing-transitions">Preventing Transitions</RouterLink>
          </li>
          <li>
            <RouterLink to="no-match">No Match (404)</RouterLink>
          </li>
          <li>
            <RouterLink to="recursive-paths">Recursive Paths</RouterLink>
          </li>
          <li>
            <RouterLink to="query-parameters">Query Params</RouterLink>
          </li>
        </ul>
        <hr />
        <Routes>
          <Route path="/">
            <Navigate to="/basic" />
          </Route>
          <Route path="/basic/*">
            <Basic />
          </Route>
          <Route path="/url-params/*">
            <URLParams />
          </Route>
          <Route path="/auth-workflow/*">
            <Auth />
          </Route>
          <Route path="/custom-link/*">
            <CustomLink />
          </Route>
          <Route path="/preventing-transitions/*">
            <PreventingTransitions />
          </Route>
          <Route path="/no-match/*">
            <NoMatch />
          </Route>
          <Route path="/recursive-paths/*">
            <Recursive />
          </Route>
          <Route path="/query-parameters/*">
            <QueryParams />
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
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  width: 200px;
}
ul {
  li {
    margin: 0 12px;
  }
  a {
    text-decoration: none;
  }
  a.router-link-active {
    color: #42b983;
  }
  a.router-link-exact-active {
    text-decoration: underline;
    color: #42b983;
  }
}
</style>
