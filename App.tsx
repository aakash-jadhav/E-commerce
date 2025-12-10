import React, { useState } from 'react';
import { AppView, CartItem, Order, Product, Category } from './types';
import { MOCK_PRODUCTS, SERVICEABLE_PINCODES, INITIAL_CATEGORIES } from './constants';
import PincodeView from './views/PincodeView';
import StoreView from './views/StoreView';
import ProductDetailView from './views/ProductDetailView';
import CartDrawer from './views/CartDrawer';
import CheckoutView from './views/CheckoutView';
import { AdminLogin, AdminDashboard } from './views/AdminView';
import { ShoppingBag, Lock, LogOut } from 'lucide-react';

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-7829-XJ",
    customerName: "Vikram Rathore",
    phone: "9876543210",
    address: "Villa 45, Koregaon Park, Pune",
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 1 },
      { ...MOCK_PRODUCTS[6], quantity: 2 }
    ],
    totalAmount: 18900,
    paymentMethod: 'ONLINE',
    status: 'Pending',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  },
  {
    id: "ORD-9921-MC",
    customerName: "Ananya Desai",
    phone: "9988776655",
    address: "Flat 1202, The Royal Gardens, Kolhapur",
    items: [
       { ...MOCK_PRODUCTS[3], quantity: 1 }
    ],
    totalAmount: 2100,
    paymentMethod: 'COD',
    status: 'Confirmed',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
   {
    id: "ORD-1122-PL",
    customerName: "Rohan Kulkarni",
    phone: "9123456789",
    address: "Plot 88, Viman Nagar, Pune",
    items: [
       { ...MOCK_PRODUCTS[7], quantity: 1 },
       { ...MOCK_PRODUCTS[1], quantity: 1 }
    ],
    totalAmount: 8600,
    paymentMethod: 'ONLINE',
    status: 'Delivered',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
    {
    id: "ORD-3344-GQ",
    customerName: "Priya Sharma",
    phone: "9000011111",
    address: "Penthouse 1, Baner, Pune",
    items: [
       { ...MOCK_PRODUCTS[12], quantity: 1 }
    ],
    totalAmount: 15000,
    paymentMethod: 'COD',
    status: 'Delivered',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
  },
  {
    id: "ORD-5566-AB",
    customerName: "Siddharth Malhotra",
    phone: "9822098220",
    address: "Bungalow 7, Kalyani Nagar, Pune",
    items: [
       { ...MOCK_PRODUCTS[2], quantity: 1 },
       { ...MOCK_PRODUCTS[5], quantity: 1 }
    ],
    totalAmount: 15600,
    paymentMethod: 'ONLINE',
    status: 'Pending',
    date: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.PINCODE_GATE);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [pincodes, setPincodes] = useState<string[]>(SERVICEABLE_PINCODES);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Navigation Handlers
  const handlePincodeSuccess = () => setCurrentView(AppView.STORE);
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(AppView.PRODUCT_DETAIL);
  };
  
  // Cart Logic
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (delta > 0 && newQty > product.stock) return item;
        return { ...item, quantity: Math.max(0, newQty) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Order Logic
  const handlePlaceOrder = (details: any) => {
    const newOrder: Order = {
      id: "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: details.name,
      phone: details.phone,
      address: details.address,
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod: details.method,
      status: 'Pending',
      date: new Date().toISOString()
    };

    setProducts(prevProducts => prevProducts.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
    }));

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCurrentView(AppView.ORDER_SUCCESS);
  };

  const handleOrderStatusUpdate = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Admin Product Management
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { ...newProduct, id }]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Admin Category Management
  const handleAddCategory = (name: string) => {
    const newId = (Math.max(...categories.map(c => parseInt(c.id)), 0) + 1).toString();
    setCategories([...categories, { id: newId, name }]);
  };

  const handleUpdateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    const oldCat = categories.find(c => c.id === id);
    if (oldCat) {
       setProducts(prev => prev.map(p => p.category === oldCat.name ? { ...p, category: name } : p));
    }
  };

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    const hasProducts = products.some(p => p.category === categoryToDelete.name);
    if (hasProducts) {
      alert(`Cannot delete category "${categoryToDelete.name}". It still contains products. Please reassign or delete them first.`);
      return;
    }

    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Admin Pincode Management
  const handleAddPincode = (code: string) => {
    if (!pincodes.includes(code)) {
        setPincodes([...pincodes, code]);
    }
  };

  const handleRemovePincode = (code: string) => {
    setPincodes(prev => prev.filter(p => p !== code));
  };

  // Render Views
  const renderView = () => {
    switch (currentView) {
      case AppView.PINCODE_GATE:
        return <PincodeView onSuccess={handlePincodeSuccess} allowedPincodes={pincodes} />;
      
      case AppView.STORE:
        return <StoreView onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} products={products} categories={categories} />;
      
      case AppView.PRODUCT_DETAIL:
        if (!selectedProduct) return <StoreView onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} products={products} categories={categories} />;
        return <ProductDetailView product={selectedProduct} onBack={() => setCurrentView(AppView.STORE)} onAddToCart={handleAddToCart} />;

      case AppView.CHECKOUT:
        return (
          <CheckoutView 
            cart={cart}
            total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
            onBack={() => setCurrentView(AppView.STORE)}
            onPlaceOrder={handlePlaceOrder}
          />
        );

      case AppView.ORDER_SUCCESS:
        return (
          <div className="min-h-screen flex items-center justify-center p-4 text-center animate-fade-in">
            <div className="max-w-md w-full bg-luxury-900 border border-gold-500/30 p-12">
              <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-6 text-gold-400 border border-gold-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif text-gold-300 mb-4">Acquisition Complete</h2>
              <p className="text-gray-400 mb-8">Thank you for choosing Aurum Luxe. A concierge will contact you shortly to confirm delivery.</p>
              <button 
                onClick={() => setCurrentView(AppView.STORE)}
                className="text-gold-400 border-b border-gold-400 pb-1 text-sm uppercase tracking-widest hover:text-gold-200 hover:border-gold-200 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        );

      case AppView.ADMIN_LOGIN:
        return <AdminLogin onLogin={() => setCurrentView(AppView.ADMIN_DASHBOARD)} onCancel={() => setCurrentView(AppView.PINCODE_GATE)} />;

      case AppView.ADMIN_DASHBOARD:
        return (
            <AdminDashboard 
                orders={orders} 
                products={products}
                categories={categories}
                pincodes={pincodes}
                onUpdateOrderStatus={handleOrderStatusUpdate} 
                onLogout={() => setCurrentView(AppView.PINCODE_GATE)} 
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddPincode={handleAddPincode}
                onRemovePincode={handleRemovePincode}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        );
        
      default:
        return <div>Unknown View</div>;
    }
  };

  // Global UI Wrappers (Header/Footer)
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-gold-500/30 selection:text-gold-100 flex flex-col">
      {/* Header - Only show if not on Pincode or Admin Login */}
      {currentView !== AppView.PINCODE_GATE && currentView !== AppView.ADMIN_LOGIN && (
        <header className="sticky top-0 z-40 bg-luxury-900/90 backdrop-blur-md border-b border-luxury-800">
          <div className="container mx-auto px-4 h-20 flex justify-between items-center">
            <div 
              className="text-2xl font-serif text-gold-400 tracking-tighter cursor-pointer"
              onClick={() => currentView !== AppView.ADMIN_DASHBOARD && setCurrentView(AppView.STORE)}
            >
              AURUM
            </div>
            
            {/* Header Right Action */}
            {currentView === AppView.ADMIN_DASHBOARD ? (
              <button 
                onClick={() => setCurrentView(AppView.PINCODE_GATE)}
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-900/50 rounded hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              (currentView === AppView.STORE || currentView === AppView.PRODUCT_DETAIL) && (
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gold-200 hover:text-gold-400 transition-colors"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-900 text-red-200 text-[10px] flex items-center justify-center rounded-full border border-red-800">
                      {cart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-luxury-900 border-t border-luxury-800 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-luxury-700 text-xs tracking-widest uppercase mb-4">&copy; 2024 Aurum Luxe. Exclusive Access Only.</p>
          {currentView === AppView.PINCODE_GATE && (
            <button 
              onClick={() => setCurrentView(AppView.ADMIN_LOGIN)}
              className="text-luxury-800 hover:text-luxury-600 text-xs flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <Lock className="w-3 h-3" /> Admin Portal
            </button>
          )}
        </div>
      </footer>

      {/* Cart Drawer Overlay */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentView(AppView.CHECKOUT);
        }}
      />
    </div>
  );
};

export default App;