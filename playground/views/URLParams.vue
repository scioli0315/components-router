<script lang="tsx">
import { Route, RouterLink, Routes, useParams } from '@src/index'
import { defineComponent } from 'vue'

const Child = defineComponent({
  setup() {
    const params = useParams()

    return () => (
      <div>
        <h3>ID: {params.value.id}</h3>
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <div>
        <h2>Accounts</h2>

        <ul>
          <li>
            <RouterLink to="netflix">Netflix</RouterLink>
          </li>
          <li>
            <RouterLink to="zillow-group">Zillow Group</RouterLink>
          </li>
          <li>
            <RouterLink to="yahoo">Yahoo</RouterLink>
          </li>
          <li>
            <RouterLink to="modus-create">Modus Create</RouterLink>
          </li>
        </ul>

        <Routes>
          <Route path="/:id">
            <Child />
          </Route>
        </Routes>
      </div>
    )
  }
})
</script>
