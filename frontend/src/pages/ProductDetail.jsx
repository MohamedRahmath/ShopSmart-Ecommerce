import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/axios'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/products/${id}`)
        setProduct(res.data.data)
      } catch (err) {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <p className="text-center py-12 text-gray-500">Loading...</p>
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>
  if (!product) return null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 text-amber-500 mb-3">
            {'★'.repeat(Math.round(product.avgRating || 0))}
            {'☆'.repeat(5 - Math.round(product.avgRating || 0))}
            <span className="text-gray-400 text-sm ml-1">
              ({product.avgRating?.toFixed(1) || '0.0'})
            </span>
          </div>

          <p className="text-2xl font-semibold text-gray-900 mb-4">
            Rs. {product.price?.toLocaleString()}
          </p>

          <p className="text-gray-600 text-sm mb-6">{product.description}</p>

          <p className="text-sm text-gray-500 mb-4">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-gray-600">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-md border border-gray-200 hover:bg-gray-50"
              >
                −
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-8 h-8 rounded-md border border-gray-200 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}