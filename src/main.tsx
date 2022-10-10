import { MantineProvider } from '@mantine/core'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './preflight.css'


//TODO ardde back strict mode on finish
ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>

  </>
)
