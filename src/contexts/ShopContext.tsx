import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Language, Product } from '@/types';
import { toast } from '@/hooks/use-toast';

interface ShopState {
  cartItems: CartItem[];
  language: Language;
  isCartOpen: boolean;
}

type ShopAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number; selectedColor?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: ShopState = {
  cartItems: [],
  language: 'fr',
  isCartOpen: false,
};

function shopReducer(state: ShopState, action: ShopAction): ShopState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1, selectedColor } = action.payload;
      const existingItem = state.cartItems.find(
        item => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.product.id === product.id && item.selectedColor === selectedColor
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { product, quantity, selectedColor }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: [],
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    case 'SET_CART_OPEN':
      return {
        ...state,
        isCartOpen: action.payload,
      };
    case 'LOAD_CART':
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
}

interface ShopContextType extends ShopState {
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setLanguage: (language: Language) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  t: (key: string) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const translations = {
  fr: {
    'add-to-cart': 'Ajouter au panier',
    'view-cart': 'Voir le panier',
    'checkout': 'Passer la commande',
    'cart-empty': 'Votre panier est vide',
    'continue-shopping': 'Continuer vos achats',
    'remove': 'Supprimer',
    'quantity': 'Quantité',
    'total': 'Total',
    'electronics': 'Électronique',
    'cosmetics': 'Cosmétiques',
    'fashion': 'Mode',
    'home': 'Maison',
    'all-categories': 'Toutes catégories',
    'search': 'Rechercher...',
    'currency': 'DH',
    'in-stock': 'En stock',
    'out-of-stock': 'Rupture de stock',
    'free-shipping': 'Livraison gratuite',
    'fast-delivery': 'Livraison rapide',
    '24h-support': 'Support 24h/24',
    'easy-returns': 'Retours faciles',
    'product-added': 'Produit ajouté au panier',
  },
  ar: {
    'add-to-cart': 'أضف إلى السلة',
    'view-cart': 'عرض السلة',
    'checkout': 'الدفع',
    'cart-empty': 'سلتك فارغة',
    'continue-shopping': 'متابعة التسوق',
    'remove': 'إزالة',
    'quantity': 'الكمية',
    'total': 'المجموع',
    'electronics': 'الإلكترونيات',
    'cosmetics': 'مستحضرات التجميل',
    'fashion': 'الأزياء',
    'home': 'المنزل',
    'all-categories': 'جميع الفئات',
    'search': 'بحث...',
    'currency': 'درهم',
    'in-stock': 'متوفر',
    'out-of-stock': 'نفد من المخزون',
    'free-shipping': 'شحن مجاني',
    'fast-delivery': 'توصيل سريع',
    '24h-support': 'دعم ٢٤/٧',
    'easy-returns': 'إرجاع سهل',
    'product-added': 'تم إضافة المنتج إلى السلة',
  },
};

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sheikh-store-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    const savedLanguage = localStorage.getItem('sheikh-store-language') as Language;
    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sheikh-store-cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sheikh-store-language', state.language);
    document.documentElement.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.language);
  }, [state.language]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, selectedColor } });
    toast({
      title: translations[state.language]['product-added'],
      description: product.name[state.language],
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  };

  const getCartTotal = () => {
    return state.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return state.cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const t = (key: string) => {
    return translations[state.language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <ShopContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setLanguage,
        toggleCart,
        setCartOpen,
        getCartTotal,
        getCartItemsCount,
        t,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}