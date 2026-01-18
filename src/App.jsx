import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import VehicleList from './pages/VehicleList'
import VehicleDetails from './pages/VehicleDetails'
import Favorites from './pages/Favorites'
import SellVehicle from './pages/SellVehicle'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="vehicles" element={<VehicleList />} />
        <Route path="vehicles/:id" element={<VehicleDetails />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="sell" element={<SellVehicle />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="admin" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
