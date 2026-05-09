"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/* ─── Types ──────────────────────────────────────────────────── */
export interface JewelryProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  mainImage: string;
  transparentImage?: string;
}

export interface CartItem {
  product: JewelryProduct;
  quantity: number;
}

/* ─── LocalStorage helpers ───────────────────────────────────── */
const CART_KEY = 'mezor_cart';
const FAVS_KEY = 'mezor_favorites';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full — silently ignore
  }
}

/* ─── Cart Store ─────────────────────────────────────────────── */
let cartListeners: Array<() => void> = [];
let cartSnapshot: CartItem[] = loadFromStorage<CartItem[]>(CART_KEY, []);

function emitCart() {
  saveToStorage(CART_KEY, cartSnapshot);
  cartListeners.forEach((l) => l());
}

function subscribeCart(listener: () => void) {
  cartListeners.push(listener);
  return () => {
    cartListeners = cartListeners.filter((l) => l !== listener);
  };
}

function getCartSnapshot() {
  return cartSnapshot;
}

export function addToCart(product: JewelryProduct, qty = 1) {
  const existing = cartSnapshot.find((c) => c.product._id === product._id);
  if (existing) {
    cartSnapshot = cartSnapshot.map((c) =>
      c.product._id === product._id ? { ...c, quantity: c.quantity + qty } : c,
    );
  } else {
    cartSnapshot = [...cartSnapshot, { product, quantity: qty }];
  }
  emitCart();
}

export function removeFromCart(productId: string) {
  cartSnapshot = cartSnapshot.filter((c) => c.product._id !== productId);
  emitCart();
}

export function updateCartQty(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  cartSnapshot = cartSnapshot.map((c) =>
    c.product._id === productId ? { ...c, quantity } : c,
  );
  emitCart();
}

export function clearCart() {
  cartSnapshot = [];
  emitCart();
}

export function useCart() {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, () => []);
  const totalItems = items.reduce((s, c) => s + c.quantity, 0);
  const subtotal = items.reduce((s, c) => s + c.product.price * c.quantity, 0);
  return { items, totalItems, subtotal };
}

/* ─── Favorites Store ────────────────────────────────────────── */
let favListeners: Array<() => void> = [];
let favSnapshot: string[] = loadFromStorage<string[]>(FAVS_KEY, []);

function emitFav() {
  saveToStorage(FAVS_KEY, favSnapshot);
  favListeners.forEach((l) => l());
}

function subscribeFav(listener: () => void) {
  favListeners.push(listener);
  return () => {
    favListeners = favListeners.filter((l) => l !== listener);
  };
}

function getFavSnapshot() {
  return favSnapshot;
}

export function toggleFavorite(productId: string) {
  if (favSnapshot.includes(productId)) {
    favSnapshot = favSnapshot.filter((id) => id !== productId);
  } else {
    favSnapshot = [...favSnapshot, productId];
  }
  emitFav();
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribeFav, getFavSnapshot, () => []);
  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);
  return { favoriteIds: ids, isFavorite };
}
