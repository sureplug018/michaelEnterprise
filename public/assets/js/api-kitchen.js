////////////////////////////////////////
// alerts
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.classList.remove('show');
    el.classList.add('hide');

    // Remove the element from the DOM after the fade-out animation
    el.addEventListener('animationend', () => {
      el.remove();
    });
  }
};

const showAlert = (type, msg) => {
  hideAlert(); // Ensure no existing alert is visible

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  const alertElement = document.querySelector('.alert');
  if (alertElement) {
    // Trigger the drop-down effect and make it visible
    alertElement.classList.add('show');

    // Hide the alert after 5 seconds
    window.setTimeout(hideAlert, 5000);
  }
};

// For the modal "Add to Cart" button
document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      const res = await axios.get(
        `/api/v1/proteins/find-proteins?productId=${encodeURIComponent(productId)}`,
      );

      if (res.status === 200) {
        const product = res.data.data.product;
        console.log(product);

        if (product.proteins.length <= 0) {
          // Send a POST request to the backend to add the product to the cart
          const firstResponse = await axios.post(
            `/api/v1/carts/add-to-cart/${productId}`,
          );
          if (firstResponse.data.status === 'success') {
            // Handle success message or any further actions after successful approval
            showAlert('success', 'Cart successfully updated!');
            button.style.opacity = '1';
            button.disabled = false;
            // document.getElementById(productId).value += 1;
            document.querySelector('.floating-cart').removeAttribute('hidden');
          }
        } else if (product.proteins.length >= 1) {
          button.style.opacity = '1';
          button.disabled = false;
          const proteinModal = document.getElementById('proteinModal');
          proteinModal.style.display = 'block';

          const modalAddToCartBtn = document.querySelector(
            '.add-to-cart-with-protein-btn',
          );

          modalAddToCartBtn.dataset.productId = productId;

          const productPrice = product.price;

          let totalSpan = document.querySelector('.protein-total p span');

          totalSpan.textContent = productPrice;

          const modalImage = document.querySelector('.modal-image-src');

          modalImage.src = product.imageCover;

          const modalDescription = document.querySelector('.modal-description');

          modalDescription.textContent = product.description;

          const productName = document.querySelector('.modal-product-name');

          productName.textContent = product.name;

          const modalUrl = document.querySelector('.modal-image-url');

          modalUrl.href = `/michael-kitchen/item/${product.categorySlug}/${product.slug}`;

          const modalName = document.querySelector('.modal-name-url');

          modalName.href = `/michael-kitchen/item/${product.categorySlug}/${product.slug}`;

          const proteinList = document.getElementById('proteinList');
          proteinList.innerHTML = '';
          product.proteins.forEach((protein, index) => {
            const proteinRow = document.createElement('div');
            proteinRow.style.display = 'flex';
            proteinRow.classList.add('protein-div');
            proteinRow.style.justifyContent = 'space-between';
            proteinRow.style.alignItems = 'center';
            proteinRow.style.marginBottom = '15px';
            proteinRow.style.padding = '10px 0';

            proteinRow.innerHTML = `
              <div style="flex: 1;" class="proteins">
                <img src="${protein.paymentProof}" alt="${protein.name}" loading="eager" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
              </div>
              <div style="flex: 2; padding-left: 10px;">
                <h4 name="protein-name" style="margin: 0;">${protein.name}</h4>
                <p name="protein-price" style="margin: 0;">₽${protein.price}</p>
              </div>
              <div style="flex: 1; display: flex; align-items: center;">
                <button id="minus-protein-${index}" style="padding: 5px 10px; background-color: #5f1303; color: white; border: none; border-radius: 5px;">-</button>
                <input name="protein-quantity" id="protein-qty-${index}" type="text" value="0" readonly style="width: 40px; text-align: center; margin: 0 10px;">
                <button id="plus-protein-${index}" style="padding: 5px 10px; background-color: #5f1303; color: white; border: none; border-radius: 5px;">+</button>
              </div>
            `;

            proteinList.appendChild(proteinRow);

            const minusProteinBtn = document.getElementById(
              `minus-protein-${index}`,
            );
            const plusProteinBtn = document.getElementById(
              `plus-protein-${index}`,
            );
            const input = document.getElementById(`protein-qty-${index}`);
            let currentQuantity = parseInt(input.value);

            minusProteinBtn.addEventListener('click', () => {
              if (currentQuantity > 0) {
                currentQuantity -= 1;
                input.value = currentQuantity;
                let total = parseInt(totalSpan.textContent);
                total -= protein.price;
                totalSpan.textContent = total;
              }
            });

            plusProteinBtn.addEventListener('click', () => {
              currentQuantity += 1;
              input.value = currentQuantity;
              let total = parseInt(totalSpan.textContent);
              total += protein.price;
              totalSpan.textContent = total;
            });
          });

          const lastBtn = document.querySelector(
            '.add-to-cart-with-protein-btn',
          );

          if (lastBtn) {
            lastBtn.addEventListener('click', async (e) => {
              e.preventDefault();

              lastBtn.style.opacity = '0.5';
              lastBtn.textContent = 'Processing...';
              lastBtn.disabled = true;

              const proteinsArray = Array.from(
                document.querySelectorAll('.protein-div'),
              )
                .map((proteinDiv) => {
                  const name = proteinDiv.querySelector(
                    '[name="protein-name"]',
                  ).textContent;
                  const quantity = proteinDiv.querySelector(
                    '[name="protein-quantity"]',
                  ).value;
                  const price = proteinDiv
                    .querySelector('[name="protein-price"]')
                    .textContent.replace('₽', '');

                  // Include the protein only if the quantity is greater than 0
                  if (parseInt(quantity, 10) > 0) {
                    return {
                      name,
                      quantity: parseInt(quantity, 10),
                      price: parseFloat(price),
                    };
                  }
                  return null; // Exclude proteins with a quantity of 0
                })
                .filter(Boolean); // Remove null values

              console.log(proteinsArray);

              const info = {
                proteins: proteinsArray,
              };

              try {
                const finalAddToCartResponse = await axios.post(
                  `/api/v1/carts/add-to-cart-with-protein/${productId}`,
                  info,
                );

                if (finalAddToCartResponse.data.status === 'success') {
                  // Handle success message or any further actions after successful approval
                  showAlert('success', 'Cart successfully updated!');
                  button.style.opacity = '1';
                  button.disabled = false;
                  lastBtn.style.opacity = '1';
                  lastBtn.textContent = 'Add To Cart';
                  lastBtn.disabled = false;
                  // document.getElementById(productId).value += 1;
                  document
                    .querySelector('.floating-cart')
                    .removeAttribute('hidden');

                  window.setTimeout(() => {
                    location.reload();
                  }, 3000);
                }
              } catch (err) {
                console.log(err);
                // Handle err
                showAlert(
                  'error',
                  err.response
                    ? err.response.data.message
                    : 'Something went wrong',
                );

                button.style.opacity = '1';
                button.disabled = false;
                lastBtn.style.opacity = '1';
                lastBtn.textContent = 'Add To Cart';
                lastBtn.disabled = false;
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error occurred:', error); // Log the full error object for debugging
      const message =
        error.response?.data?.message || 'An unexpected error occurred';
      showAlert('error', message);
      button.style.opacity = '1';
      button.disabled = false;
    }
  });
});

const singleProduct = document.querySelector('.single-add-to-cart-btn');

if (singleProduct) {
  singleProduct.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    singleProduct.style.opacity = '0.5';
    singleProduct.disabled = true;

    try {
      const res = await axios.get(
        `/api/v1/proteins/find-proteins?productId=${encodeURIComponent(productId)}`,
      );

      if (res.status === 200) {
        const product = res.data.data.product;

        if (product.proteins.length <= 0) {
          // Perform the API call
          const response = await axios.patch(
            `/api/v1/carts/increase-quantity/${productId}`,
          );

          if (response.data.status === 'success') {
            // Handle success
            showAlert('success', 'Product added to cart!');
            singleProduct.style.opacity = '1';
            singleProduct.disabled = false;
            document
              .querySelector('.minus-cart-btn-single')
              .removeAttribute('hidden');
            document.querySelector('.floating-cart').removeAttribute('hidden');
            let count = (document.getElementById(productId).value =
              parseInt(document.getElementById(productId).value, 10) + 1);
          } else {
            // Handle error
            console.log(response.data);
            showAlert('error', 'Something went wrong');
            singleProduct.style.opacity = '1';
            singleProduct.disabled = false;
          }
        } else if (product.proteins.length >= 1) {
          singleProduct.style.opacity = '1';
          singleProduct.disabled = false;
          const proteinModal = document.getElementById('proteinModal');
          proteinModal.style.display = 'block';

          const modalAddToCartBtn = document.querySelector(
            '.add-to-cart-with-protein-btn',
          );

          modalAddToCartBtn.dataset.productId = productId;

          const productPrice = product.price;

          let totalSpan = document.querySelector('.protein-total p span');

          totalSpan.textContent = productPrice;

          const modalImage = document.querySelector('.modal-image-src');

          modalImage.src = product.imageCover;

          const modalDescription = document.querySelector('.modal-description');

          modalDescription.textContent = product.description;

          const productName = document.querySelector('.modal-product-name');

          productName.textContent = product.name;

          const modalUrl = document.querySelector('.modal-image-url');

          modalUrl.href = `/michael-kitchen/item/${product.categorySlug}/${product.slug}`;

          const modalName = document.querySelector('.modal-name-url');

          modalName.href = `/michael-kitchen/item/${product.categorySlug}/${product.slug}`;

          const proteinList = document.getElementById('proteinList');
          proteinList.innerHTML = '';
          product.proteins.forEach((protein, index) => {
            const proteinRow = document.createElement('div');
            proteinRow.style.display = 'flex';
            proteinRow.classList.add('protein-div');
            proteinRow.style.justifyContent = 'space-between';
            proteinRow.style.alignItems = 'center';
            proteinRow.style.marginBottom = '15px';
            proteinRow.style.padding = '10px 0';

            proteinRow.innerHTML = `
              <div style="flex: 1;" class="proteins">
                <img src="${protein.paymentProof}" alt="${protein.name}" loading="eager" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
              </div>
              <div style="flex: 2; padding-left: 10px;">
                <h4 name="protein-name" style="margin: 0;">${protein.name}</h4>
                <p name="protein-price" style="margin: 0;">₽${protein.price}</p>
              </div>
              <div style="flex: 1; display: flex; align-items: center;">
                <button id="minus-protein-${index}" style="padding: 5px 10px; background-color: #5f1303; color: white; border: none; border-radius: 5px;">-</button>
                <input name="protein-quantity" id="protein-qty-${index}" type="text" value="0" readonly style="width: 40px; text-align: center; margin: 0 10px;">
                <button id="plus-protein-${index}" style="padding: 5px 10px; background-color: #5f1303; color: white; border: none; border-radius: 5px;">+</button>
              </div>
            `;

            proteinList.appendChild(proteinRow);

            const minusProteinBtn = document.getElementById(
              `minus-protein-${index}`,
            );
            const plusProteinBtn = document.getElementById(
              `plus-protein-${index}`,
            );
            const input = document.getElementById(`protein-qty-${index}`);
            let currentQuantity = parseInt(input.value);

            minusProteinBtn.addEventListener('click', () => {
              if (currentQuantity > 0) {
                currentQuantity -= 1;
                input.value = currentQuantity;
                let total = parseInt(totalSpan.textContent);
                total -= protein.price;
                totalSpan.textContent = total;
              }
            });

            plusProteinBtn.addEventListener('click', () => {
              currentQuantity += 1;
              input.value = currentQuantity;
              let total = parseInt(totalSpan.textContent);
              total += protein.price;
              totalSpan.textContent = total;
            });
          });

          const lastBtn = document.querySelector(
            '.add-to-cart-with-protein-btn',
          );

          if (lastBtn) {
            lastBtn.addEventListener('click', async (e) => {
              e.preventDefault();

              lastBtn.style.opacity = '0.5';
              lastBtn.textContent = 'Processing...';
              lastBtn.disabled = true;

              const proteinsArray = Array.from(
                document.querySelectorAll('.protein-div'),
              )
                .map((proteinDiv) => {
                  const name = proteinDiv.querySelector(
                    '[name="protein-name"]',
                  ).textContent;
                  const quantity = proteinDiv.querySelector(
                    '[name="protein-quantity"]',
                  ).value;
                  const price = proteinDiv
                    .querySelector('[name="protein-price"]')
                    .textContent.replace('₽', '');

                  // Include the protein only if the quantity is greater than 0
                  if (parseInt(quantity, 10) > 0) {
                    return {
                      name,
                      quantity: parseInt(quantity, 10),
                      price: parseFloat(price),
                    };
                  }
                  return null; // Exclude proteins with a quantity of 0
                })
                .filter(Boolean); // Remove null values

              console.log(proteinsArray);

              const info = {
                proteins: proteinsArray,
              };

              try {
                const finalAddToCartResponse = await axios.post(
                  `/api/v1/carts/add-to-cart-with-protein/${productId}`,
                  info,
                );

                if (finalAddToCartResponse.data.status === 'success') {
                  // Handle success message or any further actions after successful approval
                  showAlert('success', 'Cart successfully updated!');
                  singleProduct.style.opacity = '1';
                  singleProduct.disabled = false;
                  lastBtn.style.opacity = '1';
                  lastBtn.textContent = 'Add To Cart';
                  lastBtn.disabled = false;
                  // document.getElementById(productId).value += 1;
                  document
                    .querySelector('.floating-cart')
                    .removeAttribute('hidden');

                  window.setTimeout(() => {
                    location.reload();
                  }, 3000);
                }
              } catch (err) {
                console.log(err);
                // Handle err
                showAlert(
                  'error',
                  err.response
                    ? err.response.data.message
                    : 'Something went wrong',
                );

                singleProduct.style.opacity = '1';
                singleProduct.disabled = false;
                lastBtn.style.opacity = '1';
                lastBtn.textContent = 'Add To Cart';
                lastBtn.disabled = false;
              }
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
      // Handle error
      showAlert(
        'error',
        error.response ? error.response.data.message : 'Something went wrong',
      );
      singleProduct.style.opacity = '1';
      singleProduct.disabled = false;
    }
  });
}

const singleMinus = document.querySelector('.minus-cart-btn-single');

if (singleMinus) {
  singleMinus.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      // Perform the API call
      const response = await axios.patch(
        `/api/v1/carts/decrease-quantity/${productId}`,
      );

      if (response.data.status === 'success') {
        // Handle success
        showAlert('success', 'Product added to cart!');
        singleMinus.style.opacity = '1';
        singleMinus.disabled = false;

        let count = (document.getElementById(productId).value =
          parseInt(document.getElementById(productId).value, 10) - 1);
        if (count === 0) {
          singleMinus.setAttribute('hidden', '');
          document.querySelector('.floating-cart').setAttribute('hidden', '');
        }
      } else {
        // Handle error
        showAlert('error', 'Something went wrong');
        singleMinus.style.opacity = '1';
        singleMinus.disabled = false;
      }
    } catch (err) {
      // Handle error
      showAlert('error', err.response.data.message);
      console.log(err);
    }
  });
}

const singlePlus = document.querySelector('.plus-cart-btn-single');

if (singlePlus) {
  singlePlus.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      const res = await axios.get(
        `/api/v1/proteins/find-proteins?productId=${encodeURIComponent(productId)}`,
      );

      if (res.status === 200) {
        const product = res.data.data.product;

        if (product.proteins.length <= 0) {
          // Perform the API call
          const response = await axios.patch(
            `/api/v1/carts/increase-quantity/${productId}`,
          );

          if (response.data.status === 'success') {
            // Handle success
            showAlert('success', 'Product added to cart!');
            singlePlus.style.opacity = '1';
            singlePlus.disabled = false;
            document
              .querySelector('.minus-cart-btn-single')
              .removeAttribute('hidden');
            document.querySelector('.floating-cart').removeAttribute('hidden');

            let count = (document.getElementById(productId).value =
              parseInt(document.getElementById(productId).value, 10) + 1);
            // if (count !== 0) {
            //   document.querySelector('.minus-cart-btn-single').setAttribute('hidden');
            // }
          } else {
            // Handle error
            showAlert('error', 'Something went wrong');
            singlePlus.style.opacity = '1';
            singlePlus.disabled = false;
          }
        } else if (product.proteins.length >= 1) {
          singlePlus.style.opacity = '1';
          singlePlus.disabled = false;
          const proteinModal = document.getElementById('proteinModal');
          proteinModal.style.display = 'block';

          const modalAddToCartBtn = document.querySelector(
            '.add-to-cart-with-protein-btn',
          );

          modalAddToCartBtn.dataset.productId = productId;

          const productPrice = product.price;

          let totalSpan = document.querySelector('.protein-total p span');

          totalSpan.textContent = productPrice;

          const modalImage = document.querySelector('.modal-image-src');

          modalImage.src = product.imageCover;

          const modalDescription = document.querySelector('.modal-description');

          modalDescription.textContent = product.description;

          const productName = document.querySelector('.modal-product-name');

          productName.textContent = product.name;

          const modalUrl = document.querySelector('.modal-image-url');

          modalUrl.href = `/michael-kitchen/item/${product.categorySlug}/${product.slug}`;

          const modalName = document.querySelector('.modal-name-url');

          modalName.href = `/michael-kitchen/item/${product.categorySlug}/${product.slug}`;

          const proteinList = document.getElementById('proteinList');
          proteinList.innerHTML = '';
          product.proteins.forEach((protein, index) => {
            const proteinRow = document.createElement('div');
            proteinRow.style.display = 'flex';
            proteinRow.classList.add('protein-div');
            proteinRow.style.justifyContent = 'space-between';
            proteinRow.style.alignItems = 'center';
            proteinRow.style.marginBottom = '15px';
            proteinRow.style.padding = '10px 0';

            proteinRow.innerHTML = `
            <div style="flex: 1;" class="proteins">
              <img src="${protein.paymentProof}" alt="${protein.name}" loading="eager" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div style="flex: 2; padding-left: 10px;">
              <h4 name="protein-name" style="margin: 0;">${protein.name}</h4>
              <p name="protein-price" style="margin: 0;">₽${protein.price}</p>
            </div>
            <div style="flex: 1; display: flex; align-items: center;">
              <button id="minus-protein-${index}" style="padding: 5px 10px; background-color: #5f1303; color: white; border: none; border-radius: 5px;">-</button>
              <input name="protein-quantity" id="protein-qty-${index}" type="text" value="0" readonly style="width: 40px; text-align: center; margin: 0 10px;">
              <button id="plus-protein-${index}" style="padding: 5px 10px; background-color: #5f1303; color: white; border: none; border-radius: 5px;">+</button>
            </div>
          `;

            proteinList.appendChild(proteinRow);

            const minusProteinBtn = document.getElementById(
              `minus-protein-${index}`,
            );
            const plusProteinBtn = document.getElementById(
              `plus-protein-${index}`,
            );
            const input = document.getElementById(`protein-qty-${index}`);
            let currentQuantity = parseInt(input.value);

            minusProteinBtn.addEventListener('click', () => {
              if (currentQuantity > 0) {
                currentQuantity -= 1;
                input.value = currentQuantity;
                let total = parseInt(totalSpan.textContent);
                total -= protein.price;
                totalSpan.textContent = total;
              }
            });

            plusProteinBtn.addEventListener('click', () => {
              currentQuantity += 1;
              input.value = currentQuantity;
              let total = parseInt(totalSpan.textContent);
              total += protein.price;
              totalSpan.textContent = total;
            });
          });

          const lastBtn = document.querySelector(
            '.add-to-cart-with-protein-btn',
          );

          if (lastBtn) {
            lastBtn.addEventListener('click', async (e) => {
              e.preventDefault();

              lastBtn.style.opacity = '0.5';
              lastBtn.textContent = 'Processing...';
              lastBtn.disabled = true;

              const proteinsArray = Array.from(
                document.querySelectorAll('.protein-div'),
              )
                .map((proteinDiv) => {
                  const name = proteinDiv.querySelector(
                    '[name="protein-name"]',
                  ).textContent;
                  const quantity = proteinDiv.querySelector(
                    '[name="protein-quantity"]',
                  ).value;
                  const price = proteinDiv
                    .querySelector('[name="protein-price"]')
                    .textContent.replace('₽', '');

                  // Include the protein only if the quantity is greater than 0
                  if (parseInt(quantity, 10) > 0) {
                    return {
                      name,
                      quantity: parseInt(quantity, 10),
                      price: parseFloat(price),
                    };
                  }
                  return null; // Exclude proteins with a quantity of 0
                })
                .filter(Boolean); // Remove null values

              console.log(proteinsArray);

              const info = {
                proteins: proteinsArray,
              };

              try {
                const finalAddToCartResponse = await axios.post(
                  `/api/v1/carts/add-to-cart-with-protein/${productId}`,
                  info,
                );

                if (finalAddToCartResponse.data.status === 'success') {
                  // Handle success message or any further actions after successful approval
                  showAlert('success', 'Cart successfully updated!');
                  singlePlus.style.opacity = '1';
                  singlePlus.disabled = false;
                  lastBtn.style.opacity = '1';
                  lastBtn.textContent = 'Add To Cart';
                  lastBtn.disabled = false;
                  // document.getElementById(productId).value += 1;
                  document
                    .querySelector('.floating-cart')
                    .removeAttribute('hidden');

                  window.setTimeout(() => {
                    location.reload();
                  }, 3000);
                }
              } catch (err) {
                console.log(err);
                // Handle err
                showAlert(
                  'error',
                  err.response
                    ? err.response.data.message
                    : 'Something went wrong',
                );

                singlePlus.style.opacity = '1';
                singlePlus.disabled = false;
                lastBtn.style.opacity = '1';
                lastBtn.textContent = 'Add To Cart';
                lastBtn.disabled = false;
              }
            });
          }
        }
      }
    } catch (err) {
      // Handle error
      showAlert('error', err.response.data.message);
    }
  });
}

// Function to close the modal
function closeProteinModal() {
  document.getElementById('proteinModal').style.display = 'none';
}
