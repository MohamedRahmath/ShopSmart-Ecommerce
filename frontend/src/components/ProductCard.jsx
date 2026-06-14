import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">No image</span>
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-amber-500">
          {'★'.repeat(Math.round(product.avgRating || 0))}
          {'☆'.repeat(5 - Math.round(product.avgRating || 0))}
          <span className="text-gray-400 ml-1">({product.avgRating?.toFixed(1) || '0.0'})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-gray-900">
            Rs. {product.price?.toLocaleString()}
          </span>

          <button
            onClick={() => addItem(product)}
            className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}