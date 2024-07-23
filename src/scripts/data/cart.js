import { validDeliveryOption } from './deliveryOption.js';

export let cart;

let addedMessageTimeoutIds = {};

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

const findMatchingItem = (productId) => {
  return cart.find((cartItem) => productId === cartItem.productId);
};

export const addToCart = (productId) => {
  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  const quantity = quantitySelector ? Number(quantitySelector.value) : 1;

  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

  if (addedMessage) {
    addedMessage.classList.add('added-to-cart-visible');

    if (addedMessageTimeoutIds[productId]) {
      clearTimeout(addedMessageTimeoutIds[productId]);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
      delete addedMessageTimeoutIds[productId];
    }, 1000);

    addedMessageTimeoutIds[productId] = timeoutId;
  }

  const matchingItem = findMatchingItem(productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1',
    });
  }
  saveToStorage();

  if (quantitySelector) quantitySelector.selectedIndex = 0;
};

export const removeFromCart = (productId) => {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
};

export const emptyCart = () => {
  cart = [];
  saveToStorage();
};

export const updateDeliveryOption = (productId, deliveryOptionId) => {
  const matchingItem = findMatchingItem(productId);

  if (!matchingItem || !validDeliveryOption(deliveryOptionId)) {
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
};

export const calculateCartQuantity = () => {
  return cart.reduce((total, cartItem) => (total += cartItem.quantity), 0);
};

export const updateQuantity = (productId, newQuantity) => {
  const matchingItem = findMatchingItem(productId);

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage();
  }
};
