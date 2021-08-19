<script lang="tsx">
import { Route, RouterLink, Routes, useLocation, useNavigate, useParams } from '@src/index'
import { defineComponent } from 'vue'

const IMAGES = [
  { id: 0, title: 'Dark Orchid', color: 'DarkOrchid' },
  { id: 1, title: 'Lime Green', color: 'LimeGreen' },
  { id: 2, title: 'Tomato', color: 'Tomato' },
  { id: 3, title: 'Seven Ate Nine', color: '#789' },
  { id: 4, title: 'Crimson', color: 'Crimson' }
]

const Thumbnail = defineComponent({
  props: {
    color: {
      type: String,
      required: true
    }
  },

  setup(props) {
    return () => (
      <div
        style={{
          width: '50px',
          height: '50px',
          background: props.color
        }}
      />
    )
  }
})

const Image = defineComponent({
  props: {
    color: {
      type: String,
      required: true
    }
  },

  setup(props) {
    return () => (
      <div
        style={{
          width: '100%',
          height: '400px',
          background: props.color
        }}
      />
    )
  }
})

const Home = () => (
  <div>
    <RouterLink to="gallery">Visit the Gallery</RouterLink>
    <h2>Featured Images</h2>
    <ul>
      <li>
        <RouterLink to="img/2">Tomato</RouterLink>
      </li>
      <li>
        <RouterLink to="img/4">Crimson</RouterLink>
      </li>
    </ul>
  </div>
)

const Gallery = defineComponent({
  setup() {
    const location = useLocation()

    return () => (
      <div>
        {IMAGES.map((i) => (
          <RouterLink key={i.id} to={`img/${i.id}`} state={{ background: location }}>
            <Thumbnail color={i.color} />
            <p>{i.title}</p>
          </RouterLink>
        ))}
      </div>
    )
  }
})

const ImageView = defineComponent({
  setup() {
    const params = useParams<{ id: string }>()
    const image = IMAGES[parseInt(params.value.id, 10)]

    return () => {
      if (!image) return <div>Image not found</div>
      return (
        <div>
          <h1>{image.title}</h1>
          <Image color={image.color} />
        </div>
      )
    }
  }
})

const Modal = defineComponent({
  setup() {
    const navigate = useNavigate()
    const params = useParams<{ id: string }>()
    const image = IMAGES[parseInt(params.value.id, 10)]

    const back = (e: Event) => {
      e.stopPropagation()
      navigate(-1)
    }

    return () => {
      if (!image) return null

      return (
        <div
          onClick={back}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.15)'
          }}
        >
          <div
            class="modal"
            style={{
              position: 'absolute',
              background: '#fff',
              top: '25px',
              left: '10%',
              right: '10%',
              padding: '15px',
              border: '2px solid #444'
            }}
          >
            <h1>{image.title}</h1>
            <Image color={image.color} />
            <button type="button" onClick={back}>
              Close
            </button>
          </div>
        </div>
      )
    }
  }
})

const ModalSwitch = defineComponent({
  setup() {
    const location = useLocation<{ background: unknown }>()
    // const background = computed(() => location.state?.background)

    return () => (
      <div>
        <Routes>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/gallery/*">
            <Gallery />
          </Route>
          <Route path="/img/:id">
            <ImageView />
          </Route>
        </Routes>

        {location.state?.background && (
          <Route path="/gallery/img/:id">
            <Modal />
          </Route>
        )}
      </div>
    )
  }
})

export default defineComponent({
  setup() {
    return () => <ModalSwitch />
  }
})
</script>
