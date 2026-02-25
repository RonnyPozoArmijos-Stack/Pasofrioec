
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Siembra Cerveza en Lata 473 ml',
    price: 1.09,
    priceSixPack: 6.49,
    priceCaja24: 23.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770765267/ChatGPT_Image_Feb_10_2026_06_14_12_PM_s5jjuz.png',
    category: 'lata'
  },
  {
    id: '2',
    name: 'Cerveza Corona Extra Fina 330 ml',
    price: 1.49,
    priceSixPack: 8.49,
    priceCaja24: 29.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770766390/ChatGPT_Image_Feb_10_2026_06_32_39_PM_rqryee.png',
    category: 'vidrio'
  },
  {
    id: '3',
    name: 'Cerveza Budweiser Lata 269 ml',
    price: 1.09,
    priceSixPack: 5.99,
    priceCaja24: 21.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770765737/ChatGPT_Image_Feb_10_2026_06_21_51_PM_cs2opm.png',
    category: 'lata'
  },
  {
    id: '5',
    name: 'Cerveza Corona Extra Lata 269 ml',
    price: 1.09,
    priceSixPack: 5.99,
    priceCaja24: 22.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770765732/ChatGPT_Image_Feb_10_2026_06_19_57_PM_jyiu5b.png',
    category: 'lata'
  },
  {
    id: '6',
    name: 'Club Verde 330 ml',
    price: 1.24,
    priceSixPack: 6.99,
    priceCaja24: 26.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770766234/ChatGPT_Image_Feb_10_2026_06_28_07_PM_x0zsvn.png',
    category: 'vidrio'
  },
  {
    id: '9',
    name: 'Cerveza en Lata Heineken 269 ml',
    price: 1.09,
    priceSixPack: 5.99,
    priceCaja24: 22.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770765945/ChatGPT_Image_Feb_10_2026_06_18_42_PM_wwc1rr.png',
    category: 'lata'
  },
  {
    id: '21',
    name: 'Biela Reserva Lata 355 ml',
    price: 0.99,
    priceSixPack: 5.49,
    priceCaja24: 18.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770765499/1667fba0-4d11-4bab-ab18-d297aa435832_cpwioy.png',
    category: 'lata'
  },
  {
    id: '22',
    name: 'Cerveza Lager Amstel Lata 355 ml',
    price: 1.24,
    priceSixPack: 6.74,
    priceCaja24: 24.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770766243/ChatGPT_Image_Feb_10_2026_06_25_58_PM_hervon.png',
    category: 'lata'
  },
  {
    id: '23',
    name: 'Cerveza Premium Clásica Club Lata 355 ml',
    price: 1.24,
    priceSixPack: 7.49,
    priceCaja24: 27.99,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770766351/ChatGPT_Image_Feb_10_2026_06_31_09_PM_tied6h.png',
    category: 'lata'
  },
  {
    id: '10',
    name: 'Whisky Cartago Blended Malt 1LT',
    price: 6.99,
    priceSixPack: 0,
    priceCaja24: 0,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770767588/ChatGPT_Image_Feb_10_2026_06_44_56_PM_verxuf.png',
    category: 'tragos'
  },
  {
    id: '11',
    name: 'Cartago Extra Fino 1LT',
    price: 5.99,
    priceSixPack: 0,
    priceCaja24: 0,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770766464/ChatGPT_Image_Feb_10_2026_06_34_03_PM_y5erch.png',
    category: 'tragos'
  },
  {
    id: '12',
    name: 'Cigarrillos Carnival Change Double',
    price: 0.25,
    priceSixPack: 2.50,
    priceCaja24: 0,
    priceMediaCajetilla: 1.75,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770856266/ChatGPT_Image_Feb_11_2026_07_29_59_PM_stkpd6.png',
    category: 'cigarrillos'
  },
  {
    id: '13',
    name: 'Cigarrillos Silver Elephant 20 Unidades',
    price: 0.25,
    priceSixPack: 2.00,
    priceCaja24: 0,
    priceMediaCajetilla: 1.25,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770852649/ChatGPT_Image_Feb_11_2026_06_27_52_PM_ykc1iq.png',
    category: 'cigarrillos'
  },
  {
    id: '14',
    name: 'Cigarrillo Líder 20 Unidades',
    price: 0.50,
    priceSixPack: 9.00,
    priceCaja24: 0,
    priceMediaCajetilla: 4.50,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770856289/ChatGPT_Image_Feb_11_2026_07_31_20_PM_gb0a1a.png',
    category: 'cigarrillos'
  },
  {
    id: '15',
    name: 'Hielo en Cubito',
    price: 1.49,
    priceSixPack: 0,
    priceCaja24: 0,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1771033936/ChatGPT_Image_Feb_13_2026_08_48_49_PM_kzcfs5.png',
    category: 'hielo'
  },
  {
    id: '16',
    name: 'SWITCH BONGO',
    price: 2.99,
    priceSixPack: 0,
    priceCaja24: 0,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1771232119/ChatGPT_Image_Feb_16_2026_03_53_57_AM_uvgnia.png',
    category: 'tragos'
  },
  {
    id: '17',
    name: 'Zhumir Seco',
    price: 4.99,
    priceSixPack: 0,
    priceCaja24: 0,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1771232102/ChatGPT_Image_Feb_16_2026_03_53_01_AM_lgyz8a.png',
    category: 'tragos'
  },
  {
    id: '18',
    name: 'Agua mineral Güitig',
    price: 0,
    priceSixPack: 0,
    priceCaja24: 0,
    price15L: 1.09,
    price3L: 2.09,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1771552504/ChatGPT_Image_Feb_19_2026_08_54_48_PM_gatr73.png',
    category: 'guiti'
  },
  {
    id: '19',
    name: 'CLUB PREMIUM 550 ML JABA',
    price: 0,
    priceSixPack: 12,
    priceCaja24: 0,
    priceJaba12: 24,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1771981332/ChatGPT_Image_Feb_24_2026_07_55_29_PM_vno860.png',
    category: 'jabas'
  },
  {
    id: '20',
    name: 'HEINEKEN 600 ML JAVA',
    price: 0,
    priceSixPack: 11,
    priceCaja24: 0,
    priceJaba12: 22,
    image: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1771981334/ChatGPT_Image_Feb_24_2026_08_01_41_PM_t2rjgb.png',
    category: 'jabas'
  }
];

export const ACCOUNTS = [
  {
    id: 'pichincha',
    bank: 'Banco Pichincha',
    owner: 'Ronny Pozo Armijos',
    account: '2206437191',
    type: 'Ahorros',
    icon: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770866798/unnamed_zegejj.png'
  },
  {
    id: 'guayaquil',
    bank: 'Banco Guayaquil',
    owner: 'Ronny Pozo Armijos',
    account: '0054645142',
    type: 'Ahorros',
    icon: 'https://res.cloudinary.com/dyqz0n0to/image/upload/v1770866797/unnamed_x5lsu7.webp'
  }
];

export const WHATSAPP_NUMBER = '593968292249';

// Logo optimizado con Cloudinary para alta fidelidad (High Fidelity)
export const LOGO_URL = 'https://res.cloudinary.com/dyqz0n0to/image/upload/f_auto,q_auto:best,w_512,c_limit/v1770754520/WhatsApp_Image_2026-02-10_at_12.39.03_PM-modified_wifc2p.png';
