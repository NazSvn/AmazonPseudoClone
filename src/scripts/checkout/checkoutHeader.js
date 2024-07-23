import { calculateCartQuantity } from '../data/cart.js';

export const renderCheckOutHeader = () =>  {
  const cartQuantity = calculateCartQuantity();

  const checkoutHeaderHTML = `
    <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html">
          <img class="amazon-logo" src="assets/amazon-logo.png">
          <img class="amazon-mobile-logo" src="assets/amazon-mobile-logo.png">
        </a>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (<a class="return-to-home-link"
          href="index.html">${cartQuantity}</a>)
      </div>

      <div class="checkout-header-right-section">
        <img src="assets/icons/checkout-lock-icon.png">
      </div>
  `;
  const checkoutHeaderElement = document.querySelector('.js-checkout-header');
  if (checkoutHeaderElement) {
    checkoutHeaderElement.innerHTML = checkoutHeaderHTML;
  } else {
    console.error('Checkout header element not found');
  }
}
