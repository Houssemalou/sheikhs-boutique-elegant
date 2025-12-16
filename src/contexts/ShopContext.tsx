import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ProductDTO, CartItem } from '@/models/types';

interface ShopState {
  cartItems: CartItem[];
  isCartOpen: boolean;
}

type ShopAction =
  | { type: 'ADD_TO_CART'; payload: { product: ProductDTO; quantity?: number; selectedColor?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: any }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: ShopState = {
  cartItems: [],
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
  addToCart: (product: ProductDTO, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: any) => void;
  updateQuantity: (productId: any, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

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
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sheikh-store-cart', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addToCart = (product: ProductDTO, quantity = 1, selectedColor?: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, selectedColor } });
    toast({
      title: '✓ Produit ajouté',
      description: product.name,
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: any, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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

  return (
    <ShopContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        getCartTotal,
        getCartItemsCount,
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