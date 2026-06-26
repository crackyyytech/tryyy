import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// User Pages
import HomePage from './pages/HomePage'
import FoodsPage from './pages/FoodsPage'
import FoodDetailPage from './pages/FoodDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import MyOrdersPage from './pages/MyOrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFoodsPage from './pages/admin/AdminFoodsPage'
import AdminAddFoodPage from './pages/admin/AdminAddFoodPage'
import AdminEditFoodPage from './pages/admin/AdminEditFoodPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/foods" element={<FoodsPage />} />
      <Route path="/foods/:id" element={<FoodDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected User Routes */}
      <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
      <Route path="/my-orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/foods" element={<AdminRoute><AdminFoodsPage /></AdminRoute>} />
      <Route path="/admin/add-food" element={<AdminRoute><AdminAddFoodPage /></AdminRoute>} />
      <Route path="/admin/edit-food/:id" element={<AdminRoute><AdminEditFoodPage /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
    </Routes>
  )
}

export default App
