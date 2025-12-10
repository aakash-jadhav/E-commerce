import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Card, Button, PageTitle } from '../components/UIComponents';
import { ShoppingBag, Plus, Filter, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface StoreViewProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  products: Product[];
  categories: Category[];
}

const StoreView: React.FC<StoreViewProps> = ({ onAddToCart, onViewProduct, products, categories }) => {
  // Default to the first category expanded
  const [expandedCategory, setExpandedCategory] = useState<string | null>(categories[0]?.name || null);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <PageTitle title="The Collection" subtitle="Curated for the Exceptional" />
      
      <div className="max-w-6xl mx-auto space-y-4">
        {categories.map(category => {
          const categoryProducts = products.filter(p => p.category === category.name);
          const isExpanded = expandedCategory === category.name;

          return (
            <div key={category.id} className="border border-luxury-800 bg-luxury-900/50 overflow-hidden rounded-lg transition-all duration-300">
              {/* Accordion Header */}
              <button 
                onClick={() => toggleCategory(category.name)}
                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isExpanded ? 'bg-luxury-800' : 'hover:bg-luxury-800/50'}`}
              >
                <div className="flex items-center gap-4">
                    <div className={`h-8 w-1 bg-gold-500 transition-all ${isExpanded ? 'h-8' : 'h-4 opacity-50'}`}></div>
                    <span className="text-xl md:text-2xl font-serif text-gold-100 uppercase tracking-widest">
                        {category.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-luxury-900 px-2 py-1 rounded-full border border-luxury-700">
                        {categoryProducts.length} Items
                    </span>
                </div>
                {isExpanded ? <ChevronUp className="text-gold-400" /> : <ChevronDown className="text-gray-500" />}
              </button>

              {/* Accordion Content */}
              <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
                {categoryProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 border-t border-luxury-800">
                        <Filter className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="font-serif italic">No masterpieces currently available in this collection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border-t border-luxury-800 bg-black/20">
                    {categoryProducts.map((product) => (
                        <Card key={product.id} className="group flex flex-col h-full !p-4 hover:border-gold-500/30">
                        <div className="relative aspect-square overflow-hidden mb-4 bg-luxury-800 rounded-2xl border border-luxury-700">
                            <img 
                            src={product.image} 
                            alt={product.name} 
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-50' : 'opacity-90 group-hover:opacity-100'}`}
                            />
                            {product.stock === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                <span className="bg-luxury-900/90 text-gold-400 border border-gold-400 px-4 py-2 font-serif uppercase tracking-widest text-xs">
                                Out of Stock
                                </span>
                            </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-serif text-gray-100 group-hover:text-gold-300 transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <div className="text-right whitespace-nowrap ml-2">
                                    <p className="text-gold-400 font-serif">₹{product.price.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            {/* Truncated Description */}
                            <p className="text-gray-400 text-xs mb-4 flex-grow leading-relaxed line-clamp-4">
                            {product.description}
                            </p>
                            
                            <div className="flex gap-2 mt-auto">
                                <button 
                                    onClick={() => onViewProduct(product)}
                                    className="flex-1 py-2 border border-luxury-600 text-gray-300 text-xs uppercase tracking-wider hover:border-gold-500 hover:text-gold-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-3 h-3" /> Read More
                                </button>
                                <Button 
                                    onClick={() => onAddToCart(product)} 
                                    className="!py-2 !px-3 !text-xs flex-1"
                                    disabled={product.stock === 0}
                                >
                                    <Plus className="w-3 h-3" /> Add
                                </Button>
                            </div>
                        </div>
                        </Card>
                    ))}
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreView;