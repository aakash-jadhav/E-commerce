import React, { useState } from 'react';
import { Order, Product, Category } from '../types';
import { Card, Button, Input, FileUploader, Modal, AlertModal } from '../components/UIComponents';
import { 
  Package, Phone, User, CheckCircle, Truck, LogOut, 
  Trash2, MapPin, Plus, Edit2, X, Layers, 
  LayoutDashboard, ShoppingBag, ArrowLeft, Copy, Check,
  ChevronDown, ChevronUp, Users, Clock, Receipt, Banknote
} from 'lucide-react';

interface AdminViewProps {
  orders: Order[];
  products: Product[];
  categories: Category[];
  pincodes: string[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onLogout: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddPincode: (code: string) => void;
  onRemovePincode: (code: string) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminLogin: React.FC<{ onLogin: () => void; onCancel: () => void }> = ({ onLogin, onCancel }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin') {
      onLogin();
    } else {
      setError('Invalid Access Key');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-serif text-center text-gold-400 mb-6">Administrative Access</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="password" 
            placeholder="Enter Access Key" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div className="flex gap-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="flex-1">Authenticate</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

type Tab = 'OVERVIEW' | 'ORDERS' | 'CUSTOMERS' | 'INVENTORY' | 'CATEGORIES' | 'LOCATIONS';

export const AdminDashboard: React.FC<AdminViewProps> = ({ 
  orders, products, categories, pincodes, 
  onUpdateOrderStatus, onLogout, 
  onAddProduct, onUpdateProduct, onDeleteProduct,
  onAddPincode, onRemovePincode,
  onAddCategory, onUpdateCategory, onDeleteCategory
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal States
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; desc: string; onConfirm: () => void }>({ isOpen: false, title: '', desc: '', onConfirm: () => {} });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string }>({ isOpen: false, title: '', message: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inventory State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', stock: '', image: '' });
  
  // Category State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Location State
  const [selectedRegion, setSelectedRegion] = useState<'Pune' | 'Kolhapur' | null>(null);
  const [newPincode, setNewPincode] = useState('');

  // --- Handlers ---

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setToastMessage('Phone number copied to clipboard');
    setTimeout(() => {
        setCopiedId(null);
        setToastMessage(null);
    }, 2000);
  };

  const handleProductDeleteRequest = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      desc: 'Are you sure you want to delete this product? This action cannot be undone.',
      onConfirm: () => onDeleteProduct(id)
    });
  };

