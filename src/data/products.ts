import { Product } from '@/types';
import phoneImage from '@/assets/phone-1.jpg';
import cosmeticsImage from '@/assets/cosmetics-1.jpg';
import laptopImage from '@/assets/laptop-1.jpg';
import handbagImage from '@/assets/handbag-1.jpg';

export const products: Product[] = [
  // Electronics
  {
    id: '1',
    name: {
      fr: 'iPhone 15 Pro',
      ar: 'آيفون 15 برو'
    },
    description: {
      fr: 'Le dernier iPhone avec puce A17 Pro, caméra avancée et design en titane',
      ar: 'أحدث آيفون مع شريحة A17 Pro وكاميرا متقدمة وتصميم من التيتانيوم'
    },
    price: 12999,
    originalPrice: 13999,
    image: phoneImage,
    category: 'electronics',
    inStock: true,
    rating: 4.8,
    reviews: 1245,
    colors: ['Noir', 'Blanc', 'Bleu', 'Or'],
    specifications: {
      'Écran': '6.1" Super Retina XDR',
      'Processeur': 'A17 Pro',
      'Stockage': '128GB',
      'Caméra': '48MP Principal + 12MP Ultra Wide'
    }
  },
  {
    id: '2',
    name: {
      fr: 'MacBook Pro 14"',
      ar: 'ماك بوك برو 14 بوصة'
    },
    description: {
      fr: 'Puissant ordinateur portable avec puce M3 Pro pour les professionnels',
      ar: 'حاسوب محمول قوي مع شريحة M3 Pro للمحترفين'
    },
    price: 24999,
    image: laptopImage,
    category: 'electronics',
    inStock: true,
    rating: 4.9,
    reviews: 856,
    colors: ['Gris Sidéral', 'Argent'],
    specifications: {
      'Écran': '14.2" Liquid Retina XDR',
      'Processeur': 'Apple M3 Pro',
      'Mémoire': '16GB RAM',
      'Stockage': '512GB SSD'
    }
  },
  // Cosmetics
  {
    id: '3',
    name: {
      fr: 'Sérum Anti-Âge Premium',
      ar: 'سيروم مضاد للشيخوخة بريميوم'
    },
    description: {
      fr: 'Sérum concentré avec acide hyaluronique et vitamine C pour une peau jeune',
      ar: 'سيروم مركز مع حمض الهيالورونيك وفيتامين C لبشرة شابة'
    },
    price: 459,
    originalPrice: 599,
    image: cosmeticsImage,
    category: 'cosmetics',
    inStock: true,
    rating: 4.7,
    reviews: 2103,
    specifications: {
      'Volume': '30ml',
      'Ingrédients': 'Acide Hyaluronique, Vitamine C, Peptides',
      'Type de peau': 'Tous types',
      'Utilisation': 'Matin et soir'
    }
  },
  // Fashion
  {
    id: '4',
    name: {
      fr: 'Sac à Main Cuir Premium',
      ar: 'حقيبة يد جلدية فاخرة'
    },
    description: {
      fr: 'Élégant sac à main en cuir véritable avec finitions dorées',
      ar: 'حقيبة يد أنيقة من الجلد الطبيعي مع لمسات ذهبية'
    },
    price: 899,
    originalPrice: 1199,
    image: handbagImage,
    category: 'fashion',
    inStock: true,
    rating: 4.6,
    reviews: 445,
    colors: ['Beige', 'Noir', 'Marron', 'Rouge'],
    specifications: {
      'Matière': 'Cuir véritable',
      'Dimensions': '30 x 25 x 12 cm',
      'Fermeture': 'Fermeture éclair',
      'Compartiments': '3 compartiments'
    }
  },
  // Additional products to demonstrate 4 per row layout
  {
    id: '5',
    name: {
      fr: 'Smartphone Galaxy S24',
      ar: 'هاتف جالاكسي S24'
    },
    description: {
      fr: 'Smartphone Android haut de gamme avec IA intégrée',
      ar: 'هاتف أندرويد متطور مع ذكاء اصطناعي مدمج'
    },
    price: 8999,
    image: phoneImage,
    category: 'electronics',
    inStock: true,
    rating: 4.5,
    reviews: 892,
    colors: ['Phantom Black', 'Cream', 'Violet', 'Green']
  },
  {
    id: '6',
    name: {
      fr: 'iPad Air 11"',
      ar: 'آيباد إير 11 بوصة'
    },
    description: {
      fr: 'Tablette performante pour créativité et productivité',
      ar: 'جهاز لوحي عالي الأداء للإبداع والإنتاجية'
    },
    price: 6999,
    image: laptopImage,
    category: 'electronics',
    inStock: true,
    rating: 4.7,
    reviews: 634,
    colors: ['Space Grey', 'Silver', 'Pink', 'Blue']
  },
  {
    id: '7',
    name: {
      fr: 'Écouteurs AirPods Pro',
      ar: 'سماعات إيربودز برو'
    },
    description: {
      fr: 'Écouteurs sans fil avec réduction de bruit active',
      ar: 'سماعات لاسلكية مع إلغاء الضوضاء النشط'
    },
    price: 2899,
    image: phoneImage,
    category: 'electronics',
    inStock: false,
    rating: 4.8,
    reviews: 1567,
    colors: ['White']
  },
  {
    id: '8',
    name: {
      fr: 'Apple Watch Series 9',
      ar: 'ساعة أبل سيريس 9'
    },
    description: {
      fr: 'Montre connectée avec suivi santé avancé',
      ar: 'ساعة ذكية مع مراقبة صحية متقدمة'
    },
    price: 4299,
    image: phoneImage,
    category: 'electronics',
    inStock: true,
    rating: 4.6,
    reviews: 923,
    colors: ['Midnight', 'Starlight', 'Silver', 'Product Red']
  }
];

export const categories = [
  { id: 'all', name: { fr: 'Toutes catégories', ar: 'جميع الفئات' } },
  { id: 'electronics', name: { fr: 'Électronique', ar: 'الإلكترونيات' } },
  { id: 'cosmetics', name: { fr: 'Cosmétiques', ar: 'مستحضرات التجميل' } },
  { id: 'fashion', name: { fr: 'Mode', ar: 'الأزياء' } },
  { id: 'home', name: { fr: 'Maison', ar: 'المنزل' } }
];