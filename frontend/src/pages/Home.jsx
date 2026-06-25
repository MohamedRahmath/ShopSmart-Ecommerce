import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?limit=100')
        setProducts(res.data.data)
      } catch (err) {
        console.error('Failed to load featured products', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  return (
    <div>
      <section className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            Shop smarter with ShopSmart
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Fast checkout, great deals, and everything you need — all in one place.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-md hover:bg-blue-50"
          >
            Browse Products
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured Products</h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}