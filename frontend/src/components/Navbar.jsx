import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600" onClick={closeMenu}>
          ShopSmart
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/products" className="hover:text-blue-600">Products</Link>

          <Link to="/cart" className="relative hover:text-blue-600">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {itemCount}
              </span>
            )}
          </Link>

          {isAdmin && <Link to="/admin" className="hover:text-blue-600">Admin</Link>}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-md hover:bg-gray-100">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative" onClick={closeMenu}>
            <span className="text-sm">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200"
            aria-label="Toggle menu"
          >
            <span className="text-lg">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/products" onClick={closeMenu} className="hover:text-blue-600">Products</Link>

          {isAdmin && <Link to="/admin" onClick={closeMenu} className="hover:text-blue-600">Admin</Link>}

          {isAuthenticated ? (
            <>
              <span className="text-gray-600">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-left">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={closeMenu} className="flex-1 text-center px-3 py-2 rounded-md border border-gray-200">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-md">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}