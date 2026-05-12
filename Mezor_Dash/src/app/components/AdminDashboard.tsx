import { useState } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Upload,
  TrendingUp,
  DollarSign,
  UserPlus,
  Search,
  Filter,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data
const salesData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

type Product = {
  id: string;
  name: string;
  material: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description: string;
};

type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';
  date: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  isAdmin: boolean;
};

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Diamond Solitaire Ring',
    material: '18K White Gold',
    price: 12500,
    stock: 5,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    description: 'Elegant solitaire ring with 1.5ct diamond',
  },
  {
    id: '2',
    name: 'Pearl Necklace',
    material: 'Akoya Pearls',
    price: 8900,
    stock: 8,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    description: 'Classic strand of lustrous Akoya pearls',
  },
  {
    id: '3',
    name: 'Sapphire Earrings',
    material: '14K Yellow Gold',
    price: 6700,
    stock: 12,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    description: 'Blue sapphire drop earrings with diamond accents',
  },
];

const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Sophia Laurent',
    items: ['Diamond Solitaire Ring'],
    total: 12500,
    status: 'Pending',
    date: '2026-05-09',
  },
  {
    id: 'ORD-002',
    customer: 'James Anderson',
    items: ['Pearl Necklace', 'Sapphire Earrings'],
    total: 15600,
    status: 'Confirmed',
    date: '2026-05-08',
  },
  {
    id: 'ORD-003',
    customer: 'Emma Wilson',
    items: ['Sapphire Earrings'],
    total: 6700,
    status: 'Shipped',
    date: '2026-05-07',
  },
];

