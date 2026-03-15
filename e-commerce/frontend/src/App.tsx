import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CTI E-Commerce Platform
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to the CTI E-Commerce Platform. This is a production-ready scaffolding setup.
          </p>
        </div>
        <Routes>
          {/* Routes will be added here */}
        </Routes>
      </main>
    </Router>
  )
}

export default App
