<script lang="tsx">
import { Route, RouterLink, Routes } from '@src/index'
import { defineComponent } from 'vue'

const routes = [
  {
    path: '/',
    sidebar: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: '/bubblegum',
    sidebar: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: '/shoelaces',
    sidebar: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
]

export default defineComponent({
  setup() {
    return () => (
      <div style={{ display: 'flex' }}>
        <div
          style={{
            padding: '10px',
            width: '40%',
            background: '#f0f0f0'
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li>
              <RouterLink to="">Home</RouterLink>
            </li>
            <li>
              <RouterLink to="bubblegum">Bubblegum</RouterLink>
            </li>
            <li>
              <RouterLink to="shoelaces">Shoelaces</RouterLink>
            </li>
          </ul>

          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path}>
                <route.sidebar />
              </Route>
            ))}
          </Routes>
        </div>

        <div style={{ flex: 1, padding: '10px' }}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path}>
                <route.main />
              </Route>
            ))}
          </Routes>
        </div>
      </div>
    )
  }
})
</script>
