import { useEffect, useState } from 'react'
import api from '../services/axios'

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  })

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

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      })
      setForm({ name: '', description: '', price: '', category: '', stock: '' })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            tab === 'products'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
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
          <form
            onSubmit={handleAddProduct}
            className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            <input
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Category"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Price"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Stock"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Add Product
            </button>
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm sm:col-span-2 lg:col-span-5"
            />
          </form>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t border-gray-100">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.category}</td>
                      <td className="px-4 py-2">Rs. {p.price?.toLocaleString()}</td>
                      <td className="px-4 py-2">{p.stock}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-500 hover:text-red-700"
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
        <div>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-t border-gray-100">
                      <td className="px-4 py-2 font-mono text-xs">{o._id}</td>
                      <td className="px-4 py-2">{o.user?.name || o.user}</td>
                      <td className="px-4 py-2">Rs. {o.totalAmount?.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="border border-gray-200 rounded-md px-2 py-1 text-sm"
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