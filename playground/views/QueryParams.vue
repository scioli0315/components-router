<script lang="tsx">
import { RouterLink, useQuery } from '@src/index'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const query = useQuery()

    return () => (
      <div>
        <h2>Accounts</h2>

        <ul>
          <li>
            <RouterLink to="account?name=netflix">Netflix</RouterLink>
          </li>
          <li>
            <RouterLink to="account?name=zillow-group">Zillow Group</RouterLink>
          </li>
          <li>
            <RouterLink to={{ pathname: 'account', query: { name: 'yahoo' } }}>Yahoo</RouterLink>
          </li>
          <li>
            <RouterLink to={{ pathname: 'account', query: { name: 'modus-create' } }}>
              Modus Create
            </RouterLink>
          </li>
        </ul>

        <div>
          {query.value.name ? (
            <h3>
              The <code>name</code> in the query string is &quot;{query.value.name}
              &quot;
            </h3>
          ) : (
            <h3>There is no name in the query string</h3>
          )}
        </div>
      </div>
    )
  }
})
</script>
