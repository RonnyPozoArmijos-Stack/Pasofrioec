
import React from 'react';
import { PaymentMethod, DeliveryTime, OrderData } from '../types';
import { ACCOUNTS } from '../constants';
import { 
  CreditCard, 
  Banknote, 
  Zap, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  CheckCircle2,
  User,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

interface Props {
  formData: OrderData;
  setFormData: React.Dispatch<React.SetStateAction<OrderData>>;
  subtotal: number;
  validation: {
    name: boolean;
    address: boolean;
    maps: boolean;
    payment: boolean;
    bank: boolean;
    delivery: boolean;
    schedule: boolean;
    cart: boolean;
  };
  onNext: () => void;
}

export const CheckoutForm: React.FC<Props> = ({ formData, setFormData, subtotal, validation, onNext }) => {
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [copiedBank, setCopiedBank] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setFormData(prev => {
      const isAlreadySelected = prev.paymentMethod === method;
      const nextMethod = isAlreadySelected ? undefined : method;
      
      return { 
        ...prev, 
        paymentMethod: nextMethod as unknown as PaymentMethod,
        selectedBank: undefined // Siempre reseteamos el banco al cambiar o deseleccionar método
      };
    });
  };

  const handleBankSelect = (bankName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedBank: prev.selectedBank === bankName ? undefined : bankName 
    }));
  };

  const handleTimeSelect = (time: DeliveryTime) => {
    setFormData(prev => {
      const isAlreadySelected = prev.deliveryTime === time;
      const nextTime = isAlreadySelected ? undefined : time;
      return { ...prev, deliveryTime: nextTime as unknown as DeliveryTime };
    });
  };

  return (
    <div className="space-y-8 pb-[50vh] animate-in fade-in duration-500">
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase italic tracking-tighter">
            <MapPin className="w-5 h-5 text-yellow-400" /> Datos de Entrega
          </h2>
          <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest">* Obligatorio</span>
        </div>
        
        <div className="space-y-6">
          <div className="relative scroll-mt-24" id="field-name">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest px-2 mb-2 italic">Tu Nombre / Quién recibe *:</p>
            <input
              type="text"
              name="name"
              placeholder="Ej: Ronny"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              enterKeyHint="next"
              autoComplete="name"
              className={`w-full bg-zinc-900 border ${formData.name.length > 0 && !validation.name ? 'border-red-500/50' : validation.name ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-5 text-white placeholder-zinc-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm font-bold shadow-xl`}
              required
            />
            {formData.name.length > 0 && !validation.name && (
              <span className="text-[8px] text-red-400 font-bold uppercase mt-2 px-2 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> Nombre demasiado corto
              </span>
            )}
          </div>
          
          <div className="pt-2 scroll-mt-24" id="field-maps">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest px-2 mb-2 italic">Ubicación de Maps (Link) *:</p>
            <div className="relative group">
              <input
                type="text"
                name="mapsLink"
                placeholder="Pega aquí el enlace de ubicación"
                value={formData.mapsLink}
                onChange={handleChange}
                onBlur={() => handleBlur('mapsLink')}
                enterKeyHint="next"
                inputMode="url"
                autoComplete="off"
                className={`w-full bg-zinc-900 border ${formData.mapsLink.length > 0 && !validation.maps ? 'border-red-500/50' : validation.maps ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-5 pr-14 text-white placeholder-zinc-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm font-bold shadow-xl`}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2">
                <ExternalLink className={`w-5 h-5 transition-colors ${formData.mapsLink.length > 0 && !validation.maps ? 'text-red-400' : validation.maps ? 'text-green-400' : 'text-zinc-600 group-focus-within:text-yellow-400'}`} />
              </div>
            </div>
            {formData.mapsLink.length > 0 && !validation.maps && (
              <span className="text-[8px] text-red-400 font-bold uppercase mt-2 px-2 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> El enlace debe empezar con http...
              </span>
            )}
            <p className="text-[7px] text-zinc-600 font-bold uppercase mt-2 px-2 leading-tight">TIP: Ve a Google Maps, elige tu ubicación y dale a "Compartir" para copiar el link.</p>
          </div>

          <div className="relative scroll-mt-24" id="field-address">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest px-2 mb-2 italic">Referencias Adicionales *:</p>
            <textarea
              name="address"
              placeholder="Ej: Casa blanca, portón negro, frente al parque..."
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
              enterKeyHint="done"
              autoComplete="street-address"
              className={`w-full bg-zinc-900 border ${formData.address.length > 0 && !validation.address ? 'border-red-500/50' : validation.address ? 'border-green-500/30' : 'border-zinc-800'} rounded-2xl p-5 text-white placeholder-zinc-700 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-all text-sm font-bold min-h-[120px] resize-none shadow-xl`}
              required
            />
            {formData.address.length > 0 && !validation.address && (
              <span className="text-[8px] text-red-400 font-bold uppercase mt-2 px-2 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> Describe mejor tu dirección para llegar rápido
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6 scroll-mt-32" id="section-payment">
        <div>
          <h2 className="text-base font-black text-white mb-4 uppercase italic tracking-tighter">1. Método de Pago *</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePaymentSelect(PaymentMethod.Efectivo)}
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                formData.paymentMethod === PaymentMethod.Efectivo 
                  ? 'bg-yellow-400/10 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.15)]' 
                  : 'bg-zinc-900 border-zinc-800 opacity-50'
              }`}
            >
              <Banknote className={`w-8 h-8 mb-3 ${formData.paymentMethod === PaymentMethod.Efectivo ? 'text-yellow-400' : 'text-zinc-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${formData.paymentMethod === PaymentMethod.Efectivo ? 'text-yellow-400' : 'text-zinc-500'}`}>
                Efectivo
              </span>
            </button>
            <button
              onClick={() => handlePaymentSelect(PaymentMethod.Transferencia)}
              className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 ${
                formData.paymentMethod === PaymentMethod.Transferencia 
                  ? 'bg-yellow-400/10 border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.15)]' 
                  : 'bg-zinc-900 border-zinc-800 opacity-50'
              }`}
            >
              <CreditCard className={`w-8 h-8 mb-3 ${formData.paymentMethod === PaymentMethod.Transferencia ? 'text-yellow-400' : 'text-zinc-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${formData.paymentMethod === PaymentMethod.Transferencia ? 'text-yellow-400' : 'text-zinc-500'}`}>
                Transferencia
              </span>
            </button>
          </div>
        </div>

        {formData.paymentMethod === PaymentMethod.Transferencia && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-400">
            <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-yellow-400 font-bold uppercase leading-tight">
                IMPORTANTE: Una vez realizado el pedido, por favor envíe el comprobante de transferencia por WhatsApp para procesar su entrega.
              </p>
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest px-2 italic">Selecciona banco de destino:</p>
            {ACCOUNTS.map((acc) => (
              <div 
                key={acc.id} 
                onClick={() => handleBankSelect(acc.bank)}
                className={`rounded-[2.2rem] p-6 space-y-4 border-2 transition-all active:scale-[0.98] cursor-pointer ${
                  formData.selectedBank === acc.bank 
                  ? 'bg-zinc-800 border-yellow-400 shadow-xl' 
                  : 'bg-zinc-900 border-zinc-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-lg">
                    <img src={acc.icon} alt={acc.bank} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-sm uppercase italic tracking-tight leading-none mb-1">{acc.bank}</p>
                    <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-2">{acc.type}</p>
                    <div className="flex items-center gap-1.5">
                       <User className="w-3 h-3 text-yellow-400" />
                       <p className="text-[9px] text-yellow-400 font-black uppercase tracking-wider">{acc.owner}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {formData.selectedBank === acc.bank ? (
                      <div className="bg-green-500/20 border border-green-500/50 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                        <span className="text-[7px] font-black uppercase text-green-400 tracking-widest">Seleccionado</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">
                          Seleccionar
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {formData.selectedBank === acc.bank && (
                  <div className="space-y-2 animate-in zoom-in duration-200">
                    <div className={`p-4 rounded-2xl border flex justify-between items-center bg-black/60 border-yellow-400/40 relative`}>
                      <span className={`font-black text-base tracking-widest italic text-yellow-400`}>
                        {acc.account}
                      </span>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(acc.account);
                            setCopiedBank(acc.bank);
                            setTimeout(() => setCopiedBank(null), 2000);
                          }}
                          className={`px-4 py-2 rounded-xl border transition-all shadow-inner flex items-center gap-2 ${
                            copiedBank === acc.bank 
                              ? 'bg-green-500 border-green-500 scale-105' 
                              : 'bg-zinc-900 border-zinc-800 active:bg-yellow-400 active:border-yellow-400'
                          }`}
                        >
                          {copiedBank === acc.bank && <CheckCircle2 className="w-3 h-3 text-white animate-in zoom-in duration-300" />}
                          <span className={`text-[8px] font-black uppercase ${copiedBank === acc.bank ? 'text-white' : 'text-zinc-500'}`}>
                            {copiedBank === acc.bank ? 'Copiado' : 'Copiar'}
                          </span>
                        </button>
                        
                        {copiedBank === acc.bank && (
                          <div className="absolute top-full right-0 mt-2 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-green-500 text-white text-[7px] font-black uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-xl shadow-green-500/20 whitespace-nowrap flex items-center gap-1.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> ¡Cuenta copiada!
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6 scroll-mt-32" id="section-time">
        <div>
          <h2 className="text-base font-black text-white mb-4 uppercase italic tracking-tighter">2. ¿Para cuándo? *</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleTimeSelect(DeliveryTime.NOW)}
              className={`flex items-center justify-center gap-3 p-5 rounded-[2rem] border-2 transition-all active:scale-95 ${
                formData.deliveryTime === DeliveryTime.NOW 
                  ? 'bg-white text-black border-white shadow-xl' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 opacity-50'
              }`}
            >
              <Zap className="w-5 h-5 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ya mismo</span>
            </button>
            <button
              onClick={() => handleTimeSelect(DeliveryTime.SCHEDULED)}
              className={`flex items-center justify-center gap-3 p-5 rounded-[2rem] border-2 transition-all active:scale-95 ${
                formData.deliveryTime === DeliveryTime.SCHEDULED 
                  ? 'bg-white text-black border-white shadow-xl' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 opacity-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Programar</span>
            </button>
          </div>
        </div>

        {formData.deliveryTime === DeliveryTime.SCHEDULED && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4 duration-400">
            <div className="space-y-2">
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest px-2 italic">Fecha *:</p>
              <div className="relative">
                <input 
                  type="date" 
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  onBlur={() => handleBlur('scheduledDate')}
                  className={`w-full bg-zinc-900 border ${touched.scheduledDate && !formData.scheduledDate ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl p-4 text-white text-[11px] font-bold focus:border-yellow-400 focus:outline-none transition-all shadow-lg`}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest px-2 italic">Hora *:</p>
              <div className="relative">
                <input 
                  type="time" 
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  onBlur={() => handleBlur('scheduledTime')}
                  className={`w-full bg-zinc-900 border ${touched.scheduledTime && !validation.schedule ? 'border-red-500/50' : 'border-zinc-800'} rounded-2xl p-4 text-white text-[11px] font-bold focus:border-yellow-400 focus:outline-none transition-all shadow-lg`}
                />
              </div>
            </div>
            {touched.scheduledTime && !validation.schedule && formData.scheduledDate && formData.scheduledTime && (
              <div className="col-span-2 px-2">
                <span className="text-[8px] text-red-400 font-bold uppercase flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" /> La hora debe ser posterior a la actual
                </span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
