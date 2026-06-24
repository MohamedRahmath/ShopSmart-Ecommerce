import { useEffect, useState } from 'react'
import api from '../services/axios'

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home',
  'Books',
  'Beauty',
  'Sports',
  'Toys',
  'Food',
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  }

  const [form, setForm] = useState(emptyForm)

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tab === 'products') {
        const res = await api.get('/products?limit=50')
        setProducts(res.data.data)
      } else {
        const res = await api.get('/orders')
        setOrders(res.data.data)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tab])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      images: form.imageUrl ? [form.imageUrl] : [],
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload)
      } else {
        await api.post('/products', payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleEditClick = (product) => {
    setEditingId(product._id)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      imageUrl: product.images?.[0] || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      if (editingId === id) handleCancelEdit()
      fetchData()
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      fetchData()
    } catch (err) {
      setError('Failed to update order status')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
            tab === 'products'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
            tab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          Orders
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {tab === 'products' ? (
        <div>
          {/* Add / Edit Form */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {/* Name */}
              <input
                type="text"
                placeholder="Product Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Category Dropdown */}
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Price */}
              <input
                type="number"
                placeholder="Price (Rs.)"
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Stock */}
              <input
                type="number"
                placeholder="Stock Quantity"
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Image URL */}
              <input
                type="text"
                placeholder="Image URL (https://...)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 lg:col-span-2"
              />

              {/* Description */}
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2 lg:col-span-3"
              />

              {/* Image Preview */}
              {form.imageUrl && (
                <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3">
                  <span className="text-xs text-gray-500">Preview:</span>
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-md px-5 py-2 text-sm font-medium hover:bg-blue-700"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-100 text-gray-700 rounded-md px-5 py-2 text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products Table */}
          {loading ? (
            <p className="text-gray-500 text-sm">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-sm">No products yet. Add one above.</p>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p._id}
                      className={`border-t border-gray-100 ${
                        editingId === p._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">
                              No img
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {p.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        Rs. {p.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${
                            p.stock === 0
                              ? 'text-red-500'
                              : p.stock < 5
                              ? 'text-amber-500'
                              : 'text-green-600'
                          }`}
                        >
                          {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Orders Tab */
        <div>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr
                      key={o._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {o._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">{o.user?.name || 'N/A'}</td>
                      <td className="px-4 py-3 font-medium">
                        Rs. {o.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            o.paymentStatus === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : o.paymentStatus === 'Failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {o.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o._id, e.target.value)
                          }
                          className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}