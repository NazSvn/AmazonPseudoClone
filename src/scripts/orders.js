import { orders } from './data/orders.js';
import { formatCurrency } from './utility/money.js';
import { dateFormat } from './utility/dateFormat.js';
import { getProduct, loadProducts } from './data/products.js';
import { addToCart, calculateCartQuantity } from './data/cart.js';

import '../styles/shared/general.css';
import '../styles/shared/amazon-header.css';
import '../styles/pages/orders.css';

loadProducts();

const generateOrdersHTML = (order) => {
  return `
    <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${dateFormat(order.orderTime)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${order.products
              .map((orderProduct) => {
                const product = getProduct(orderProduct.productId);
                return generateOrderProductHTML(
                  product,
                  orderProduct,
                  order.id
                );
              })
              .join('')} 
          </div>
        </div>`;
};

const generateOrderProductHTML = (product, orderProduct, orderId) => {
  return `
  <div class="product-image-container"><img src="${product.image}"></div>
    <div class="product-details">
    <div class="product-name">
      ${product.name}
    </div>
    <div class="product-delivery-date">
      ${dateFormat(orderProduct.estimatedDeliveryTime)}
    </div>
    <div class="product-quantity">
      Quantity: ${orderProduct.quantity}
    </div>
    <button class="buy-again-button js-buy-again-button button-primary" data-product-id="${
      product.id
    }">
      <img class="buy-again-icon " src="assets/icons/buy-again.png">
      <span class="buy-again-message">Buy it again</span> 
    </button>
  </div>

  <div class="product-actions">
    <a href="tracking.html?orderId=${orderId}&productId=${product.id}">
      <button class="track-package-button button-secondary">
        Track package
      </button>
    </a>
  </div>`;
};

const renderOrders = () => {
  const ordersHTML = orders.map(generateOrdersHTML).join('');
  const ordersGridElement = document.querySelector('.js-orders-grid');
  if (ordersGridElement) {
    ordersGridElement.innerHTML = ordersHTML;
  } else {
    console.error('Orders grid element not found.');
  }
}

const handleBuyAgainClick = (e) => {
  const button = e.target.closest('.js-buy-again-button');
  if (button) {
    const productId = button.dataset.productId;
    addToCart(productId);

    button.innerHTML =
      '<div class="added-to-cart"><img src="assets/icons/checkmark.png"><span ">Added</span></div>';
    setTimeout(() => {
      button.innerHTML = `
          <img class="buy-again-icon" src="assets/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
    }, 1000);
    updateCartQuantity();
  }
}

const updateCartQuantity = () => {
  const cartQuantity = calculateCartQuantity();
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  } else {
    console.error('Cart quantity element not found.');
  }
}

renderOrders();
updateCartQuantity();

document
  .querySelector('.js-orders-grid')
  .addEventListener('click', handleBuyAgainClick);

document.querySelector('.js-search-button').addEventListener('click', () => {
  handleSearchEvent();
});

document.querySelector('.js-search-bar').addEventListener('keydown', (e) => {
  e.key === 'Enter' && handleSearchEvent();
});

const handleSearchEvent = () => {
  const search = document.querySelector('.js-search-bar').value;
  window.location.href = `index.html?search=${search}`;
  document.querySelector('.js-search-bar').innerHTML = '';
};
