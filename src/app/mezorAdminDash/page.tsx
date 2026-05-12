"use client";

import { useState, useEffect, useRef } from 'react';
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
  ArrowUpRight,
  Clock,
  Layers,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { ProductForm } from '../components/admin/ProductForm';

type Product = {
  _id: string;
  nom: string;
  materiau: string;
  prix: number;
  stock: number;
  categorie: string;
  imagePrincipale: string;
  description: string;
};

type Order = {
  _id: string;
  customer: string;
  items: string[];
  montantTotal: number;
  statut: 'en attente' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
  creeLe: string;
};

type User = {
  _id: string;
  nomUtilisateur: string;
  email: string;
  totalSpent: number;
  role: 'admin' | 'client';
};

type Analytics = {
  totalProducts: number;
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  salesData: any[];
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState({
    nom: '',
    materiau: '',
    prix: '',
    stock: '',
    categorie: '',
    imagePrincipale: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch('/api/admin/analytics');
        setAnalytics(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch('/api/jewelries');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Products data is not an array:', data);
          setProducts([]);
        }
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Orders data is not an array:', data);
          setOrders([]);
        }
      } else if (activeTab === 'users') {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Users data is not an array:', data);
          setUsers([]);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        nom: product.nom,
        materiau: product.materiau || '',
        prix: product.prix.toString(),
        stock: (product.stock || 0).toString(),
        categorie: product.categorie,
        imagePrincipale: product.imagePrincipale,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        nom: '',
        materiau: '',
        prix: '',
        stock: '',
        categorie: '',
        imagePrincipale: '',
        description: '',
      });
    }
    setIsProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/try-on/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secureUrl) {
        setProductForm(prev => ({ ...prev, imagePrincipale: data.secureUrl }));
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async () => {
    const payload = {
      ...productForm,
      prix: parseFloat(productForm.prix),
      stock: parseInt(productForm.stock),
    };

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/jewelries/${editingProduct._id}` : '/api/jewelries';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setIsProductModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/jewelries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, statut: 'confirmée' }),
      });
      if (res.ok) {
        toast.success('Order confirmed');
        fetchData();
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleToggleAdmin = async (id: string, isAdmin: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isAdmin }),
      });
      if (res.ok) {
        toast.success('User updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFCFB] font-sans antialiased">
      {/* Sidebar - Refined Sidebar */}
      <aside className="w-72 bg-white border-r border-[#E5E5E5] flex flex-col h-full overflow-hidden">
        <div className="p-10">
          <div className="mb-2">
            <h1 className="text-[20px] tracking-[0.2em] font-serif leading-none" style={{ color: '#2F3C67' }}>
              MEZOR
            </h1>
            <p className="text-[9px] tracking-[0.5em] text-[#853D28] mt-1 uppercase font-medium">Atelier Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Inventory', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'users', label: 'Registry', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-[#2F3C67]/5 text-[#2F3C67]'
                  : 'text-[#888] hover:bg-[#F9F9F9] hover:text-[#2F3C67]'
              }`}
            >
              <item.icon 
                size={20} 
                strokeWidth={activeTab === item.id ? 2 : 1.5} 
                className={`transition-colors ${activeTab === item.id ? 'text-[#853D28]' : 'group-hover:text-[#853D28]'}`}
              />
              <span className={`text-[11px] tracking-[0.2em] uppercase font-semibold ${activeTab === item.id ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="ml-auto w-1 h-4 bg-[#853D28] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-[#F5F5F5]">
          <div className="bg-[#DDC2A7]/10 rounded-2xl p-5 border border-[#DDC2A7]/20">
            <p className="text-[10px] tracking-widest text-[#2F3C67]/60 uppercase mb-1">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-medium text-[#2F3C67]">Fully Operational</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#FDFCFB] custom-scrollbar">
        <div className="p-12 max-w-[1600px] mx-auto">
          {/* Header */}
          <header className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[10px] tracking-[0.4em] text-[#853D28] uppercase mb-2 font-semibold">Management Console</p>
              <h2 className="text-4xl font-serif tracking-tight" style={{ color: '#2F3C67' }}>
                {activeTab === 'dashboard' ? 'Maison Overview' : 
                 activeTab === 'products' ? 'Collection Inventory' : 
                 activeTab === 'orders' ? 'Customer Requests' : 'Patron Registry'}
              </h2>
            </div>
            {activeTab === 'products' && (
              <button
                onClick={() => handleOpenProductModal()}
                className="group flex items-center gap-3 px-8 py-4 bg-[#2F3C67] text-white rounded-xl hover:bg-[#1a233d] transition-all shadow-lg shadow-[#2F3C67]/10"
              >
                <Plus size={18} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-[11px] tracking-[0.25em] uppercase font-bold">New Creation</span>
              </button>
            )}
          </header>

          {/* Bento Grid Layout - Overview */}
          {activeTab === 'dashboard' && analytics && (
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[160px]">
              {/* KPI - Revenue */}
              <div className="md:col-span-3 lg:col-span-3 bg-white border border-[#E5E5E5]/50 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-[#2F3C67]/5 text-[#2F3C67]">
                    <DollarSign size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-[10px] font-bold">
                    <ArrowUpRight size={12} />
                    +12%
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-[#888] uppercase mb-1 font-semibold">Total Revenue</p>
                  <p className="text-3xl font-serif" style={{ color: '#2F3C67' }}>
                    {(analytics.totalRevenue || 0).toLocaleString()} DH
                  </p>
                </div>
              </div>

              {/* KPI - Active Orders */}
              <div className="md:col-span-3 lg:col-span-3 bg-white border border-[#E5E5E5]/50 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-[#853D28]/5 text-[#853D28]">
                    <ShoppingCart size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-1 text-[#853D28] bg-[#853D28]/5 px-2 py-1 rounded-lg text-[10px] font-bold">
                    <Clock size={12} />
                    Active
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-[#888] uppercase mb-1 font-semibold">Active Orders</p>
                  <p className="text-3xl font-serif" style={{ color: '#2F3C67' }}>
                    {analytics.activeOrders}
                  </p>
                </div>
              </div>

              {/* Sales Chart - Large Bento Card */}
              <div className="md:col-span-6 lg:col-span-6 lg:row-span-2 bg-white border border-[#E5E5E5]/50 rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm tracking-[0.2em] font-serif uppercase" style={{ color: '#2F3C67' }}>
                    Market Performance
                  </h3>
                  <div className="flex gap-2">
                    {['W', 'M', 'Y'].map(t => (
                      <button key={t} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${t === 'M' ? 'bg-[#2F3C67] text-white' : 'hover:bg-gray-100 text-gray-400'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.salesData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2F3C67" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#2F3C67" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                      <XAxis dataKey="month" stroke="#CCC" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em' }} />
                      <YAxis stroke="#CCC" style={{ fontSize: 9, fontWeight: 600 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '11px', padding: '12px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2F3C67"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI - Total Products */}
              <div className="md:col-span-3 lg:col-span-3 bg-[#2F3C67] rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-[#2F3C67]/10">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-white/10 text-[#DDC2A7]">
                    <Layers size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="text-white">
                  <p className="text-[10px] tracking-widest text-[#DDC2A7] uppercase mb-1 font-semibold opacity-60">Inventory Size</p>
                  <p className="text-3xl font-serif">
                    {analytics.totalProducts} Pieces
                  </p>
                </div>
              </div>

              {/* KPI - Total Customers */}
              <div className="md:col-span-3 lg:col-span-3 bg-white border border-[#E5E5E5]/50 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-[#853D28]/5 text-[#853D28]">
                    <Users size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-widest text-[#888] uppercase mb-1 font-semibold">Patron Base</p>
                  <p className="text-3xl font-serif" style={{ color: '#2F3C67' }}>
                    {analytics.totalCustomers}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tables Overhaul - Products */}
          {activeTab === 'products' && (
            <div className="bg-white border border-[#E5E5E5]/40 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FBFBFB] border-b border-[#F0F0F0]">
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Piece Details</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Attributes</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Valuation</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Availability</th>
                    <th className="p-8 text-right text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Atelier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-[#FDFCFB] transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-[#F0F0F0]">
                            <img src={product.imagePrincipale} alt={product.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                            <span className="text-[14px] font-serif block mb-1" style={{ color: '#2F3C67' }}>{product.nom}</span>
                            <span className="text-[10px] tracking-widest text-[#888] uppercase font-bold">{product.categorie}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-[11px] tracking-wider text-[#666] font-medium uppercase">{product.materiau || 'N/A'}</td>
                      <td className="p-8 text-[15px] font-serif font-medium" style={{ color: '#2F3C67' }}>{(product.prix || 0).toLocaleString()} DH</td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${(product.stock || 0) > 5 ? 'bg-green-500' : 'bg-[#853D28] animate-pulse'}`} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${
                            (product.stock || 0) > 5 ? 'text-[#2F3C67]/60' : 'text-[#853D28]'
                          }`}>
                            {product.stock || 0} In Stock
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenProductModal(product)} className="p-3 rounded-xl hover:bg-[#2F3C67]/5 text-[#2F3C67] transition-all">
                            <Edit2 size={16} strokeWidth={1.5} />
                          </button>
                          {deleteConfirmId === product._id ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleDeleteProduct(product._id)} className="p-3 rounded-xl bg-[#853D28]/10 text-[#853D28] hover:bg-[#853D28]/20 transition-all">
                                <Check size={16} strokeWidth={1.5} />
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="p-3 rounded-xl hover:bg-gray-100 text-gray-400 transition-all">
                                <X size={16} strokeWidth={1.5} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(product._id)} className="p-3 rounded-xl hover:bg-[#853D28]/5 text-[#853D28] transition-all">
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tables Overhaul - Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-[#E5E5E5]/40 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FBFBFB] border-b border-[#F0F0F0]">
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Order Index</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Patron</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Date</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Investment</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Progression</th>
                    <th className="p-8 text-right text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#FDFCFB] transition-colors group">
                      <td className="p-8 text-[11px] font-mono font-bold tracking-widest" style={{ color: '#2F3C67' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-8 text-[14px] font-serif" style={{ color: '#2F3C67' }}>{order.customer}</td>
                      <td className="p-8 text-[11px] text-[#888] font-semibold tracking-wider">{new Date(order.creeLe).toLocaleDateString()}</td>
                      <td className="p-8 text-[15px] font-serif font-medium" style={{ color: '#2F3C67' }}>{(order.montantTotal || 0).toLocaleString()} DH</td>
                      <td className="p-8">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] tracking-[0.2em] font-bold uppercase transition-all ${
                          order.statut === 'en attente' ? 'bg-[#DDC2A7]/30 text-[#853D28]' :
                          order.statut === 'confirmée' ? 'bg-[#2F3C67]/5 text-[#2F3C67]' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {order.statut}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <button onClick={() => setSelectedOrder(order)} className="p-3 rounded-xl hover:bg-[#2F3C67]/5 text-[#2F3C67] transition-all">
                          <Eye size={18} strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tables Overhaul - Users */}
          {activeTab === 'users' && (
            <div className="bg-white border border-[#E5E5E5]/40 rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#FBFBFB] border-b border-[#F0F0F0]">
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Identity</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Communication</th>
                    <th className="p-8 text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Lifetime Value</th>
                    <th className="p-8 text-right text-[10px] tracking-[0.3em] font-bold text-[#888] uppercase">Privileges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-[#FDFCFB] transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#2F3C67]/5 flex items-center justify-center text-[#2F3C67] font-serif text-lg font-bold">
                            {user.nomUtilisateur[0]}
                          </div>
                          <span className="text-[14px] font-serif" style={{ color: '#2F3C67' }}>{user.nomUtilisateur}</span>
                        </div>
                      </td>
                      <td className="p-8 text-[11px] text-[#888] lowercase tracking-[0.15em] font-medium">{user.email}</td>
                      <td className="p-8 text-[15px] font-serif font-medium" style={{ color: '#2F3C67' }}>{(user.totalSpent || 0).toLocaleString()} DH</td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => handleToggleAdmin(user._id, user.role === 'client')}
                          className={`px-6 py-2.5 rounded-xl text-[9px] tracking-widest uppercase transition-all font-bold ${
                            user.role === 'admin' ? 'bg-[#2F3C67] text-white shadow-lg shadow-[#2F3C67]/20' : 'border border-[#E5E5E5] text-[#888] hover:bg-gray-50'
                          }`}
                        >
                          {user.role === 'admin' ? 'Curator' : 'Patron'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-[#2F3C67]/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <ProductForm onClose={() => setIsProductModalOpen(false)} />
        </div>
      )}

      {/* Order Detail Modal - Re-styled */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-[#2F3C67]/40 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-[#F0F0F0] flex justify-between items-center bg-[#FDFCFB]">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-[#853D28] uppercase mb-1 font-bold">Request Dossier</p>
                <h3 className="text-xl font-serif tracking-tight text-[#2F3C67]">
                  Reference #{selectedOrder._id.slice(-8).toUpperCase()}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={20} strokeWidth={1.5} className="text-[#888]" />
              </button>
            </div>
            <div className="p-10 space-y-10">
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-[#888] uppercase mb-3 font-bold">Patron</h4>
                <p className="text-xl font-serif text-[#2F3C67]">{selectedOrder.customer}</p>
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-[#888] uppercase mb-4 font-bold">Acquisitions</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 text-[13px] text-[#2F3C67] font-medium p-4 bg-[#F9F9F9] rounded-2xl border border-[#F0F0F0]/50">
                      <div className="w-2 h-2 bg-[#853D28] rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-[#2F3C67]/5 rounded-3xl border border-[#2F3C67]/5">
                <h4 className="text-[10px] tracking-[0.3em] text-[#888] uppercase mb-2 font-bold">Total Investment</h4>
                <p className="text-3xl font-serif text-[#853D28]">
                  {(selectedOrder.montantTotal || 0).toLocaleString()} DH
                </p>
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-[#888] uppercase mb-6 font-bold">Atelier Flow</h4>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-1.5 rounded-full ${selectedOrder.statut !== 'annulée' ? 'bg-[#2F3C67]' : 'bg-gray-100'}`} />
                    <div className={`flex-1 h-1.5 rounded-full ${['confirmée', 'expédiée', 'livrée'].includes(selectedOrder.statut) ? 'bg-[#2F3C67]' : 'bg-gray-100'}`} />
                    <div className={`flex-1 h-1.5 rounded-full ${['expédiée', 'livrée'].includes(selectedOrder.statut) ? 'bg-[#2F3C67]' : 'bg-gray-100'}`} />
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-[9px] tracking-widest text-[#888] uppercase font-bold">Intake</span>
                    <span className="text-[9px] tracking-widest text-[#888] uppercase font-bold">Crafting</span>
                    <span className="text-[9px] tracking-widest text-[#888] uppercase font-bold">Dispatched</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-10 border-t border-[#F0F0F0] bg-[#FDFCFB] flex justify-end gap-4">
              <button onClick={() => setSelectedOrder(null)} className="px-8 py-4 border border-[#E5E5E5] text-[#888] rounded-2xl text-[11px] tracking-widest uppercase font-bold">
                Close
              </button>
              {selectedOrder.statut === 'en attente' && (
                <button
                  onClick={() => handleConfirmOrder(selectedOrder._id)}
                  className="px-10 py-4 bg-[#2F3C67] text-white rounded-2xl text-[11px] tracking-widest uppercase shadow-xl shadow-[#2F3C67]/20 font-bold"
                >
                  Approve Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
