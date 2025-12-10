import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '../types';
import { Card, Button, Input, PageTitle } from '../components/UIComponents';
import { CreditCard, Banknote, ArrowLeft, ShieldCheck } from 'lucide-react';

interface CheckoutViewProps {
  cart: CartItem[];
  total: number;
  onBack: () => void;
  onPlaceOrder: (details: any) => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, total, onBack, onPlaceOrder }) => {
  const [method, setMethod] = useState<PaymentMethod>('ONLINE');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
        onPlaceOrder({ ...formData, method });
        setIsProcessing(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <button 
        onClick={onBack} 
        className="flex items-center text-gold-400 hover:text-gold-300 mb-8 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Cart
      </button>

      <PageTitle title="Acquisition Details" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <Card>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-serif text-gold-200 mb-6">Contact & Delivery</h3>
              
              <Input 
                label="Full Name" 
                name="name" 
                required 
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              <Input 
                label="Phone Number" 
                name="phone" 
                type="tel" 
                required 
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Required for coordination"
              />
              <Input 
                label="Delivery Address" 
                name="address" 
                required 
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, Suite, City"
              />

              <div className="mt-8">
                <h3 className="text-xl font-serif text-gold-200 mb-6">Payment Preference</h3>
                
                <div className="space-y-4">
                  <div 
                    onClick={() => setMethod('ONLINE')}
                    className={`cursor-pointer p-4 border transition-all duration-300 flex items-center gap-4 ${method === 'ONLINE' ? 'bg-gold-500/10 border-gold-400' : 'bg-luxury-800 border-luxury-700 hover:border-gold-600/50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'ONLINE' ? 'border-gold-400' : 'border-gray-500'}`}>
                      {method === 'ONLINE' && <div className="w-2.5 h-2.5 rounded-full bg-gold-400"></div>}
                    </div>
                    <CreditCard className="text-gold-300 w-6 h-6" />
                    <div>
                      <p className="text-gold-100 font-medium">Digital Payment</p>
                      <p className="text-xs text-gray-400">Secure Gateway Redirect</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setMethod('COD')}
                    className={`cursor-pointer p-4 border transition-all duration-300 flex items-center gap-4 ${method === 'COD' ? 'bg-gold-500/10 border-gold-400' : 'bg-luxury-800 border-luxury-700 hover:border-gold-600/50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'COD' ? 'border-gold-400' : 'border-gray-500'}`}>
                      {method === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-gold-400"></div>}
                    </div>
                    <Banknote className="text-gold-300 w-6 h-6" />
                    <div>
                      <p className="text-gold-100 font-medium">Cash on Delivery</p>
                      <p className="text-xs text-gray-400">Pay upon receipt</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>

        {/* Right: Summary */}
        <div>
          <Card className="sticky top-24">
            <h3 className="text-xl font-serif text-gold-200 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-gold-500 font-bold">{item.quantity}x</span>
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-gold-200">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-luxury-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-gold-400">Complimentary</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-gold-400 pt-4 border-t border-luxury-700 mt-4">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              form="checkout-form"
              type="submit" 
              className="w-full mt-8"
              isLoading={isProcessing}
            >
              {method === 'ONLINE' ? 'Proceed to Payment Gateway' : 'Confirm Order'}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Encrypted Transaction</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;