<script lang="tsx">
import { Route, RouterLink, Routes, useParams } from '@src/index'
import { defineComponent } from 'vue'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const Topic = defineComponent({
  setup() {
    const params = useParams<{ topicId: string }>()

    return () => {
      const { topicId } = params.value

      return (
        <div>
          <h3>{topicId}</h3>
        </div>
      )
    }
  }
})

const Topics = defineComponent({
  setup() {
    return () => (
      <div>
        <h2>Topics</h2>
        <ul>
          <li>
            <RouterLink to="rendering">Rendering with React</RouterLink>
          </li>
          <li>
            <RouterLink to="components">Components</RouterLink>
          </li>
          <li>
            <RouterLink to="props-v-state">Props v. State</RouterLink>
          </li>
        </ul>

        <Routes>
          <Route path="/">
            <h3>Please select a topic.</h3>
          </Route>
          <Route path="/:topicId">
            <Topic />
          </Route>
        </Routes>
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
            <RouterLink to="topics">Topics</RouterLink>
          </li>
        </ul>

        <Routes>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/topics/*">
            <Topics />
          </Route>
        </Routes>
      </div>
    )
  }
})
</script>
