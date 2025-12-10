import React, { useState } from 'react';
import { MapPin, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button, Input, Card } from '../components/UIComponents';

interface PincodeViewProps {
  onSuccess: (pincode: string) => void;
  allowedPincodes: string[];
}

const PincodeView: React.FC<PincodeViewProps> = ({ onSuccess, allowedPincodes }) => {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode) return;

    setIsChecking(true);
    setError('');

    // Simulate API delay for dramatic effect
    setTimeout(() => {
      if (allowedPincodes.includes(pincode)) {
        setShowAgeGate(true);
      } else {
        setError('We currently do not offer our exclusive services in this area.');
      }
      setIsChecking(false);
    }, 800);
  };

  const handleAgeConfirm = (isConfirmed: boolean) => {
    if (isConfirmed) {
      onSuccess(pincode);
    } else {
      setShowAgeGate(false);
      setError('Access restricted. You must be 21 years or older to view our collection.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-luxury-800 via-luxury-900 to-black opacity-80 z-0"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600 mb-4 tracking-tighter">
            AURUM
          </h1>
          <p className="text-gold-200 uppercase tracking-[0.3em] text-xs">The Standard of Luxury</p>
        </div>

        <Card className="backdrop-blur-sm bg-luxury-900/80 transition-all duration-500">
          {!showAgeGate ? (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <MapPin className="w-8 h-8 text-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-gold-100">Location Verification</h3>
                <p className="text-sm text-gray-400 mt-2">Services available in Pune & Kolhapur regions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                  type="text" 
                  placeholder="Enter Pincode (e.g., 411001)" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                
                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-400 text-sm bg-red-900/10 p-3 border border-red-900/30 rounded">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full"
                  isLoading={isChecking}
                >
                  Verify Access
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-luxury-800 text-center">
                 <p className="text-xs text-gray-500">Sample codes: 411001 (Pune), 416001 (Kolhapur)</p>
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-gold-500/30 flex items-center justify-center mx-auto mb-6 bg-luxury-800">
                  <ShieldAlert className="w-8 h-8 text-gold-400" />
              </div>
              <h3 className="text-xl font-serif text-gold-100 mb-4">Age Verification Required</h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                  Our catalog features exclusive alcoholic beverages. Please confirm you are of legal drinking age to proceed.
              </p>
              
              <div className="space-y-3">
                  <Button onClick={() => handleAgeConfirm(true)} className="w-full">
                      Yes, I am above 21
                  </Button>
                  <Button onClick={() => handleAgeConfirm(false)} variant="secondary" className="w-full">
                      No, I am under 21
                  </Button>
              </div>
              
              <div className="mt-6 text-xs text-gray-500 uppercase tracking-wider">
                  Strictly 21+ Only
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PincodeView;