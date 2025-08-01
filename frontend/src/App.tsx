import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext'
import AppRoutes from './routes/AppRoutes'
import { SazonDevModeToggle } from './components/DevModeToggle'

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <SazonDevModeToggle />
        </div>
      </UserContextProvider>
    </BrowserRouter>
  )
}

export default App 