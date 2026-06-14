import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'

export default function Cart() {
  const { items, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Browse our products and add something you like.</p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}

        <div className="flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-gray-800">Total</span>
          <span className="text-lg font-bold text-gray-900">
            Rs. {total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-blue-600 text-white rounded-md py-2.5 font-medium hover:bg-blue-700 mt-4"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}