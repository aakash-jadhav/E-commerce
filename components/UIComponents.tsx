import React, { ReactNode, useRef } from 'react';
import { Loader2, Upload, X, AlertTriangle, Check } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyle = "px-6 py-3 font-serif uppercase tracking-widest text-sm transition-all duration-300 ease-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-gold-400 to-gold-600 text-luxury-900 hover:from-gold-300 hover:to-gold-500 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold border border-transparent",
    secondary: "bg-luxury-800 text-gold-200 border border-luxury-700 hover:border-gold-500 hover:text-gold-400",
    outline: "bg-transparent border border-gold-500 text-gold-400 hover:bg-gold-400 hover:text-luxury-900",
    danger: "bg-red-900/20 border border-red-800 text-red-400 hover:bg-red-900/40"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs uppercase tracking-widest text-gold-400 mb-2 font-serif">{label}</label>}
    <input 
      className={`w-full bg-luxury-800 border border-luxury-700 text-gold-100 px-4 py-3 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors placeholder-luxury-700 ${className}`}
      {...props} 
    />
  </div>
);

export const FileUploader: React.FC<{ 
  label?: string; 
  onFileSelect: (base64: string) => void;
  currentImage?: string;
}> = ({ label, onFileSelect, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs uppercase tracking-widest text-gold-400 mb-2 font-serif">{label}</label>}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-luxury-800 border border-dashed border-luxury-600 hover:border-gold-400 cursor-pointer p-4 flex flex-col items-center justify-center transition-colors min-h-[100px]"
      >
        {currentImage ? (
          <div className="relative w-full h-32">
             <img src={currentImage} alt="Preview" className="w-full h-full object-contain" />
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <span className="text-gold-200 text-xs uppercase">Change Image</span>
             </div>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gold-500 mb-2" />
            <span className="text-gray-400 text-xs">Click to upload device image</span>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-luxury-900 border border-luxury-800 p-6 relative overflow-hidden group hover:border-gold-600/50 transition-colors duration-500 ${className}`}>
    {children}
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-500/20 group-hover:border-gold-500/60 transition-colors duration-500"></div>
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-500/20 group-hover:border-gold-500/60 transition-colors duration-500"></div>
  </div>
);

export const PageTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-12 animate-fade-in-up">
    <h2 className="text-3xl md:text-5xl font-serif text-gold-400 mb-3">{title}</h2>
    {subtitle && <div className="h-px w-24 bg-gold-600 mx-auto mb-4"></div>}
    {subtitle && <p className="text-luxury-400 text-sm md:text-base tracking-widest uppercase text-gold-200/60">{subtitle}</p>}
  </div>
);

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  isDestructive?: boolean;
}> = ({ isOpen, onClose, title, description, onConfirm, confirmText = "Confirm", isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-luxury-900 border border-gold-500/30 w-full max-w-md p-6 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-serif text-gold-100">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gold-400"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-gray-300 mb-8">{description}</p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button 
            onClick={() => { onConfirm(); onClose(); }} 
            variant={isDestructive ? 'danger' : 'primary'} 
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-luxury-900 border border-gold-500/30 w-full max-w-md p-6 shadow-2xl animate-fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4 border border-gold-500/30">
          <AlertTriangle className="w-8 h-8 text-gold-400" />
        </div>
        <h3 className="text-xl font-serif text-gold-100 mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <Button onClick={onClose} className="w-full">
          Understood
        </Button>
      </div>
    </div>
  );
};