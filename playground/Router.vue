<script lang="tsx">
import { BrowserRouter as Router } from '@src/index'
import { defineComponent } from 'vue'

import App from './App.vue'

export default defineComponent({
  setup() {
    return () => (
      <Router>
        <App />
      </Router>
    )
  }
})
</script>
