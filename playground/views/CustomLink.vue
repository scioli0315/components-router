<script lang="tsx">
import type { RouterLinkSlotProps } from '@src/index'
import { Route, RouterLink, Routes } from '@src/index'
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

const OldSchoolMenuLink = defineComponent({
  props: {
    to: String,
    label: String
  },
  setup(props) {
    return () => (
      <RouterLink to={props.to} custom>
        {({ navigate, isExactActive }: RouterLinkSlotProps) => (
          <span onClick={navigate}>
            {isExactActive && '> '}
            {props.label}
          </span>
        )}
      </RouterLink>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <div>
        <ul>
          <li>
            <OldSchoolMenuLink label="Home" />
          </li>
          <li>
            <OldSchoolMenuLink to="about" label="About" />
          </li>
        </ul>

        <Routes>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Routes>
      </div>
    )
  }
})
</script>
