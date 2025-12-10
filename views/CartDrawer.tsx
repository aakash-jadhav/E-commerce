import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/UIComponents';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-luxury-900 border-l border-gold-600/30 h-full flex flex-col shadow-2xl animate-slide-in-right">
        <div className="p-6 border-b border-luxury-800 flex justify-between items-center">
          <h2 className="text-xl font-serif text-gold-400 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Your Selection
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gold-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="mb-4">Your collection is empty.</p>
              <Button onClick={onClose} variant="outline">Browse Catalog</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-luxury-800/50 p-4 border border-luxury-800">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-luxury-700 rounded-md" />
                <div className="flex-1">
                  <h4 className="text-gold-100 font-serif">{item.name}</h4>
                  <p className="text-gold-400 text-sm">₹{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 bg-luxury-900 border border-luxury-700 px-2 py-1 rounded">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-luxury-800 bg-luxury-900">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 uppercase tracking-wider text-sm">Total</span>
              <span className="text-2xl font-serif text-gold-400">₹{total.toLocaleString()}</span>
            </div>
            <Button onClick={onCheckout} className="w-full">
              Proceed to Acquisition
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;