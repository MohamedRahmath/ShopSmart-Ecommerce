import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">No image</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
        <p className="text-sm text-gray-500">Rs. {item.price.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          +
        </button>
      </div>

      <div className="text-sm font-semibold w-20 text-right">
        Rs. {(item.price * item.quantity).toLocaleString()}
      </div>

      <button
        onClick={() => removeItem(item.productId)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  )
}