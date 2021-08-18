<script lang="tsx">
import { Route, RouterLink, Routes, useBlocker } from '@src/index'
import { defineComponent, ref, watch } from 'vue'

const BlockingForm = defineComponent({
  setup() {
    // const location = useLocation()
    const something = ref('')
    const isBlocking = ref(false)
    watch(something, () => {
      isBlocking.value = something.value.length > 0
    })

    // usePrompt(`Are you sure you want to leave ${location.pathname}`, isBlocking)

    useBlocker(({ location, retry }) => {
      if (window.confirm(`Are you sure you want to go to ${location.pathname}`)) {
        retry()
      }
    }, isBlocking)

    return () => (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          something.value = ''
        }}
      >
        <p>Blocking? {isBlocking.value ? 'Yes, click a link or the back button' : 'Nope'}</p>
        <p>
          <input
            size="50"
            placeholder="type something to block transitions"
            v-model={something.value}
          />
        </p>
        <p>
          <button>Submit to stop blocking</button>
        </p>
      </form>
    )
  }
})

export default defineComponent({
  setup() {
    return () => (
      <div>
        <ul>
          <li>
            <RouterLink>Form</RouterLink>
          </li>
          <li>
            <RouterLink to="one">One</RouterLink>
          </li>
          <li>
            <RouterLink to="two">Two</RouterLink>
          </li>
        </ul>

        <Routes>
          <Route path="/">
            <BlockingForm />
          </Route>
          <Route path="/one">
            <h3>One</h3>
          </Route>
          <Route path="/two">
            <h3>Two</h3>
          </Route>
        </Routes>
      </div>
    )
  }
})
</script>
