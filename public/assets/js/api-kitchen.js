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

      // Send a POST request to the backend to add the product to the cart
      const response = await axios.post(
        `/api/v1/carts/add-to-cart/${productId}`,
      );
      if (response.data.status === 'success') {
        // Handle success message or any further actions after successful approval
        showAlert('success', 'Cart successfully updated!');
        button.style.opacity = '1';
        button.disabled = false;
        // document.getElementById(productId).value += 1;
        document.querySelector('.floating-cart').removeAttribute('hidden');
      }
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.disabled = false;
      window.setTimeout(() => {
        location.reload();
      }, 3000);
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

        // document.getElementById(productId).value =
        //   parseInt(document.getElementById(productId).value, 10) + 1;

        // const minusButton = document.querySelector('.minus-cart-btn-single');
        // minusButton.style.display = 'block';
      } else {
        // Handle error
        console.log(response.data);
        showAlert('error', 'Something went wrong');
        singleProduct.style.opacity = '1';
        singleProduct.disabled = false;
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
    } catch (err) {
      // Handle error
      showAlert('error', err.response.data.message);
    }
  });
}
