<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    msg: String
  },
  setup(props) {
    return () => (
      <div>
        <h1>{props.msg}</h1>
      </div>
    )
  }
})
</script>
