import React from 'react'
import '../main.css'
import { Home } from '../Pages/Home'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          {' '}
        </Route>
      </Routes>
    </Router>
  )
}
