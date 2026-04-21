'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };

    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_TABLE':
      return { ...state, tableNumber: action.payload.number, floor: action.payload.floor };

    case 'SET_INSTRUCTIONS':
      return { ...state, specialInstructions: action.payload };

    case 'HYDRATE':
      return action.payload;

    default:
      return state;
  }
};

const initialState = {
  items: [],
  tableNumber: null,
  floor: null,
  specialInstructions: '',
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('core_cafe_cart');
      if (saved) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) });
      }
    } catch (e) {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('core_cafe_cart', JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  const addItem    = (item)                => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id)                  => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty  = (id, qty)             => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  const clearCart  = ()                    => dispatch({ type: 'CLEAR_CART' });
  const setTable   = (number, floor)       => dispatch({ type: 'SET_TABLE', payload: { number, floor } });
  const setInstructions = (text)           => dispatch({ type: 'SET_INSTRUCTIONS', payload: text });

  const total      = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount  = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      ...state, total, itemCount,
      addItem, removeItem, updateQty,
      clearCart, setTable, setInstructions,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
