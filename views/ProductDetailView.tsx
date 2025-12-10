import React from 'react';
import { Product } from '../types';
import { Button, Card } from '../components/UIComponents';
import { ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack, onAddToCart }) => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-5xl">
      <button 
        onClick={onBack} 
        className="flex items-center text-gold-400 hover:text-gold-300 mb-8 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="relative">
          <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden border border-luxury-700 bg-luxury-800 shadow-2xl">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -z-10 top-10 -left-10 w-full h-full border border-gold-600/20 rounded-3xl"></div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-gold-500 text-xs uppercase tracking-[0.2em]">{product.category}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-gold-100 mb-4">{product.name}</h1>
          
          <div className="flex items-end gap-4 mb-8 border-b border-luxury-800 pb-6">
            <span className="text-3xl font-serif text-gold-400">₹{product.price.toLocaleString()}</span>
            {product.stock > 0 && product.stock < 5 && (
               <span className="text-red-400 text-xs uppercase tracking-wide mb-2 animate-pulse flex items-center gap-1">
                 <AlertTriangle className="w-3 h-3" /> Low Stock: Only {product.stock} left
               </span>
            )}
          </div>

          <div className="prose prose-invert prose-gold mb-8">
            <p className="text-gray-300 leading-relaxed text-lg">
              {product.description}
            </p>
            <p className="text-gray-400 mt-4 text-sm italic">
                Each piece in our collection is authenticated and handled with the utmost care to ensure the highest standard of luxury.
            </p>
          </div>

          <div className="mt-auto space-y-6">
             <div className="flex gap-4 items-center text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-500" /> Authenticity Guaranteed
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-500" /> Premium Packaging
                </div>
             </div>

             <Button 
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full md:w-auto min-w-[200px]"
             >
                {product.stock === 0 ? 'Currently Unavailable' : <><ShoppingBag className="w-4 h-4" /> Acquire Now</>}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;