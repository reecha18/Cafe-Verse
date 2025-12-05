// src/utils/cartStorage.js
export const CART_KEY = 'cafeverse-cart';

export function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
} 