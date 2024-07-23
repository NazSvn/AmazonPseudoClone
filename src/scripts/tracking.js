import { calculateCartQuantity } from './data/cart.js';
import { getOrder } from './data/orders.js';
import { getProduct, loadProducts } from './data/products.js';
import { dateFormat } from './utility/dateFormat.js';
import dayjs from 'dayjs';

import '../styles/shared/general.css';
import '../styles/shared/amazon-header.css';
import '../styles/pages/tracking.css';

loadProducts();

const renderTracking = () => {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  if (!order || !product) {
    console.error('Order or product not found.');
    return;
  }

  const productDetails = order.products.find(
    (details) => details.productId === product.id
  );

  if (!productDetails) {
    console.error('Product details not found in the order.');
    return;
  }

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = calculateProgress(orderTime, deliveryTime, today);

  const trackingHTMl = generateTrackingHTML(
    order,
    product,
    productDetails,
    percentProgress
  );

  document.querySelector('.js-main-tracking').innerHTML = trackingHTMl;
};

const calculateProgress = (orderTime, deliveryTime, today) => {
  return Math.floor(((today - orderTime) / (deliveryTime - orderTime)) * 100);
};

const generateTrackingHTML = (
  order,
  product,
  productDetails,
  percentProgress
) => {
  return `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        ${dateFormat(productDetails.estimatedDeliveryTime)}
      </div>

      <div class="product-info">
        ${product.name}
      </div>

      <div class="product-info">
        ${productDetails.quantity}
      </div>

      <img class="product-image" src="${product.image}">

      <div class="progress-labels-container">
        <div class="progress-label ${
          percentProgress < 50 ? 'current-status' : ''
        } ">
          Preparing
        </div>
        <div class="progress-label ${
          percentProgress >= 50 && percentProgress < 100 ? 'current-status' : ''
        } ">
          Shipped
        </div>
        <div class="progress-label ${
          percentProgress >= 100 ? 'current-status' : ''
        } ">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width:${percentProgress}%;"></div>
      </div>
    </div>`;
};

const updateCartQuantity = () => {
  const cartQuantity = calculateCartQuantity();
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  } else {
    console.error('Cart quantity element not found.');
  }
};
renderTracking();
updateCartQuantity();

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