  const handleCategoryDeleteRequest = (id: string, name: string) => {
    const productCount = products.filter(p => p.category === name).length;
    
    if (productCount > 0) {
      setAlertModal({
        isOpen: true,
        title: 'Action Restricted',
        message: `Cannot delete category "${name}" because it currently contains ${productCount} product(s). Please reassign or delete the products first.`
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      desc: `Are you sure you want to delete the category "${name}"?`,
      onConfirm: () => onDeleteCategory(id)
    });
  };

  const handlePincodeDeleteRequest = (code: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Location',
      desc: `Are you sure you want to stop serving pincode ${code}?`,
      onConfirm: () => onRemovePincode(code)
    });
  };

  // Inventory Form Handler
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      stock: Number(newProduct.stock),
      image: newProduct.image || `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`
    };

    if (editingId !== null) {
      onUpdateProduct({ ...productData, id: editingId });
    } else {
      onAddProduct(productData);
    }
    
    setIsAddingProduct(false);
    setEditingId(null);
    setNewProduct({ name: '', price: '', category: '', description: '', stock: '', image: '' });
  };

  const startAddProduct = () => {
    setNewProduct({ name: '', price: '', category: categories[0]?.name || '', description: '', stock: '', image: '' });
    setEditingId(null);
    setIsAddingProduct(true);
  };

  const startEditProduct = (product: Product) => {
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      stock: product.stock.toString(),
      image: product.image
    });
    setEditingId(product.id);
    setIsAddingProduct(true);
  };

  const cancelEdit = () => {
    setIsAddingProduct(false);
    setEditingId(null);
    setNewProduct({ name: '', price: '', category: '', description: '', stock: '', image: '' });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (editingCategoryId) {
      onUpdateCategory(editingCategoryId, newCategoryName);
      setEditingCategoryId(null);
    } else {
      onAddCategory(newCategoryName);
    }
    setNewCategoryName('');
  };

  const handleMarkAsClosed = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'Delivered'); // Map "Closed" to Delivered
  };

  // --- Render Helpers ---

  // Unique Customers calculation
  const uniqueCustomers = Array.from(new Set(orders.map(o => o.phone))).map(phone => {
    const customerOrders = orders.filter(o => o.phone === phone);
    const lastOrder = customerOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const firstOrder = customerOrders[0];
    return {
      ...firstOrder,
      lastOrderDate: lastOrder.date,
      orderCount: customerOrders.length
    };
  }).filter(Boolean).sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Derived Orders
  const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed');
  // In this requirement, Closed/Cancelled are considered "Recent"
  const recentOrders = orders.filter(o => o.status === 'Delivered');

  // Reusable Components for this View
  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
        status === 'Delivered' ? 'bg-green-900/20 text-green-400 border-green-900/30' : 'bg-gold-500/10 text-gold-400 border-gold-500/30'
    }`}>
        {status === 'Delivered' ? 'Closed' : status}
    </span>
  );

  const OrderListItem = ({ order, onClick }: { order: Order, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="p-4 hover:bg-luxury-800 border-b border-luxury-800 last:border-0 cursor-pointer transition-colors flex flex-col gap-3"
    >
        {/* Row 1: Order # | Status */}
        <div className="flex justify-between items-start">
            <span className="font-serif text-gold-200 text-sm">#{order.id.slice(-6)}</span>
            <StatusBadge status={order.status} />
        </div>

        {/* Row 2: Customer Name */}
        <div className="text-sm text-gray-200 font-medium leading-none">
             {order.customerName}
        </div>

        {/* Row 3: Phone | Copy Icon */}
        <div className="flex justify-between items-center">
             <span className="text-xs text-gray-400">{order.phone}</span>
             <button 
                onClick={(e) => { e.stopPropagation(); handleCopyPhone(order.phone, order.id); }}
                className="text-gray-500 hover:text-gold-400 transition-colors p-1"
             >
                {copiedId === order.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
             </button>
        </div>

        {/* Row 4: Date | Price */}
        <div className="flex justify-between items-end border-t border-luxury-800/50 pt-2 mt-1">
             <span className="text-[10px] text-gray-500">{new Date(order.date).toLocaleString()}</span>
             <span className="font-serif text-gold-400 text-sm">₹{order.totalAmount.toLocaleString()}</span>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in pb-20 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-[100] bg-gold-500 text-luxury-900 px-6 py-3 rounded shadow-xl animate-fade-in flex items-center gap-2 font-bold tracking-wide">
           <CheckCircle className="w-5 h-5" />
           {toastMessage}
        </div>
      )}

      {/* Global Modals */}
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({...confirmModal, isOpen: false})} 
        title={confirmModal.title} 
        description={confirmModal.desc} 
        onConfirm={confirmModal.onConfirm} 
        isDestructive={true}
      />
      <AlertModal 
        isOpen={alertModal.isOpen} 
        onClose={() => setAlertModal({...alertModal, isOpen: false})} 
        title={alertModal.title} 
        message={alertModal.message} 
      />

      {/* Header & Navigation */}
      <div className="flex flex-col mb-8 border-b border-luxury-800 pb-4 gap-6">
        
        {/* Responsive Grid Navigation */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'OVERVIEW', icon: LayoutDashboard, label: 'Overview' },
              { id: 'ORDERS', icon: ShoppingBag, label: 'Orders' },
              { id: 'CUSTOMERS', icon: Users, label: 'Customers' },
              { id: 'INVENTORY', icon: Package, label: 'Inventory' },
              { id: 'CATEGORIES', icon: Layers, label: 'Categories' },
              { id: 'LOCATIONS', icon: MapPin, label: 'Locations' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setSelectedOrderId(null); }}
                className={`flex flex-col items-center justify-center gap-2 p-3 text-xs uppercase tracking-widest transition-colors rounded border ${
                  activeTab === tab.id 
                    ? 'bg-gold-500 text-luxury-900 font-bold border-gold-400' 
                    : 'bg-luxury-900 border-luxury-700 text-gray-400 hover:text-gold-200 hover:border-gold-500/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center justify-center py-8">
              <div className="p-3 bg-gold-500/10 rounded-full mb-3 text-gold-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-3xl font-serif text-gold-100 mb-1">{orders.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Total Orders</p>
            </Card>

            <Card className="flex flex-col items-center justify-center py-8">
              <div className="p-3 bg-green-500/10 rounded-full mb-3 text-green-400">
                <span className="w-8 h-8 flex items-center justify-center font-serif text-xl">₹</span>
              </div>
              <p className="text-3xl font-serif text-gold-100 mb-1">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Total Revenue</p>
            </Card>

            <Card className="flex flex-col items-center justify-center py-8">
              <div className="p-3 bg-blue-500/10 rounded-full mb-3 text-blue-400">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-3xl font-serif text-gold-100 mb-1">{uniqueCustomers.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Customers</p>
            </Card>
          </div>
        </div>
      )}

      {/* --- CUSTOMERS TAB --- */}
      {activeTab === 'CUSTOMERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueCustomers.map(customer => (
                <Card key={customer.id} className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-luxury-800 flex items-center justify-center text-gold-400 border border-luxury-700">
                            <User className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-gray-500 bg-luxury-800 px-2 py-1 rounded border border-luxury-700">
                            {customer.orderCount} Orders
                        </span>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-serif text-gold-100">{customer.customerName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gold-400">{customer.phone}</p>
                            <button 
                                onClick={() => handleCopyPhone(customer.phone, customer.id)}
                                className="text-gray-500 hover:text-white transition-colors"
                                title="Copy Phone Number"
                            >
                                {copiedId === customer.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-luxury-700 pt-3 mt-auto">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Delivery Address</p>
                        <p className="text-sm text-gray-300 line-clamp-2">{customer.address}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>Last Ordered: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                </Card>
            ))}
            {uniqueCustomers.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">No customer data available.</div>
            )}
        </div>
      )}

      {/* --- ORDERS TAB --- */}
      {activeTab === 'ORDERS' && (
        <div className="max-w-4xl mx-auto">
            {selectedOrderId ? (
                // ORDER DETAILS VIEW
                (() => {
                    const order = orders.find(o => o.id === selectedOrderId);
                    if (!order) return null;
                    return (
                        <div className="animate-fade-in-up h-full flex flex-col">
                            <button 
                                onClick={() => setSelectedOrderId(null)}
                                className="flex items-center text-gold-400 hover:text-gold-200 mb-4 text-xs uppercase tracking-widest"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                            </button>

                            <Card className="border-gold-500/30 flex flex-col flex-grow !p-4 gap-4 overflow-hidden">
                                {/* Header */}
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-serif text-gold-100">Order Details</h2>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Row 1: Date | Order # */}
                                <div className="flex justify-between items-center text-xs text-gray-500 border-b border-luxury-800 pb-3">
                                    <span>{new Date(order.date).toLocaleString()}</span>
                                    <span>#{order.id}</span>
                                </div>

                                {/* Row 2: Customer Name */}
                                <div className="text-sm font-medium text-gold-200">
                                    {order.customerName}
                                </div>

                                {/* Row 3: Contact | Copy */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-300">{order.phone}</span>
                                    <button 
                                        onClick={() => handleCopyPhone(order.phone, 'detail-view')}
                                        className="p-2 bg-luxury-800 rounded border border-luxury-700 text-gold-400 hover:bg-luxury-700"
                                    >
                                        {copiedId === 'detail-view' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                {/* Address Box */}
                                <div className="bg-luxury-800/50 p-3 rounded border border-luxury-700">
                                    <p className="text-xs text-gray-400 uppercase mb-1">Delivery Address</p>
                                    <p className="text-xs text-gray-200 leading-relaxed">{order.address}</p>
                                </div>

                                {/* Order Contents Table - Scrollable */}
                                <div className="flex-1 overflow-y-auto min-h-0 border border-luxury-800 rounded bg-luxury-900/50 custom-scrollbar">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-luxury-800 z-10 text-gray-400">
                                            <tr>
                                                <th className="p-3 font-normal">Item</th>
                                                <th className="p-3 font-normal text-center">Qty</th>
                                                <th className="p-3 font-normal text-right">Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, idx) => (
                                                <tr key={idx} className="border-b border-luxury-800/50 last:border-0">
                                                    <td className="p-3 text-gray-300">{item.name}</td>
                                                    <td className="p-3 text-center text-gold-500">{item.quantity}</td>
                                                    <td className="p-3 text-right text-gray-400">₹{(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer: Method | Total */}
                                <div className="flex justify-between items-center pt-3 border-t border-luxury-800 mt-auto">
                                    <div className="px-3 py-1 rounded-full bg-luxury-800 border border-luxury-700 text-[10px] text-gold-300 uppercase tracking-wider flex items-center gap-1">
                                        {order.paymentMethod === 'COD' ? <Banknote className="w-3 h-3" /> : <Receipt className="w-3 h-3" />}
                                        {order.paymentMethod === 'COD' ? 'Cash' : 'Online'}
                                    </div>
                                    <div className="text-xl font-serif text-gold-400">
                                        ₹{order.totalAmount.toLocaleString()}
                                    </div>
                                </div>

                                {/* Actions */}
                                {order.status !== 'Delivered' && (
                                    <Button 
                                        onClick={() => {
                                            handleMarkAsClosed(order.id);
                                            setSelectedOrderId(null); 
                                        }} 
                                        className="w-full !py-3 !text-xs mt-2"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Mark as Closed
                                    </Button>
                                )}
                            </Card>
                        </div>
                    );
                })()
            ) : (
                // ACCORDION LIST VIEW
                <div className="space-y-4">
                    {/* Active Orders Accordion */}
                    <details className="group" open>
                        <summary className="flex items-center justify-between cursor-pointer p-4 bg-luxury-800 border border-luxury-700 rounded-lg group-open:rounded-b-none transition-all hover:bg-luxury-700">
                            <span className="font-serif text-lg text-gold-100 flex items-center gap-3">
                                    Active Orders 
                                    <span className="text-xs bg-gold-500 text-luxury-900 px-2 py-0.5 rounded-full font-sans font-bold">{activeOrders.length}</span>
                            </span>
                            <ChevronDown className="w-5 h-5 text-gold-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="bg-luxury-900 border border-t-0 border-luxury-700 rounded-b-lg">
                            {activeOrders.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 italic text-sm">No active orders pending.</div>
                            ) : activeOrders.map(order => (
                                <OrderListItem key={order.id} order={order} onClick={() => setSelectedOrderId(order.id)} />
                            ))}
                        </div>
                    </details>

                    {/* Recent Orders Accordion */}
                    <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer p-4 bg-luxury-800 border border-luxury-700 rounded-lg group-open:rounded-b-none transition-all hover:bg-luxury-700">
                            <span className="font-serif text-lg text-gray-300 flex items-center gap-3">
                                    Recent Orders
                                    <span className="text-xs bg-luxury-900 text-gray-400 px-2 py-0.5 rounded-full font-sans font-bold border border-luxury-700">{recentOrders.length}</span>
                            </span>
                            <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div className="bg-luxury-900 border border-t-0 border-luxury-700 rounded-b-lg">
                            {recentOrders.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 italic text-sm">No order history available.</div>
                            ) : recentOrders.map(order => (
                                <OrderListItem key={order.id} order={order} onClick={() => setSelectedOrderId(order.id)} />
                            ))}
                        </div>
                    </details>
                </div>
            )}
        </div>
      )}

      {/* --- INVENTORY TAB --- */}
      {activeTab === 'INVENTORY' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-gold-200">Product Management</h3>
                <Button onClick={startAddProduct} className="!text-xs">
                    <Plus className="w-4 h-4 mr-2" /> Add New Item
                </Button>
            </div>

            {/* Add/Edit Product Form */}
            {isAddingProduct && (
                <Card className="mb-8 border-gold-500/50">
                    <h4 className="text-gold-400 mb-4 font-serif">
                      {editingId ? 'Edit Product Details' : 'New Product Entry'}
                    </h4>
                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <FileUploader 
                                label="Product Image"
                                onFileSelect={(base64) => setNewProduct({...newProduct, image: base64})}
                                currentImage={newProduct.image}
                            />
                        </div>

                        <Input label="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                        
                        <div className="w-full">
                           <label className="block text-xs uppercase tracking-widest text-gold-400 mb-2 font-serif">Category</label>
                           <select 
                              className="w-full bg-luxury-800 border border-luxury-700 text-gold-100 px-4 py-3 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                              value={newProduct.category}
                              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                              required
                           >
                             <option value="" disabled>Select a Category</option>
                             {categories.map(cat => (
                               <option key={cat.id} value={cat.name}>{cat.name}</option>
                             ))}
                           </select>
                        </div>

                        <Input label="Price (INR)" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                        <Input label="Stock Level" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                        
                        <div className="md:col-span-2">
                            <Input label="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2 flex gap-4 mt-4">
                            <Button type="button" variant="secondary" onClick={cancelEdit} className="flex-1">Cancel</Button>
                            <Button type="submit" className="flex-1">
                              {editingId ? 'Save Changes' : 'Add to Catalog'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Product List */}
            <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                    <div key={product.id} className="bg-luxury-900 border border-luxury-800 p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-gold-600/30 transition-all">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover border border-luxury-700 rounded-lg" />
                        
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-gold-100 font-serif text-lg">{product.name}</h4>
                            <p className="text-xs text-gold-500 uppercase tracking-wider">{product.category}</p>
                            <p className="text-gray-400 text-sm mt-1 truncate max-w-md">{product.description}</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <label className="text-xs text-gray-500 block mb-1">Price</label>
                                <span className="text-gold-300 font-serif">₹{product.price.toLocaleString()}</span>
                            </div>

                            <div className="text-center">
                                <label className="text-xs text-gray-500 block mb-1">Stock</label>
                                <div className="flex items-center bg-luxury-800 rounded border border-luxury-700">
                                    <button 
                                        className="px-2 hover:bg-gold-500 hover:text-luxury-900"
                                        onClick={() => onUpdateProduct({...product, stock: Math.max(0, product.stock - 1)})}
                                    >-</button>
                                    <span className="w-8 text-center text-sm">{product.stock}</span>
                                    <button 
                                        className="px-2 hover:bg-gold-500 hover:text-luxury-900"
                                        onClick={() => onUpdateProduct({...product, stock: product.stock + 1})}
                                    >+</button>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => startEditProduct(product)}
                                    className="p-2 text-gold-400 hover:text-luxury-900 hover:bg-gold-400/80 rounded transition-colors"
                                    title="Edit Product"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>

                                <button 
                                    onClick={() => handleProductDeleteRequest(product.id)}
                                    className="p-2 text-red-900 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                    title="Remove Product"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* --- CATEGORIES TAB --- */}
      {activeTab === 'CATEGORIES' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex items-center gap-3 mb-6 border-b border-luxury-800 pb-4">
              <Layers className="text-gold-400 w-6 h-6" />
              <div>
                <h3 className="text-xl font-serif text-gold-200">Category Management</h3>
                <p className="text-xs text-gray-400">Organize your catalog collections</p>
              </div>
            </div>

            <form onSubmit={handleCategorySubmit} className="flex gap-4 mb-8">
              <Input 
                placeholder="Category Name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button type="submit" disabled={!newCategoryName.trim()}>
                {editingCategoryId ? 'Update' : 'Create'}
              </Button>
              {editingCategoryId && (
                <Button type="button" variant="secondary" onClick={() => { setEditingCategoryId(null); setNewCategoryName(''); }}>
                  Cancel
                </Button>
              )}
            </form>

            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-luxury-800 border border-luxury-700 p-4 flex justify-between items-center group hover:border-gold-500/50">
                  <span className="text-gold-100 font-serif">{cat.name}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingCategoryId(cat.id); setNewCategoryName(cat.name); }}
                      className="p-2 text-gray-400 hover:text-gold-400 hover:bg-luxury-900 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleCategoryDeleteRequest(cat.id, cat.name)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* --- LOCATIONS TAB --- */}
      {activeTab === 'LOCATIONS' && (
        <div className="max-w-4xl mx-auto">
            {!selectedRegion ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div 
                  onClick={() => setSelectedRegion('Kolhapur')}
                  className="bg-luxury-900 border border-luxury-700 aspect-square md:aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 hover:bg-luxury-800 transition-all group"
                >
                  <MapPin className="w-16 h-16 text-gray-600 group-hover:text-gold-400 mb-6 transition-colors" />
                  <h2 className="text-3xl md:text-4xl font-serif text-gray-300 group-hover:text-gold-100 tracking-wider">KOLHAPUR</h2>
                  <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest group-hover:text-gold-500/70">416xxx Region</p>
                </div>

                <div 
                  onClick={() => setSelectedRegion('Pune')}
                  className="bg-luxury-900 border border-luxury-700 aspect-square md:aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 hover:bg-luxury-800 transition-all group"
                >
                  <MapPin className="w-16 h-16 text-gray-600 group-hover:text-gold-400 mb-6 transition-colors" />
                  <h2 className="text-3xl md:text-4xl font-serif text-gray-300 group-hover:text-gold-100 tracking-wider">PUNE</h2>
                  <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest group-hover:text-gold-500/70">411xxx Region</p>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <button 
                  onClick={() => setSelectedRegion(null)} 
                  className="mb-6 flex items-center text-gold-400 hover:text-gold-300 text-sm uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Regions
                </button>

                <Card>
                  <div className="flex items-center gap-3 mb-6 border-b border-luxury-800 pb-4">
                      <MapPin className="text-gold-400 w-8 h-8" />
                      <div>
                          <h3 className="text-3xl font-serif text-gold-100 uppercase">{selectedRegion}</h3>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">
                            {selectedRegion === 'Pune' ? '411xxx Series' : '416xxx Series'}
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4 mb-8">
                      <Input 
                          placeholder={`Enter ${selectedRegion} Pincode (e.g., ${selectedRegion === 'Pune' ? '411001' : '416001'})`} 
                          value={newPincode} 
                          onChange={(e) => setNewPincode(e.target.value)} 
                          maxLength={6}
                      />
                      <Button onClick={() => {
                          if (newPincode.length === 6) {
                            // Basic region validation
                            if (selectedRegion === 'Pune' && !newPincode.startsWith('411')) {
                              setAlertModal({ isOpen: true, title: 'Invalid Region', message: 'Pune pincodes typically start with 411.' });
                              return;
                            }
                            if (selectedRegion === 'Kolhapur' && !newPincode.startsWith('416')) {
                              setAlertModal({ isOpen: true, title: 'Invalid Region', message: 'Kolhapur pincodes typically start with 416.' });
                              return;
                            }

                            onAddPincode(newPincode);
                            setNewPincode('');
                          }
                      }} disabled={newPincode.length !== 6}>
                          Add Pincode
                      </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pincodes
                        .filter(code => selectedRegion === 'Pune' ? code.startsWith('411') : code.startsWith('416'))
                        .map(code => (
                          <div key={code} className="bg-luxury-800 border border-luxury-700 p-3 flex justify-between items-center group hover:border-gold-500/50">
                              <span className="text-gold-100 tracking-widest font-mono">{code}</span>
                              <button 
                                  onClick={() => handlePincodeDeleteRequest(code)}
                                  className="text-gray-500 hover:text-red-400 transition-colors"
                              >
                                  <X className="w-4 h-4" />
                              </button>
                          </div>
                      ))}
                      {pincodes.filter(code => selectedRegion === 'Pune' ? code.startsWith('411') : code.startsWith('416')).length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-4 italic">
                          No serviceable areas defined for this region yet.
                        </div>
                      )}
                  </div>
                </Card>
              </div>
            )}
        </div>
      )}
    </div>
  );
};