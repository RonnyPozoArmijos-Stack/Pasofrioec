
export interface Product {
  id: string;
  name: string;
  price: number;
  priceSixPack: number;
  priceCaja24: number;
  priceMediaCajetilla?: number;
  price15L?: number;
  price3L?: number;
  image: string;
  description?: string;
}

export type PurchaseFormat = 'Unidad' | 'Six Pack' | 'Caja 24' | 'Cajetilla' | 'Media Cajetilla' | '1.5 LITROS' | '3 LITROS';

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
  deliveryTime: DeliveryTime;
  scheduledDate?: string;
  scheduledTime?: string;
}
