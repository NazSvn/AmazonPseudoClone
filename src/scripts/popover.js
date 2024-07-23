import '../styles/pages/popover.css';
export const popover = (product, container) => {
  const popover = `  
    <div class="popover-wrapper">
      <div class="popover-inner">
        <div class="popover-rating-container">
          <div class="popover-rating-stars-container">
            <img class="popover-rating-stars" src=${product.getStarsUrl()} alt="stars">
            <span class="popover-rating-stars-count">
              ${product.getAverageRating()} out of 5
            </span>
          </div>
          <div class="popover-global-rating">
            ${product.rating.count} global ratings
          </div>
          <button class="popover-button js-popover-button">
            <img src="assets/icons/closeIcon.png" alt="closeIcon"></button>
        </div>
        <div class="popover-rating-count-container">
          ${[5, 4, 3, 2, 1]
            .map(
              (star) =>
                `<div class="popover-rating-count js-popover-rating-count" data-id="${star}">
            <div>
              <span>${star} star</span>
            </div>
            
              <div class="meter" role="progressbar">
                <div class="meter-bar meter-filled" style="width: ${
                  product.rating.percentage[star] || 0
                }%;"></div>
              </div>
            
            <div class="popover-rating-percentage">
              <span>${product.rating.percentage[star] || '0'}%</span>
            </div>
          </div>`
            )
            .join('')}
        </div>
        <hr class="popover-divider">
        <div class="popover-customer-review"><a href="">See customer reviews</a>
        </div>
        <div class="arrow-border" id="arrow-border-${
          product.id
        }" style="left: 175px;">
          <div class="arrow"></div>
        </div>
      </div>
    </div> 
         </div>
   `;
  container.innerHTML = popover;
}
