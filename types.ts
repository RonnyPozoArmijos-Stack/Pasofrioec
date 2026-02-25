
export interface Product {
  id: string;
  name: string;
  price: number;
  priceSixPack: number;
  priceCaja24: number;
  priceMediaCajetilla?: number;
  priceJaba12?: number;
  price15L?: number;
  price3L?: number;
  image: string;
  description?: string;
  category: 'lata' | 'vidrio' | 'jabas' | 'tragos' | 'cigarrillos' | 'guiti' | 'hielo';
}

export type PurchaseFormat = 'Unidad' | 'Six Pack' | 'Caja 24' | 'Cajetilla' | 'Media Cajetilla' | '1.5 LITROS' | '3 LITROS' | 'Jaba (12 Unidades)' | 'Media Jaba (6 Unidades)';

export interface CartItem extends Product {
  quantity: number;
  format: PurchaseFormat;
  formatPrice: number;
}

export enum PaymentMethod {
  Efectivo = 'Efectivo',
  Transferencia = 'Transferencia'
}

export enum DeliveryTime {
  NOW = 'En el momento',
  SCHEDULED = 'Programar'
}

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  reference: string;
  mapsLink: string;
  paymentMethod: PaymentMethod;
  selectedBank?: string;
  cashAmount?: string;
  deliveryTime: DeliveryTime;
  scheduledDate?: string;
  scheduledTime?: string;
}