const initialUsers: User[] = [
  { id: '1', name: 'Sophia Laurent', email: 'sophia@example.com', totalSpent: 24500, isAdmin: false },
  { id: '2', name: 'James Anderson', email: 'james@example.com', totalSpent: 15600, isAdmin: false },
  { id: '3', name: 'Emma Wilson', email: 'emma@example.com', totalSpent: 6700, isAdmin: false },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    material: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    description: '',
  });

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        material: product.material,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        image: product.image,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        material: '',
        price: '',
        stock: '',
        category: '',
        image: '',
        description: '',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: productForm.name,
                material: productForm.material,
                price: parseFloat(productForm.price),
                stock: parseInt(productForm.stock),
                category: productForm.category,
                image: productForm.image,
                description: productForm.description,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productForm.name,
        material: productForm.material,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        category: productForm.category,
        image: productForm.image,
        description: productForm.description,
      };
      setProducts([...products, newProduct]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleConfirmOrder = (orderId: string) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: 'Confirmed' } : o)));
    setSelectedOrder(null);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter((o) => o.status !== 'Cancelled').length;
  const newCustomers = users.length;

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5]">
        <div className="p-6 border-b border-[#E5E5E5]">
          <h1 className="text-xl tracking-wider" style={{ color: '#2F3C67' }}>
            MEZOR JEWELS
          </h1>
          <p className="text-xs text-[#666] mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#2F3C67] text-white'
                : 'text-[#666] hover:bg-[#F5F5F5]'
            }`}
          >
            <BarChart3 size={18} strokeWidth={1.5} />
            <span className="text-sm">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
              activeTab === 'products'
                ? 'bg-[#2F3C67] text-white'
                : 'text-[#666] hover:bg-[#F5F5F5]'
            }`}
          >
            <Package size={18} strokeWidth={1.5} />
            <span className="text-sm">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#2F3C67] text-white'
                : 'text-[#666] hover:bg-[#F5F5F5]'
            }`}
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            <span className="text-sm">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
              activeTab === 'users' ? 'bg-[#2F3C67] text-white' : 'text-[#666] hover:bg-[#F5F5F5]'
            }`}
          >
            <Users size={18} strokeWidth={1.5} />
            <span className="text-sm">Users</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl mb-6" style={{ color: '#2F3C67' }}>
                Dashboard Overview
              </h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-[#E5E5E5] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#2F3C67]/10">
                      <DollarSign size={24} strokeWidth={1.5} style={{ color: '#2F3C67' }} />
                    </div>
                    <TrendingUp size={20} strokeWidth={1.5} style={{ color: '#853D28' }} />
                  </div>
                  <h3 className="text-sm text-[#666] mb-1">Total Revenue</h3>
                  <p className="text-3xl" style={{ color: '#2F3C67' }}>
                    {totalRevenue.toLocaleString()} DH
                  </p>
                </div>

                <div className="bg-white border border-[#E5E5E5] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#853D28]/10">
                      <ShoppingCart size={24} strokeWidth={1.5} style={{ color: '#853D28' }} />
                    </div>
                    <TrendingUp size={20} strokeWidth={1.5} style={{ color: '#853D28' }} />
                  </div>
                  <h3 className="text-sm text-[#666] mb-1">Active Orders</h3>
                  <p className="text-3xl" style={{ color: '#2F3C67' }}>
                    {activeOrders}
                  </p>
                </div>

                <div className="bg-white border border-[#E5E5E5] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-[#DDC2A7]/30">
                      <UserPlus size={24} strokeWidth={1.5} style={{ color: '#853D28' }} />
                    </div>
                    <TrendingUp size={20} strokeWidth={1.5} style={{ color: '#853D28' }} />
                  </div>
                  <h3 className="text-sm text-[#666] mb-1">Total Customers</h3>
                  <p className="text-3xl" style={{ color: '#2F3C67' }}>
                    {newCustomers}
                  </p>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <h3 className="text-lg mb-6" style={{ color: '#2F3C67' }}>
                  Sales Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis dataKey="month" stroke="#666" style={{ fontSize: 12 }} />
                    <YAxis stroke="#666" style={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2F3C67"
                      strokeWidth={2}
                      dot={{ fill: '#2F3C67', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Products Management */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl" style={{ color: '#2F3C67' }}>
                  Products Management
                </h2>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2F3C67] text-white hover:bg-[#253352] transition-colors"
                >
                  <Plus size={18} strokeWidth={1.5} />
                  <span className="text-sm">Add Product</span>
                </button>
              </div>

              <div className="bg-white border border-[#E5E5E5]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="text-left p-4 text-sm text-[#666]">Product</th>
                      <th className="text-left p-4 text-sm text-[#666]">Material</th>
                      <th className="text-left p-4 text-sm text-[#666]">Price</th>
                      <th className="text-left p-4 text-sm text-[#666]">Stock</th>
                      <th className="text-left p-4 text-sm text-[#666]">Category</th>
                      <th className="text-left p-4 text-sm text-[#666]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover"
                            />
                            <span className="text-sm" style={{ color: '#2F3C67' }}>
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#666]">{product.material}</td>
                        <td className="p-4 text-sm" style={{ color: '#2F3C67' }}>
                          {product.price.toLocaleString()} DH
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs ${
                              product.stock > 10
                                ? 'bg-[#2F3C67]/10 text-[#2F3C67]'
                                : 'bg-[#853D28]/10 text-[#853D28]'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-sm text-[#666]">{product.category}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenProductModal(product)}
                              className="p-2 hover:bg-[#2F3C67]/10 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} strokeWidth={1.5} style={{ color: '#2F3C67' }} />
                            </button>
                            {deleteConfirmId === product.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 hover:bg-[#853D28]/10 transition-colors"
                                  title="Confirm Delete"
                                >
                                  <Check size={16} strokeWidth={1.5} style={{ color: '#853D28' }} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="p-2 hover:bg-[#666]/10 transition-colors"
                                  title="Cancel"
                                >
                                  <X size={16} strokeWidth={1.5} style={{ color: '#666' }} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(product.id)}
                                className="p-2 hover:bg-[#853D28]/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} strokeWidth={1.5} style={{ color: '#853D28' }} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Management */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl mb-6" style={{ color: '#2F3C67' }}>
                Order Management
              </h2>

              <div className="bg-white border border-[#E5E5E5]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="text-left p-4 text-sm text-[#666]">Order ID</th>
                      <th className="text-left p-4 text-sm text-[#666]">Customer</th>
                      <th className="text-left p-4 text-sm text-[#666]">Date</th>
                      <th className="text-left p-4 text-sm text-[#666]">Total</th>
                      <th className="text-left p-4 text-sm text-[#666]">Status</th>
                      <th className="text-left p-4 text-sm text-[#666]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                        <td className="p-4 text-sm" style={{ color: '#2F3C67' }}>
                          {order.id}
                        </td>
                        <td className="p-4 text-sm text-[#666]">{order.customer}</td>
                        <td className="p-4 text-sm text-[#666]">{order.date}</td>
                        <td className="p-4 text-sm" style={{ color: '#2F3C67' }}>
                          {order.total.toLocaleString()} DH
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs ${
                              order.status === 'Pending'
                                ? 'bg-[#DDC2A7]/50 text-[#853D28]'
                                : order.status === 'Confirmed'
                                ? 'bg-[#2F3C67]/10 text-[#2F3C67]'
                                : order.status === 'Shipped'
                                ? 'bg-[#2F3C67]/20 text-[#2F3C67]'
                                : 'bg-[#853D28]/10 text-[#853D28]'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-[#2F3C67]/10 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} strokeWidth={1.5} style={{ color: '#2F3C67' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl mb-6" style={{ color: '#2F3C67' }}>
                User Management
              </h2>

              <div className="bg-white border border-[#E5E5E5]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="text-left p-4 text-sm text-[#666]">Name</th>
                      <th className="text-left p-4 text-sm text-[#666]">Email</th>
                      <th className="text-left p-4 text-sm text-[#666]">Total Spent</th>
                      <th className="text-left p-4 text-sm text-[#666]">Admin Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-[#E5E5E5] hover:bg-[#FAFAFA]">
                        <td className="p-4 text-sm" style={{ color: '#2F3C67' }}>
                          {user.name}
                        </td>
                        <td className="p-4 text-sm text-[#666]">{user.email}</td>
                        <td className="p-4 text-sm" style={{ color: '#2F3C67' }}>
                          {user.totalSpent.toLocaleString()} DH
                        </td>
                        <td className="p-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={user.isAdmin}
                              onChange={() =>
                                setUsers(
                                  users.map((u) =>
                                    u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u
                                  )
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[#E5E5E5] peer-focus:outline-none peer-checked:bg-[#2F3C67] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5E5E5] after:border after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E5E5E5]">
              <h3 className="text-xl" style={{ color: '#2F3C67' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#666] mb-2">Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-2">Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-2">Price (DH)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-2">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-2">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  >
                    <option value="">Select category</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bracelets">Bracelets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#666] mb-2">Image URL</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-[#666] mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-[#E5E5E5] focus:outline-none focus:border-[#2F3C67]"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#E5E5E5] flex justify-end gap-3">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-6 py-2 border border-[#E5E5E5] text-[#666] hover:bg-[#FAFAFA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-6 py-2 bg-[#2F3C67] text-white hover:bg-[#253352] transition-colors"
              >
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl">
            <div className="p-6 border-b border-[#E5E5E5]">
              <h3 className="text-xl" style={{ color: '#2F3C67' }}>
                Order Details - {selectedOrder.id}
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm text-[#666] mb-2">Customer Information</h4>
                <p className="text-lg" style={{ color: '#2F3C67' }}>
                  {selectedOrder.customer}
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-sm text-[#666] mb-2">Order Items</h4>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="text-sm" style={{ color: '#2F3C67' }}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h4 className="text-sm text-[#666] mb-2">Total Amount</h4>
                <p className="text-2xl" style={{ color: '#2F3C67' }}>
                  {selectedOrder.total.toLocaleString()} DH
                </p>
              </div>
              <div className="mb-6">
                <h4 className="text-sm text-[#666] mb-4">Order Progress</h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex-1 h-2 ${
                      selectedOrder.status !== 'Cancelled' ? 'bg-[#2F3C67]' : 'bg-[#E5E5E5]'
                    }`}
                  />
                  <div
                    className={`flex-1 h-2 ${
                      selectedOrder.status === 'Confirmed' || selectedOrder.status === 'Shipped'
                        ? 'bg-[#2F3C67]'
                        : 'bg-[#E5E5E5]'
                    }`}
                  />
                  <div
                    className={`flex-1 h-2 ${
                      selectedOrder.status === 'Shipped' ? 'bg-[#2F3C67]' : 'bg-[#E5E5E5]'
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[#666]">Pending</span>
                  <span className="text-xs text-[#666]">Confirmed</span>
                  <span className="text-xs text-[#666]">Shipped</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#E5E5E5] flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 border border-[#E5E5E5] text-[#666] hover:bg-[#FAFAFA] transition-colors"
              >
                Close
              </button>
              {selectedOrder.status === 'Pending' && (
                <button
                  onClick={() => handleConfirmOrder(selectedOrder.id)}
                  className="px-6 py-2 bg-[#2F3C67] text-white hover:bg-[#253352] transition-colors"
                >
                  Confirm Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
