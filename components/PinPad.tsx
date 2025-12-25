import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface PinPadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinPad: React.FC<PinPadProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleNumClick = (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (inputPin: string) => {
    const correctPin = StorageService.getParentPin();
    if (inputPin === correctPin) {
      setTimeout(() => {
        onSuccess();
        setPin('');
      }, 200);
    } else {
      setError(true);
      setTimeout(() => setPin(''), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white/10 border border-white/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Parent Access</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i < pin.length 
                  ? (error ? 'bg-red-500 scale-125' : 'bg-yellow-400 scale-110') 
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-center mb-4 text-sm font-bold">Incorrect PIN</p>}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="h-16 w-16 mx-auto rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-2xl font-bold transition-colors"
            >
              {num}
            </button>
          ))}
          <div className="h-16 w-16"></div>
          <button
              onClick={() => handleNumClick(0)}
              className="h-16 w-16 mx-auto rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-2xl font-bold transition-colors"
            >
              0
            </button>
          <button
              onClick={handleDelete}
              className="h-16 w-16 mx-auto rounded-full hover:bg-white/10 flex items-center justify-center text-white/70"
            >
              <Delete size={28} />
            </button>
        </div>
      </div>
    </div>
  );
};