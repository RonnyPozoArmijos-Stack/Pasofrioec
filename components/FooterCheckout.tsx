
import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { PaymentMethod, OrderData } from '../types';

const MIN_ORDER_AMOUNT = 10;

interface FooterCheckoutProps {
  subtotal: number;
  formData: OrderData;
  isFormValid: boolean;
  onReview: () => void;
  isInputFocused: boolean;
}

export const FooterCheckout: React.FC<FooterCheckoutProps> = ({
  subtotal,
  formData,
  isFormValid,
  onReview,
  isInputFocused
}) => {
  const paymentLabel = formData.paymentMethod === PaymentMethod.Transferencia 
    ? `TRANSFERENCIA – ${formData.selectedBank || 'Selecciona Banco'}` 
    : 'EFECTIVO';

  return (
    <div className={`fixed bottom-0 left-0 right-0 w-full bg-zinc-950/98 backdrop-blur-2xl border-t border-zinc-800 z-[9999] transition-all duration-150 ease-out animate-in fade-in slide-in-from-bottom-2 ${
      isInputFocused ? 'p-2' : 'p-6 pb-10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]'
    }`}>
      <div className="max-w-[430px] mx-auto">
        <div className={`flex justify-between items-center px-2 ${isInputFocused ? 'mb-1' : 'mb-6'}`}>
          <div className="flex flex-col">
            <span className="text-zinc-500 font-black uppercase italic text-[9px] tracking-[0.2em] leading-none mb-1">
              Total a Pagar
            </span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isFormValid ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`}></div>
              <span className={`text-[7px] font-black uppercase tracking-widest transition-colors duration-300 ${isFormValid ? 'text-zinc-300' : 'text-zinc-500'}`}>
                {paymentLabel}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            {subtotal < MIN_ORDER_AMOUNT && (
              <span className="text-[8px] font-black text-red-500 uppercase italic tracking-tight animate-pulse mb-1">
                Faltan ${(MIN_ORDER_AMOUNT - subtotal).toFixed(2)}
              </span>
            )}
            <span className={`${
              isInputFocused ? 'text-xl' : 'text-4xl'
            } font-black text-yellow-400 tracking-tighter transition-all duration-150 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]`}>
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            disabled={!isFormValid}
            onClick={(e) => {
              e.preventDefault();
              onReview();
            }} 
            className={`w-full font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-tighter text-xs transition-all duration-200 ${
              isInputFocused ? 'py-3' : 'py-5'
            } ${
              isFormValid 
                ? 'bg-yellow-400 text-black shadow-2xl shadow-yellow-400/30 active:scale-[0.97] cursor-pointer' 
                : 'bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'
            }`}
          >
            REVISAR PEDIDO <ChevronRight className={`w-4 h-4 stroke-[3px] transition-transform duration-300 ${isFormValid ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`} />
          </button>
          
          {(!isFormValid && !isInputFocused) && (
            <div className="flex flex-col items-center gap-2 animate-in fade-in duration-300">
              {subtotal < MIN_ORDER_AMOUNT ? (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                  <AlertCircle className="w-3 h-3" />
                  <p className="text-[8px] font-black uppercase tracking-widest italic">
                    Mínimo requerido: ${MIN_ORDER_AMOUNT}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 opacity-40 animate-pulse w-full">
                  <div className="h-[1px] flex-1 bg-zinc-800"></div>
                  <p className="text-[7px] text-zinc-500 font-black uppercase tracking-[0.2em] italic whitespace-nowrap">
                    Completa los campos obligatorios
                  </p>
                  <div className="h-[1px] flex-1 bg-zinc-800"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
