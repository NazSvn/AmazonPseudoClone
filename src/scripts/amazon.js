import { addToCart, calculateCartQuantity } from './data/cart.js';
import {
  getProduct,
  products,
  saveProducts,
  loadProducts,
} from './data/products.js';
import { popover } from './popover.js';
import { handleSearch } from './utility/search.js';

import '../styles/shared/general.css';
import '../styles/shared/amazon-header.css';
import '../styles/pages/amazon.css';

const generateProductHTML = (product) => {
  return `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars js-product-rating-stars"
          src="${product.getStarsUrl()}" data-product-id="${product.id}">
        <div class="product-rating-count js-product-rating-count-${
          product.id
        } link-primary ">
          ${product.rating.count}
        </div>
        <div class="popover js-popover js-popover-${product.id}">
        </div>        
      </div> 

      <div class="product-price">
        $${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          ${[...Array(10).keys()]
            .map((i) => `<option value="${i + 1}">${i + 1}</option>`)
            .join('')}
        </select>
        <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="assets/icons/checkmark.png">
        Added
      </div>
      </div>

      <div class="product-spacer"></div> 

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
    `;
};

const filterProducts = (searchTerm) => {
  return products.filter((product) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (product.keywords &&
        product.keywords.some((keyword) =>
          keyword.toLowerCase().includes(lowerCaseSearchTerm)
        ))
    );
  });
};

const renderProducts = () => {
  const searchTerm = handleSearch();
  const filteredProducts = searchTerm ? filterProducts(searchTerm) : products;

  if (filteredProducts.length === 0) {
    document.querySelector(
      '.js-products-grid'
    ).innerHTML = `<div class="no-results">No products matched your search.</div>`;
  } else {
    const productsHTML = filteredProducts.map(generateProductHTML).join('');
    document.querySelector('.js-products-grid').innerHTML = productsHTML;
  }
};

loadProducts();
renderProducts();

const updateCartQuantity = () => {
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
};

updateCartQuantity();

document
  .querySelector('.js-products-grid')
  .addEventListener('click', (event) => {
    const button = event.target.closest('.js-add-to-cart');
    if (button) {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
    }
  });

const adjustPopoverPosition = (star, popoverElement, product) => {
  const popoverRect = popoverElement.getBoundingClientRect();
  const starRect = star.getBoundingClientRect();
  let left;

  if (starRect.left < 100) {
    left = -40;
    if (popoverElement.classList.contains('popover-visible')) {
      document.getElementById(`arrow-border-${product.id}`).style.left =
        '100px';
    }
  } else if (popoverRect.right > window.innerWidth) {
    left = window.innerWidth - popoverRect.right - 120;
  }

  popoverElement.style.left = `${left}px`;
};

const handleStarMouseover = (star, popoverElement, product) => {
  star.addEventListener('mouseover', () => {
    popoverElement.classList.add('popover-visible');
    popover(product, popoverElement);
    adjustPopoverPosition(star, popoverElement, product);
  });
};

const handleStarMouseout = (star, popoverElement) => {
  star.addEventListener('mouseout', (e) => {
    if (!popoverElement.contains(e.relatedTarget)) {
      popoverElement.classList.remove('popover-visible');
    }
  });
};

const handlePopoverElementEvents = (star, popoverElement) => {
  popoverElement.addEventListener('mouseover', () => {
    popoverElement.classList.add('popover-visible');
  });

  popoverElement.addEventListener('mouseout', (event) => {
    if (!star.contains(event.relatedTarget)) {
      popoverElement.classList.remove('popover-visible');
    }
  });
};

document.querySelectorAll('.js-product-rating-stars').forEach((star) => {
  const productId = star.dataset.productId;
  const popoverElement = document.querySelector(`.js-popover-${productId}`);
  const product = getProduct(productId);

  window.addEventListener('resize', () => {
    adjustPopoverPosition(star, popoverElement, product);
  });

  popoverElement.addEventListener('click', (event) => {
    const target = event.target.closest('.js-popover-rating-count');
    if (target) {
      const ratingValue = parseInt(target.dataset.id);
      product.rating.userRating.push(ratingValue);
      product.rating.count += 1;
      getRatingPercentage(product);
      popover(product, popoverElement);
      product.getAverageRating();
      saveProducts();
      updateStarsImage(productId);
      updateRatingCount(productId);
    }
    const closeButton = event.target.closest('.popover-button');
    if (closeButton) {
      popoverElement.classList.remove('popover-visible');
    }
  });

  handleStarMouseover(star, popoverElement, product);
  handleStarMouseout(star, popoverElement);
  handlePopoverElementEvents(star, popoverElement);
});

const updateStarsImage = (productId) => {
  const product = getProduct(productId);
  const starsImage = document.querySelector(
    `img[data-product-id="${productId}"]`
  );
  starsImage.src = product.getStarsUrl();
};

const updateRatingCount = (productId) => {
  const product = getProduct(productId);
  const ratingCountElement = document.querySelector(
    `.js-product-rating-count-${productId}`
  );
  ratingCountElement.innerHTML = product.rating.count;
};

const getRatingPercentage = (product) => {
  const userRating = product.rating.userRating;

  const ratingCounts = userRating.reduce((acc, rating) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});
  const totalRatings = userRating.length;
  const ratingPercentages = {};

  for (let rating in ratingCounts) {
    ratingPercentages[rating] = Math.round(
      (ratingCounts[rating] / totalRatings) * 100
    );
  }
  product.rating.percentage = ratingPercentages;
};

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
