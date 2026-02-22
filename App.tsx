
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  ChevronRight, 
  MessageCircle, 
  ArrowLeft, 
  Home,
  X,
  Zap,
  ShieldCheck,
  ThermometerSnowflake,
  LayoutGrid,
  Check,
  Minus,
  Plus,
  AlertCircle
} from 'lucide-react';
import { CartItem, OrderData, PaymentMethod, DeliveryTime, Product, PurchaseFormat } from './types';
import { INITIAL_PRODUCTS, WHATSAPP_NUMBER, LOGO_URL } from './constants';
import { DesktopBlocker } from './components/DesktopBlocker';
import { CartItemRow } from './components/CartItemRow';
import { CheckoutForm } from './components/CheckoutForm';
import { FooterCheckout } from './components/FooterCheckout';

const MIN_ORDER_AMOUNT = 10;

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [activeTab, setActiveTab] = useState<'HOME' | 'CART' | 'CATALOG'>('HOME');
  const [step, setStep] = useState<'FLOW' | 'CHECKOUT' | 'SUMMARY'>('FLOW');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQtys, setModalQtys] = useState<Record<string, number>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Reset input focus state when changing steps or tabs to prevent header from staying collapsed
  useEffect(() => {
    setIsInputFocused(false);
  }, [step, activeTab]);
  
  const [formData, setFormData] = useState<OrderData>({
    name: '',
    phone: '',
    address: '',
    reference: '',
    mapsLink: '',
    paymentMethod: undefined as unknown as PaymentMethod,
    deliveryTime: undefined as unknown as DeliveryTime,
    scheduledDate: '',
    scheduledTime: ''
  });

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 500);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setModalQtys({
        'Unidad': 0,
        'Six Pack': 0,
        'Caja 24': 0,
        'Cajetilla': 0,
        'Media Cajetilla': 0,
        '1.5 LITROS': 0,
        '3 LITROS': 0
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, activeTab]);

  const cartCount = useMemo(() => cart.length, [cart]);
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.formatPrice * item.quantity, 0);
  }, [cart]);

  const validation = useMemo(() => ({
    name: formData.name.trim().length >= 3,
    address: formData.address.trim().length >= 5,
    maps: (() => {
      const link = formData.mapsLink.trim().toLowerCase();
      const allowed = [
        'google.com/maps', 
        'maps.google.com', 
        'goo.gl/maps', 
        'maps.app.goo.gl', 
        'maps.apple.com', 
        'waze.com', 
        'waze.link'
      ];
      return allowed.some(domain => link.includes(domain)) && link.startsWith('http');
    })(),
    payment: !!formData.paymentMethod,
    bank: formData.paymentMethod !== PaymentMethod.Transferencia || !!formData.selectedBank,
    delivery: !!formData.deliveryTime,
    schedule: formData.deliveryTime !== DeliveryTime.SCHEDULED || (() => {
      if (!formData.scheduledDate || !formData.scheduledTime) return false;
      const now = new Date();
      const selectedDate = new Date(formData.scheduledDate + 'T00:00:00');
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (selectedDate > today) return true;
      if (selectedDate < today) return false;
      
      const [hours, minutes] = formData.scheduledTime.split(':').map(Number);
      const selectedTimeInMinutes = hours * 60 + minutes;
      const nowInMinutes = now.getHours() * 60 + now.getMinutes();
      
      return selectedTimeInMinutes > nowInMinutes;
    })(),
    cart: cart.length > 0,
    minOrder: subtotal >= MIN_ORDER_AMOUNT
  }), [formData, cart, subtotal]);

  const isFormValid = useMemo(() => {
    return Object.values(validation).every(v => v);
  }, [validation]);

  const showFooter = useMemo(() => {
    return !!formData.paymentMethod;
  }, [formData.paymentMethod]);

  const handleModalQtyChange = (format: string, delta: number) => {
    setModalQtys(prev => ({
      ...prev,
      [format]: Math.max(0, (prev[format] || 0) + delta)
    }));
  };

  const modalTotal = useMemo(() => {
    if (!selectedProduct) return 0;
    let total = 0;
    if (Number(modalQtys['Unidad']) > 0) total += Number(modalQtys['Unidad']) * selectedProduct.price;
    if (Number(modalQtys['Six Pack']) > 0) total += Number(modalQtys['Six Pack']) * selectedProduct.priceSixPack;
    if (Number(modalQtys['Cajetilla']) > 0) total += Number(modalQtys['Cajetilla']) * selectedProduct.priceSixPack;
    if (Number(modalQtys['Caja 24']) > 0) total += Number(modalQtys['Caja 24']) * selectedProduct.priceCaja24;
    if (Number(modalQtys['Media Cajetilla']) > 0) total += Number(modalQtys['Media Cajetilla']) * (selectedProduct.priceMediaCajetilla || 0);
    if (Number(modalQtys['1.5 LITROS']) > 0) total += Number(modalQtys['1.5 LITROS']) * (selectedProduct.price15L || 0);
    if (Number(modalQtys['3 LITROS']) > 0) total += Number(modalQtys['3 LITROS']) * (selectedProduct.price3L || 0);
    return total;
  }, [modalQtys, selectedProduct]);

  const addModalToCart = () => {
    if (!selectedProduct) return;
    setIsAdding(true);
    
    setCart(prev => {
      let newCart = [...prev];
      (Object.entries(modalQtys) as [string, number][]).forEach(([format, qty]) => {
        if (qty > 0) {
          let price = 0;
          let finalFormat = format as PurchaseFormat;
          if (format === 'Unidad') price = selectedProduct.price;
          else if (format === 'Six Pack' || format === 'Cajetilla') price = selectedProduct.priceSixPack;
          else if (format === 'Caja 24') price = selectedProduct.priceCaja24;
          else if (format === 'Media Cajetilla') price = selectedProduct.priceMediaCajetilla || 0;
          else if (format === '1.5 LITROS') price = selectedProduct.price15L || 0;
          else if (format === '3 LITROS') price = selectedProduct.price3L || 0;
          
          const exists = newCart.find(i => i.id === selectedProduct.id && i.format === finalFormat);
          if (exists) {
            newCart = newCart.map(i => (i.id === selectedProduct.id && i.format === finalFormat) ? { ...i, quantity: i.quantity + qty } : i);
          } else {
            newCart.push({ ...selectedProduct, format: finalFormat, quantity: qty, formatPrice: price });
          }
        }
      });
      return newCart;
    });

    setTimeout(() => {
      setIsAdding(false);
      setSelectedProduct(null);
    }, 800);
  };

  const updateQuantity = (id: string, format: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.format === format) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string, format: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.format === format)));
  };

  const generateWhatsAppMsg = () => {
    let message = `NUEVO PEDIDO - PASO FRIO\n\n`;
    message += `CLIENTE: ${formData.name}\n`;
    message += `DIRECCION: ${formData.address}\n`;
    if (formData.mapsLink) message += `UBICACION: ${formData.mapsLink}\n\n`;
    
    message += `ORDEN:\n`;
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name} (${item.format}) - $${(item.formatPrice * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\nTOTAL A PAGAR: $${subtotal.toFixed(2)}\n`;
    
    if (formData.paymentMethod === PaymentMethod.Transferencia) {
      message += `METODO DE PAGO: Transferencia a ${formData.selectedBank || 'Cualquiera'}\n`;
      message += `IMPORTANTE: Por favor envíe el comprobante de transferencia por este medio.\n`;
    } else {
      message += `METODO DE PAGO: Efectivo contra entrega\n`;
    }

    if (formData.deliveryTime === DeliveryTime.SCHEDULED) {
      message += `\nENTREGA: Programado para el ${formData.scheduledDate} a las ${formData.scheduledTime}`;
    } else {
      message += `\nENTREGA: Lo antes posible`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;
    
    // Mostrar el modal primero
    setShowSuccessModal(true);
    
    // Pequeño delay para asegurar que el estado se procese antes del redirect
    setTimeout(() => {
      try {
        // Crear un link temporal para mejor compatibilidad con iOS y navegadores in-app
        const link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        
        // En iOS in-app browsers, target="_blank" a veces falla o abre en la misma pestaña
        // Si después de un momento seguimos aquí, intentamos un redirect directo
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 500);
      } catch (e) {
        window.location.href = whatsappUrl;
      }
    }, 500);
  };

  const resetApp = () => {
    setShowSuccessModal(false);
    setCart([]);
    setStep('FLOW');
    setActiveTab('HOME');
    setFormData({
      name: '',
      phone: '',
      address: '',
      reference: '',
      mapsLink: '',
      paymentMethod: undefined as unknown as PaymentMethod,
      deliveryTime: undefined as unknown as DeliveryTime,
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  if (!isMobile) return <DesktopBlocker />;

  return (
    <div className="min-h-screen bg-black flex justify-center selection:bg-yellow-400 selection:text-black font-sans overflow-x-hidden">
      <div className="w-full max-w-[430px] bg-black min-h-screen relative flex flex-col">
        
        <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-between border-b border-zinc-900 px-5 transition-all duration-300 ${isInputFocused ? 'h-14' : 'h-20 shadow-lg shadow-black/40'}`}>
          <div className="flex items-center gap-4">
            {(step !== 'FLOW' || activeTab !== 'HOME') ? (
              <button 
                onClick={() => {
                  if (step === 'SUMMARY') setStep('CHECKOUT');
                  else if (step === 'CHECKOUT') setStep('FLOW');
                  else if (activeTab === 'CART') setActiveTab('CATALOG');
                  else if (activeTab === 'CATALOG') setActiveTab('HOME');
                }} 
                className="p-2 -ml-2 text-white active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : (
              <div 
                onClick={() => { setStep('FLOW'); setActiveTab('HOME'); }}
                className={`relative overflow-hidden rounded-full border border-yellow-400/30 shadow-sm flex items-center justify-center bg-black transition-all cursor-pointer ${isInputFocused ? 'w-10 h-10' : 'w-14 h-14'}`}
              >
                <img 
                  src={LOGO_URL} 
                  alt="Paso Frío" 
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'auto', WebkitBackfaceVisibility: 'hidden' }}
                />
              </div>
            )}
            <div 
              onClick={() => { setStep('FLOW'); setActiveTab('HOME'); }}
              className="cursor-pointer"
            >
              <h1 className={`${isInputFocused ? 'text-[10px]' : 'text-sm'} font-black text-white leading-none uppercase tracking-tighter italic transition-all`}>PASO FRÍO</h1>
              {!isInputFocused && <p className="text-[5px] text-yellow-400 font-black tracking-[0.3em] mt-0.5 uppercase">Llegamos Heladas</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(step !== 'FLOW' || activeTab === 'CART') ? (
              <button 
                onClick={() => { setStep('FLOW'); setActiveTab('CATALOG'); }}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full active:scale-90 active:bg-zinc-800 transition-all"
              >
                <span className="text-[8px] font-black uppercase tracking-widest">Cerrar</span>
                <X className="w-4 h-4" />
              </button>
            ) : (
              !isInputFocused && (
                <>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[7px] font-black uppercase text-green-500 tracking-widest">Abierto 24/7</span>
                  </div>
                  <button onClick={() => { setActiveTab('CART'); setStep('FLOW'); }} className={`relative p-2 transition-colors ${activeTab === 'CART' ? 'text-yellow-400' : 'text-zinc-400'}`}>
                    <span className="text-xl">🛒</span>
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-yellow-400 text-black text-[7px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )
            )}
          </div>
        </header>

        <main 
          className={`flex-1 p-4 pb-48 overflow-y-auto scroll-smooth transition-all duration-300 ${isInputFocused ? 'pt-20' : 'pt-28'}`}
          onFocusCapture={() => setIsInputFocused(true)}
          onBlurCapture={() => setIsInputFocused(false)}
        >
          {activeTab === 'HOME' && step === 'FLOW' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="relative py-12 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-yellow-400/5 blur-[100px] rounded-full"></div>
                <div className="relative w-40 h-40 mb-8 z-10 p-1 bg-black rounded-full border-2 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.25)] flex items-center justify-center">
                  <img 
                    src={LOGO_URL} 
                    alt="Hero Logo" 
                    className="w-[90%] h-[90%] object-contain" 
                    style={{ imageRendering: 'auto' }}
                  />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter relative z-10 leading-[0.9]">¿Sin chelas?<br/><span className="text-yellow-400">Paso Frío te las lleva</span></h2>
                <p className="text-zinc-500 text-[11px] mt-4 max-w-[240px] relative z-10 font-bold uppercase tracking-widest leading-relaxed">Delivery 24/7 en Minutos.</p>
                <button onClick={() => setActiveTab('CATALOG')} className="mt-10 bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest text-[9px] flex items-center gap-2 relative z-10 shadow-2xl active:scale-95 transition-all">
                  Abrir Menú <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <Zap className="w-6 h-6" />, title: '⚡ ENTREGA EXPRESS', desc: 'Tu pedido llega rápido y sin complicaciones', color: 'text-yellow-400' },
                  { icon: <ThermometerSnowflake className="w-6 h-6" />, title: '❄️ FRÍO GARANTIZADO', desc: 'Temperatura perfecta, como debe ser', color: 'text-blue-400' },
                  { icon: <ShieldCheck className="w-6 h-6" />, title: '🔒 PEDIDO CONFIRMADO', desc: 'Pago anticipado para garantizar tu entrega rápida.', color: 'text-green-400' }
                ].map((sello, i) => (
                  <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] flex items-center gap-6 shadow-xl shadow-black/20">
                    <div className={`${sello.color} bg-zinc-800/80 p-4 rounded-2xl shadow-inner`}>{sello.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-black text-sm uppercase italic tracking-wider leading-none mb-1.5">{sello.title}</h4>
                      <p className="text-zinc-400 text-xs font-medium leading-tight">{sello.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'CATALOG' && step === 'FLOW' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Nuestro Inventario</h2>
                <div className="bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-[7px] font-black uppercase text-zinc-500 tracking-[0.2em]">Premium Stock</div>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {INITIAL_PRODUCTS.map(product => (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="group bg-zinc-900/20 border border-zinc-800/80 rounded-[2rem] overflow-hidden flex flex-col active:scale-95 transition-all">
                    <div className="relative aspect-square bg-zinc-950 flex items-center justify-center p-2 overflow-hidden">
                      <img src={product.image} className="max-w-full max-h-full object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 pointer-events-none" alt={product.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-white font-black text-[9px] uppercase tracking-tight leading-tight line-clamp-2">{product.name}</h4>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <button className="w-full py-2 bg-yellow-400 text-black text-[8px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-yellow-400/5">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center py-4">
                <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.3em] italic">Muy pronto sumaremos nuevas marcas de cervezas</p>
              </div>
            </div>
          )}

          {activeTab === 'CART' && step === 'FLOW' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Mi Carrito</h2>
                 <button 
                   onClick={() => setActiveTab('CATALOG')}
                   className="text-[8px] font-black text-yellow-400 uppercase tracking-widest border-b border-yellow-400/30 pb-0.5 active:opacity-50 transition-opacity"
                 >
                   + Seguir Comprando
                 </button>
               </div>
               {cart.length === 0 ? (
                 <div className="text-center py-24 bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800">
                    <span className="text-4xl opacity-40 block mb-4">🛒</span>
                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Nada por aquí todavía</p>
                    <button onClick={() => setActiveTab('CATALOG')} className="mt-6 bg-zinc-800 text-zinc-400 px-6 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest active:scale-95">Ir a comprar</button>
                 </div>
               ) : (
                 <>
                   <div className="space-y-2">
                    {cart.map(item => (
                      <CartItemRow key={`${item.id}-${item.format}`} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
                    ))}
                   </div>
                   <div className="pt-8 border-t border-zinc-900 space-y-5">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-zinc-500 text-xs font-black uppercase italic tracking-tighter">Subtotal</span>
                          {subtotal < MIN_ORDER_AMOUNT && (
                            <span className="text-[9px] font-black text-red-500 uppercase italic tracking-tight animate-pulse mt-1">
                              Te faltan ${(MIN_ORDER_AMOUNT - subtotal).toFixed(2)} para el mínimo
                            </span>
                          )}
                        </div>
                        <span className="text-4xl font-black text-white tracking-tighter">${subtotal.toFixed(2)}</span>
                      </div>

                      {subtotal < MIN_ORDER_AMOUNT && (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-red-400 font-bold uppercase leading-tight">
                            Pedido mínimo requerido: ${MIN_ORDER_AMOUNT}. Agrega más productos para continuar.
                          </p>
                        </div>
                      )}

                      <button 
                        disabled={subtotal < MIN_ORDER_AMOUNT}
                        onClick={() => setStep('CHECKOUT')} 
                        className={`w-full font-black py-5 rounded-[2rem] flex items-center justify-center gap-2 uppercase tracking-tight text-xs shadow-2xl transition-all ${
                          subtotal >= MIN_ORDER_AMOUNT 
                            ? 'bg-white text-black active:scale-[0.98]' 
                            : 'bg-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        Continuar <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                 </>
               )}
            </div>
          )}

          {step === 'CHECKOUT' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400 pb-40">
              <CheckoutForm 
                formData={formData} 
                setFormData={setFormData} 
                subtotal={subtotal}
                validation={validation}
                onNext={() => setStep('SUMMARY')}
              />
            </div>
          )}

          {step === 'CHECKOUT' && (
            <FooterCheckout 
              subtotal={subtotal}
              formData={formData}
              isFormValid={isFormValid}
              onReview={() => setStep('SUMMARY')}
              isInputFocused={isInputFocused}
            />
          )}

          {step === 'SUMMARY' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-400 space-y-6">
              <h2 className="text-xl font-black text-white uppercase italic text-center tracking-tighter">Resumen Final</h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-7 space-y-6 shadow-2xl">
                <div>
                  <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Enviar a:</p>
                  <p className="text-white font-bold text-sm leading-tight italic">{formData.name}</p>
                </div>
                <div><p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Pago:</p><p className="text-yellow-400 font-black text-xs uppercase italic">{formData.paymentMethod === PaymentMethod.Transferencia ? `Transferencia ${formData.selectedBank}` : 'Efectivo'}</p></div>
                <div>
                  <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Entrega:</p>
                  <p className="text-white font-bold text-xs uppercase italic">
                    {formData.deliveryTime === DeliveryTime.SCHEDULED ? `Programado: ${formData.scheduledDate} ${formData.scheduledTime}` : 'Lo antes posible'}
                  </p>
                </div>
                <div className="space-y-2.5 pt-4 border-t border-zinc-800/50">
                  <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Pedido:</p>
                  {cart.map(item => (
                    <div key={`${item.id}-${item.format}`} className="flex justify-between text-[11px] items-center"><span className="text-zinc-400 font-medium">{item.quantity}x {item.name.split(' ')[0]} ({item.format})</span><span className="text-white font-black">${(item.formatPrice * item.quantity).toFixed(2)}</span></div>
                  ))}
                </div>
                <div className="pt-6 flex justify-between items-center border-t border-zinc-800">
                  <span className="text-zinc-500 font-black uppercase italic text-xs">Total Final</span>
                  <span className="text-3xl font-black text-yellow-400 tracking-tighter">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={generateWhatsAppMsg} className="w-full bg-[#25D366] text-white font-black py-5 rounded-[2.5rem] flex items-center justify-center gap-3 uppercase tracking-tighter text-sm shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all">
                <MessageCircle className="w-5 h-5 fill-white" /> Pedir por WhatsApp
              </button>
            </div>
          )}
        </main>

        {(step === 'FLOW' && !isInputFocused) && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-zinc-900/95 backdrop-blur-3xl border-t border-zinc-800/50 flex items-center justify-between px-8 h-20 z-50 animate-in slide-in-from-bottom-20 duration-500">
            <button onClick={() => { setActiveTab('HOME'); setStep('FLOW'); }} className={`flex-1 h-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'HOME' ? 'text-yellow-400' : 'text-zinc-600'}`}>
              <Home className={`w-5 h-5 ${activeTab === 'HOME' ? 'fill-yellow-400/10' : ''}`} />
              <span className="text-[8px] font-black uppercase tracking-[0.25em]">Home</span>
            </button>
            <div className="relative -mt-12 mx-4">
              <button onClick={() => { if (activeTab === 'CART') setActiveTab('HOME'); else setActiveTab('CART'); setStep('FLOW'); }} className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-black transition-all duration-500 active:scale-90 ${activeTab === 'CART' ? 'bg-white text-black' : 'bg-yellow-400 text-black'}`}>
                <span className="text-2xl">{activeTab === 'CART' ? <X className="w-6 h-6" /> : '🛒'}</span>
                {cartCount > 0 && activeTab !== 'CART' && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-yellow-400 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            <button onClick={() => { setActiveTab('CATALOG'); setStep('FLOW'); }} className={`flex-1 h-full flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${activeTab === 'CATALOG' ? 'text-yellow-400' : 'text-zinc-600'}`}>
              <LayoutGrid className={`w-5 h-5 ${activeTab === 'CATALOG' ? 'fill-yellow-400/10' : ''}`} />
              <span className="text-[8px] font-black uppercase tracking-[0.25em]">Menú</span>
            </button>
          </nav>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)}></div>
            <div className="relative w-full max-w-[430px] bg-zinc-950 rounded-t-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full duration-500 border-t border-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between p-6 pb-2 border-b border-zinc-900/50 z-20">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white uppercase italic leading-tight tracking-tighter">{selectedProduct.name}</h3>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2.5 bg-zinc-900 text-zinc-400 rounded-full active:scale-90 transition-transform">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-6">
                <div className="w-full aspect-[4/3] bg-zinc-900 rounded-[2rem] relative flex items-center justify-center p-6 border border-zinc-800/50 shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                  <img src={selectedProduct.image} className="max-w-full max-h-full object-contain z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transform scale-105" alt={selectedProduct.name} />
                </div>
                <div className="space-y-3 pb-8">
                  {selectedProduct.price > 0 && <FormatCard label="Unidad" price={selectedProduct.price} qty={modalQtys['Unidad'] || 0} onUpdate={(d) => handleModalQtyChange('Unidad', d)} />}
                  {selectedProduct.priceMediaCajetilla && selectedProduct.priceMediaCajetilla > 0 && <FormatCard label="Media Cajetilla" price={selectedProduct.priceMediaCajetilla} qty={modalQtys['Media Cajetilla'] || 0} onUpdate={(d) => handleModalQtyChange('Media Cajetilla', d)} />}
                  {selectedProduct.priceSixPack > 0 && <FormatCard label={selectedProduct.name.toLowerCase().includes('cigarrillo') ? "Cajetilla" : "Six Pack"} price={selectedProduct.priceSixPack} qty={selectedProduct.name.toLowerCase().includes('cigarrillo') ? (modalQtys['Cajetilla'] || 0) : (modalQtys['Six Pack'] || 0)} onUpdate={(d) => handleModalQtyChange(selectedProduct.name.toLowerCase().includes('cigarrillo') ? 'Cajetilla' : 'Six Pack', d)} />}
                  {selectedProduct.priceCaja24 > 0 && <FormatCard label="Caja de 24" price={selectedProduct.priceCaja24} qty={modalQtys['Caja 24'] || 0} onUpdate={(d) => handleModalQtyChange('Caja 24', d)} />}
                  {selectedProduct.price15L && selectedProduct.price15L > 0 && <FormatCard label="1.5 LITROS" price={selectedProduct.price15L} qty={modalQtys['1.5 LITROS'] || 0} onUpdate={(d) => handleModalQtyChange('1.5 LITROS', d)} />}
                  {selectedProduct.price3L && selectedProduct.price3L > 0 && <FormatCard label="3 LITROS" price={selectedProduct.price3L} qty={modalQtys['3 LITROS'] || 0} onUpdate={(d) => handleModalQtyChange('3 LITROS', d)} />}
                </div>
              </div>
              <div className="sticky bottom-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-900 p-6 flex flex-col gap-4 z-30">
                <div className="flex justify-between items-center px-1">
                  <div>
                    <span className="text-3xl font-black text-yellow-400 tracking-tighter">${modalTotal.toFixed(2)}</span>
                  </div>
                  {modalTotal > 0 && <div className="flex items-center gap-2 text-green-500 animate-in fade-in zoom-in"><Check className="w-4 h-4" /><span className="text-[9px] font-black uppercase tracking-widest">Listo</span></div>}
                </div>
                <button 
                  onClick={addModalToCart} 
                  disabled={modalTotal === 0 || isAdding} 
                  className={`w-full h-16 rounded-2xl font-black uppercase tracking-tight text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-xl disabled:opacity-20 disabled:grayscale ${
                    isAdding 
                      ? 'bg-green-500 text-white scale-[0.98]' 
                      : 'bg-white text-black active:scale-95'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5 stroke-[4px] animate-in zoom-in duration-300" />
                      ¡Agregado!
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🛒</span> 
                      Agregar al Carrito
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6 animate-in fade-in duration-300">
            <div className="w-full max-w-[340px] bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300 shadow-2xl opacity-100">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                <Check className="w-10 h-10 text-green-500 stroke-[3px]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">¡Pedido enviado!</h3>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  Tu pedido ha sido procesado correctamente. <br/> Revisa tu WhatsApp para coordinar la entrega.
                </p>
              </div>
              <button 
                onClick={resetApp}
                className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase tracking-tighter text-xs shadow-xl active:scale-95 transition-all"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormatCard: React.FC<{ label: string, price: number, qty: number, onUpdate: (d: number) => void }> = ({ label, price, qty, onUpdate }) => {
  return (
    <div className={`p-5 rounded-[1.8rem] border-2 transition-all flex items-center justify-between ${qty > 0 ? 'bg-zinc-900 border-yellow-400/50' : 'bg-zinc-900/40 border-zinc-800/50 opacity-70'}`}>
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">{label}</span>
        <span className="text-lg font-black text-white tracking-tighter">${price.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-3">
        {qty > 0 ? (
          <div className="flex items-center bg-black/60 border border-zinc-800 rounded-xl p-1 animate-in slide-in-from-right-2">
            <button onClick={() => onUpdate(-1)} className="p-1.5 text-zinc-400 active:text-white"><Minus className="w-3.5 h-3.5"/></button>
            <span className="w-7 text-center text-white font-black text-xs">{qty}</span>
            <button onClick={() => onUpdate(1)} className="p-1.5 text-zinc-400 active:text-white"><Plus className="w-3.5 h-3.5"/></button>
          </div>
        ) : (
          <button onClick={() => onUpdate(1)} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 active:bg-yellow-400 active:text-black transition-colors"><Plus className="w-5 h-5" /></button>
        )}
      </div>
    </div>
  );
};

export default App;
