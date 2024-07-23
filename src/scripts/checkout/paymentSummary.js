import { cart, calculateCartQuantity, emptyCart } from '../data/cart.js';
import { getProduct } from '../data/products.js';
import { getDeliveryOption } from '../data/deliveryOption.js';
import { formatCurrency } from '../utility/money.js';
import { addOrder } from '../data/orders.js';

export const renderPaymentSummary = () => {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${calculateCartQuantity()}):</div>
      <div class="payment-summary-money ">$${formatCurrency(
        productPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">$${formatCurrency(
        shippingPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(
        totalBeforeTaxCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">$${formatCurrency(
        totalCents
      )}</div>
    </div>

    <button class="place-order-button js-place-order-button button-primary">
      Place your order
    </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  setupPlaceOrderButton();
}

const setupPlaceOrderButton = () => {
  document
    .querySelector('.js-place-order-button')
    .addEventListener('click', async () => {
      if (cart.length > 0) {
        try {
          const response = await fetch(
            'https://supersimplebackend.dev/orders',
            {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                cart: cart,
              }),
            }
          );
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }
          const order = await response.json();
          addOrder(order);
          emptyCart();
          window.location.href = 'orders.html';
        } catch (error) {
          console.error(
            'There was an error placing the order. Please try again later.',
            error
          );
        }
      }
    });
}
