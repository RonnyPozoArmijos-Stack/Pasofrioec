
import React from 'react';
import { Smartphone, QrCode } from 'lucide-react';

export const DesktopBlocker: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-yellow-400 p-6 rounded-3xl mb-6">
        <Smartphone className="w-16 h-16 text-black" />
      </div>
      <h1 className="text-2xl font-extrabold text-white mb-4 uppercase tracking-tighter">
        Disponible solo en celular
      </h1>
      <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
        Escanea el QR o abre el link desde tu dispositivo móvil para realizar tu pedido.
      </p>
      <div className="bg-white p-4 rounded-xl shadow-lg shadow-yellow-400/20">
        <QrCode className="w-40 h-40 text-black" />
      </div>
      <div className="mt-10 animate-bounce">
        <p className="text-yellow-400 font-bold text-sm tracking-widest uppercase">
          PASO FRÍO 24/7
        </p>
      </div>
    </div>
  );
};
