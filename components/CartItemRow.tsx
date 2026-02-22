
import React from 'react';
import { Trash2, Plus, Minus, Package } from 'lucide-react';
import { CartItem } from '../types';

interface Props {
  item: CartItem;
  onUpdateQuantity: (id: string, format: string, delta: number) => void;
  onRemove: (id: string, format: string) => void;
}

export const CartItemRow: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 flex items-center gap-4 mb-3">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center p-1 shadow-lg overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-white font-bold text-xs leading-tight uppercase tracking-tight">{item.name}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Package className="w-3 h-3 text-yellow-400" />
          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">{item.format}</span>
        </div>
        <p className="text-white font-black text-sm mt-1">${(item.formatPrice * item.quantity).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-zinc-800/50 rounded-xl p-1 border border-zinc-700">
          <button 
            onClick={() => onUpdateQuantity(item.id, item.format, -1)}
            className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors text-white"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-white font-black text-xs">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, item.format, 1)}
            className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors text-white"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <button 
          onClick={() => onRemove(item.id, item.format)}
          className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
