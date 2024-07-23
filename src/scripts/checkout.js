import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { renderCheckOutHeader } from './checkout/checkoutHeader.js';

import '../styles/shared/general.css';
import '../styles/pages/checkout/checkout-header.css';
import '../styles/pages/checkout/checkout.css';

renderCheckOutHeader();
renderOrderSummary();
renderPaymentSummary();
