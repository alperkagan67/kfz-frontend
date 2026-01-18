import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import VehicleList from './pages/VehicleList'
import SellVehicle from './pages/SellVehicle'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="vehicles" element={<VehicleList />} />
        <Route path="sell" element={<SellVehicle />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
