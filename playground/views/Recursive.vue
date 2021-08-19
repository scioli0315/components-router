<script lang="tsx">
import { Navigate, Route, RouterLink, Routes, useParams } from '@src/index'
import { computed, defineComponent } from 'vue'

const PEEPS = [
  { id: 0, name: 'Michelle', friends: [1, 2, 3] },
  { id: 1, name: 'Sean', friends: [0, 3] },
  { id: 2, name: 'Kim', friends: [0, 1, 3] },
  { id: 3, name: 'David', friends: [1, 2] }
]

const find = (id: number) => {
  return PEEPS.find((p) => p.id === id)
}

const Person = defineComponent({
  setup() {
    const params = useParams<{ id: string }>()
    const person = computed(() => find(parseInt(params.value.id)))

    return () => (
      <div>
        <h3>{person.value?.name}’s Friends</h3>

        <ul>
          {person.value?.friends.map((id) => (
            <li key={id}>
              <RouterLink to={`${id}`}>{find(id)?.name}</RouterLink>
            </li>
          ))}
        </ul>

        <Routes>
          <Route path="/:id/*">
            <Person />
          </Route>
        </Routes>
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <Routes>
        <Route path="/:id/*">
          <Person />
        </Route>
        <Route path="/">
          <Navigate to="0" />
        </Route>
      </Routes>
    )
  }
})
</script>
