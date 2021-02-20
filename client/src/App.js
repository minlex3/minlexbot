import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Loader } from './components/Loader'
import { useRoutes } from './routes'
import 'materialize-css'

function App() {
  let ready = true
  const routes = useRoutes()

  if (!ready) {
    return <Loader />
  }

  return (
    <Router>
      <Navbar />
      <div className="container">{routes}</div>
    </Router>
  )
}

export default App
