import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from '../data/cart.js';
import { getProduct, loadProducts } from '../data/products.js';
import { formatCurrency } from '../utility/money.js';
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from '../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckOutHeader } from './checkoutHeader.js';

loadProducts();

const deliveryOptionHTML = (matchingProduct, cartItem) => {
  let html = '';

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = calculateDeliveryDate(deliveryOption);
    const priceString =
      deliveryOption.priceCents === 0
        ? 'FREE'
        : `${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
    <div class="delivery-option js-delivery-option  js-delivery-option-${
      matchingProduct.id
    }-${deliveryOption.id}"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
      <input type="radio"
        ${isChecked ? 'checked' : ''}
        class="delivery-option-input js-delivery-option-input-${
          matchingProduct.id
        }-${deliveryOption.id}"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          $${priceString} Shipping
        </div>
      </div>
    </div>
  `;
  });
  return html;
}

const generateCartItemHTML = (cartItem) => {
  const productId = cartItem.productId;
  const matchingProduct = getProduct(productId);
  const deliveryOptionId = cartItem.deliveryOptionId;
  const deliveryOption = getDeliveryOption(deliveryOptionId);
  const dateString = calculateDeliveryDate(deliveryOption);

  return `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">
        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity js-product-quantity-${
            matchingProduct.id
          }">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${
                matchingProduct.id
              }">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${
              matchingProduct.id
            }">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${
              matchingProduct.id
            } js-quantity-input" data-product-id="${matchingProduct.id}" />
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${
              matchingProduct.id
            }">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
              matchingProduct.id
            }" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
}

export const renderOrderSummary = () => {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    cartSummaryHTML += generateCartItemHTML(cartItem);
  });

  const orderSummaryElement = document.querySelector('.js-order-summary');
  if (orderSummaryElement) {
    orderSummaryElement.innerHTML = cartSummaryHTML;
  } else {
    console.error('Order summary element not found.');
  }
  setupEventListeners();
}
const setupEventListeners = () => {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', handleDeleteClick);
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', handleDeliveryOptionClick);
  });
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', handleUpdateClick);
  });
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', handleSaveClick);
  });
  document.querySelectorAll('.js-quantity-input').forEach((input) => {
    input.addEventListener('keydown', handleQuantityInputKeydown);
  });
}

const handleDeleteClick = (e) => {
  const productId = e.currentTarget.dataset.productId;
  removeFromCart(productId);
  renderOrderSummary();
  renderCheckOutHeader();
  renderPaymentSummary();
}

const handleDeliveryOptionClick = (e) => {
  const { productId, deliveryOptionId } = e.currentTarget.dataset;
  updateDeliveryOption(productId, deliveryOptionId);
  renderOrderSummary();
  renderPaymentSummary();
}

const handleUpdateClick = (e) => {
  const productId = e.currentTarget.dataset.productId;
  const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );
  container.classList.add('is-editing-quantity');
}
const handleSaveClick = (e) => {
  const productId = e.currentTarget.dataset.productId;
  const quantityInput = document.querySelector(
    `.js-quantity-input-${productId}`
  );
  const newQuantity = Number(quantityInput.value);

  if (newQuantity < 1 || newQuantity >= 1000) {
    alert('Quantity must be at least 1 and less than 1000');
    return;
  }

  updateQuantity(productId, newQuantity);

  const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );
  container.classList.remove('is-editing-quantity');

  renderCheckOutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}

const handleQuantityInputKeydown = (e) => {
  const productId = e.currentTarget.dataset.productId;
  if (e.key === 'Enter') {
    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 1 || newQuantity >= 1000) {
      alert('Quantity must be at least 1 and less than 1000');
      return;
    }

    updateQuantity(productId, newQuantity);
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.remove('is-editing-quantity');

    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;
    renderCheckOutHeader();
    renderPaymentSummary();
  }
}

renderOrderSummary();
