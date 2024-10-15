import { BrowserRouter, Route, Routes as BaseRoutes  } from 'react-router-dom'
import { Dashboard } from './Dashboard'

function App() {

  return (
    <BrowserRouter>
      <BaseRoutes>
        <Route path="/" element={<Dashboard />} />
      </BaseRoutes>
    </BrowserRouter>
  )
}

export default App
