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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const adminLogin = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/admin-login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/admin/dashboard');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const signUp = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/confirm-email');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password reset email sent!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const resetPassword = async (password, passwordConfirm, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${resetToken}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully reset password');

      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/sign-in');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const editShippingAddress = async (
  fullName,
  address,
  phoneNumber,
  country,
  region,
  city,
  addressId,
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/shipping-address/edit-shipping-address/${addressId}`,
      data: {
        fullName,
        address,
        phoneNumber,
        country,
        region,
        city,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully updated shipping address');

      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/account');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateUserDetail = async (firstName, lastName, phoneNumber) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update',
      data: {
        firstName,
        lastName,
        phoneNumber,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully updated profile!');

      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/account');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const addProducts = async (formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/products/add-product',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully uploaded product');
      // Redirect
      window.setTimeout(() => {
        location.assign('/admin/add-products');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createDeliveryAddress = async (
  fullName,
  address,
  phoneNumber,
  country,
  region,
  city,
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/shipping-address/create-shipping-address',
      data: {
        fullName,
        address,
        phoneNumber,
        country,
        region,
        city,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully created delivery address');
      // Redirect
      window.setTimeout(() => {
        location.assign('/account');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const addCategory = async (name) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/categories/create-category',
      data: {
        name,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully added category');
      // Redirect
      window.setTimeout(() => {
        location.assign('/admin/add-category');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');
const forgotPasswordButton = document.querySelector('.form-forgot-password');
const resetPasswordButton = document.querySelector('.form-reset-password');
const adminLoginForm = document.querySelector('.admin-form-login');
const shippingAddressForm = document.querySelector('.shipping-address-form');
const userDataUpdateForm = document.querySelector('.update-user-data-form');
const addProductsForm = document.querySelector('.add-product-form');
const createShippingAddressForm = document.querySelector(
  '.create-shipping-address-form',
);
const addCategoryForm = document.querySelector('.add-category-form');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (userDataUpdateForm) {
  userDataUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updateBtn = document.querySelector('.update-btn');
    updateBtn.style.opacity = '0.5';
    updateBtn.textContent = 'Updating...';
    const firstName = document.getElementById('firstNames').value;
    const lastName = document.getElementById('lastNames').value;
    const phoneNumber = document.getElementById('phoneNumbers').value;
    await updateUserDetail(firstName, lastName, phoneNumber);
    updateBtn.style.opacity = '1';
    updateBtn.textContent = 'Save Changes';
  });
}

if (addCategoryForm) {
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.add-category-btn');
    button.style.opacity = '0.5';
    button.textContent = 'Adding...';
    const name = document.getElementById('name').value;
    await addCategory(name);
    button.style.opacity = '1';
    button.textContent = 'Add Category';
  });
}

if (addProductsForm) {
  addProductsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const addBtn = document.querySelector('.add-btn');
    addBtn.style.opacity = '0.5';
    addBtn.textContent = 'Uploading...';
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('price', document.getElementById('price').value);
    formData.append(
      'initialPrice',
      document.getElementById('initialPrice').value,
    );
    formData.append(
      'description',
      document.getElementById('description').value,
    );
    formData.append('summary', document.getElementById('summary').value);
    formData.append(
      'superCategory',
      document.getElementById('superCategory').value,
    );
    formData.append('category', document.getElementById('category').value);
    formData.append(
      'imageCover',
      document.getElementById('imageCover').files[0],
    );
    // Handle multiple images
    const images = document.getElementById('images').files;
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    formData.append('variations', document.getElementById('variations').value);
    formData.append('productStock', document.getElementById('quantity').value);
    await addProducts(formData);
    addBtn.style.opacity = '1';
    addBtn.textContent = 'Save';
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.login-btn').style.opacity = '0.5';
    document.querySelector('.login-btn').textContent = 'Signing in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
    document.querySelector('.login-btn').style.opacity = '1';
    document.querySelector('.login-btn').textContent = 'Sign in';
  });
}

if (createShippingAddressForm) {
  createShippingAddressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.save-address-btn');
    button.style.opacity = '0.5';
    button.textContent = 'Saving...';
    const fullName = document.getElementById('fullNames').value;
    const address = document.getElementById('addresss').value;
    const phoneNumber = document.getElementById('phoneNumbers').value;
    const country = document.getElementById('countrys').value;
    const region = document.getElementById('regions').value;
    const city = document.getElementById('citys').value;
    await createDeliveryAddress(
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
    );
    button.style.opacity = '1';
    button.textContent = 'Save';
  });
}

if (shippingAddressForm) {
  shippingAddressForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.edit-address-btn');
    // Retrieve addressId from button's data attribute
    const addressId = button.dataset.addressId;
    button.style.opacity = '0.5';
    button.textContent = 'saving...';
    const fullName = document.getElementById('fullName').value;
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const country = document.getElementById('country').value;
    const region = document.getElementById('region').value;
    const city = document.getElementById('city').value;
    await editShippingAddress(
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
      addressId,
    );
    button.style.opacity = '1';
    button.textContent = 'Save Changes';
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.admin-login-btn').style.opacity = '0.5';
    document.querySelector('.admin-login-btn').textContent = 'Signing in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await adminLogin(email, password);
    document.querySelector('.admin-login-btn').style.opacity = '1';
    document.querySelector('.admin-login-btn').textContent = 'Sign in';
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--signup').style.opacity = '0.5';
    document.querySelector('.btn--signup').textContent = 'signing up...';

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await signUp(
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      passwordConfirm,
    );
    document.querySelector('.btn--signup').style.opacity = '1';
    document.querySelector('.btn--signup').textContent = 'sign up';
  });
}

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--forgot').style.opacity = '0.5';
    document.querySelector('.btn--forgot').textContent =
      'Sending reset link...';

    const email = document.getElementById('email').value;

    await forgotPassword(email);

    document.querySelector('.btn--forgot').style.opacity = '1';
    document.querySelector('.btn--forgot').textContent =
      'Send password reset email';
  });
}

if (resetPasswordButton) {
  resetPasswordButton.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--reset').style.opacity = '0.5';
    document.querySelector('.btn--reset').textContent = 'Resetting password...';

    // Get the resetToken from the URL parameters
    const urlParams = window.location.pathname.split('/').pop();

    // Get the password and passwordConfirm from the form fields
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Call the resetPassword function with the obtained resetToken
    await resetPassword(password, passwordConfirm, urlParams);

    document.querySelector('.btn--reset').style.opacity = '1';
    document.querySelector('.btn--reset').textContent = 'Reset password';
  });
}

const addToWishlistButton = document.querySelector('.add-to-wishlist-btn');

if (addToWishlistButton) {
  addToWishlistButton.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      // Check if productId is valid
      if (!productId) {
        console.error('Product ID is missing.');
        return;
      }

      // Change the styling and text content to indicate processing
      this.style.opacity = '0.5';
      this.querySelector('span').textContent = 'Adding...';

      // Perform the API call
      const response = await axios.post(
        `/api/v1/wishlists/add-to-wishlist/${productId}`,
      );

      // Handle success
      showAlert('success', 'Product added to wishlist!');
      this.style.opacity = '1';
      this.querySelector('span').textContent = 'Added to Wishlist';
    } catch (error) {
      // Handle error
      showAlert('error', error.response.data.message);
      this.style.opacity = '1';
      this.querySelector('span').textContent = 'Add To Wishlist';
    }
  });
}

document.querySelectorAll('.remove-cart').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      // Send a DELETE request to the backend to remove the product from the cart
      const response = await axios.delete(
        `/api/v1/carts/delete-from-cart/${productId}`,
      );

      console.log(response.data);

      // Handle success message or any further actions after successful removal
      showAlert('success', 'Item successfully removed from cart!');

      // Remove the item from the UI
      document.getElementById(`cart-item-${productId}`).remove();
    } catch (error) {
      // Handle errors
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.remove-wishlist').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      // Send a DELETE request to the backend to remove the product from the wishlist
      const response = await axios.delete(
        `/api/v1/wishlists/delete-from-wishlist/${productId}`,
      );

      // Handle success message or any further actions after successful removal
      showAlert('success', 'Item successfully removed from wishlist!');

      // Remove the item from the UI
      document.getElementById(`wishlist-item-${productId}`).remove();
    } catch (error) {
      // Handle errors
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.add-to-cart-from-wishlist').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.querySelector('.wishlist-push-cart').textContent = 'Processing';

      // Send a DELETE request to the backend to remove the product from the wishlist
      const response = await axios.post(
        `/api/v1/wishlists/add-to-cart-from-wishlist/${productId}`,
      );

      // Handle success message or any further actions after successful removal
      showAlert('success', 'Cart successfully updated!');
      button.style.opacity = '1';
      button.querySelector('.wishlist-push-cart').textContent = 'Add To Cart';

      // Remove the item from the UI
      document.getElementById(`wishlist-item-${productId}`).remove();
    } catch (error) {
      // Handle errors
      console.log(error.response);
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.querySelector('.wishlist-push-cart').textContent = 'Add To Cart';
    }
  });
});

// For the modal "Add to Cart" button
document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.querySelector('.btn-text').textContent = 'Processing';

      // Send a POST request to the backend to add the product to the cart
      const response = await axios.post(
        `/api/v1/carts/add-to-cart/${productId}`,
      );

      // Handle success message or any further actions after successful approval
      showAlert('success', 'Cart successfully updated!');
      button.style.opacity = '1';
      button.querySelector('.btn-text').textContent = 'Add To Cart';
    } catch (error) {
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.querySelector('.btn-text').textContent = 'Add To Cart';
    }
  });
});

document.querySelectorAll('.plus-cart').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;
    console.log(productId);

    try {
      button.style.opacity = '0.5';

      const response = await axios.patch(
        `/api/v1/carts/increase-quantity/${productId}`,
      );

      showAlert('success', 'Cart successfully updated!');
      button.style.opacity = '1';
      window.setTimeout(() => {
        location.assign('/cart');
      });
    } catch (err) {
      // Handle errors
      showAlert('error', err.response.data.message);
    }
  });
});

document.querySelectorAll('.minus-cart').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;
    console.log(productId);

    try {
      button.style.opacity = '0.5';

      const response = await axios.patch(
        `/api/v1/carts/decrease-quantity/${productId}`,
      );

      showAlert('success', 'Cart successfully updated!');
      button.style.opacity = '1';
      window.setTimeout(() => {
        location.assign('/cart');
      });
    } catch (err) {
      // Handle errors
      showAlert('error', err.response.data.message);
    }
  });
});

const singleProduct = document.querySelector('.single-add-to-cart-btn');

if (singleProduct) {
  singleProduct.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      // Check if productId is valid
      if (!productId) {
        console.error('Product ID is missing.');
        return;
      }

      // Perform the API call
      const response = await axios.post(
        `/api/v1/carts/add-to-cart/${productId}`,
      );

      // Handle success
      showAlert('success', 'Product added to cart!');
    } catch (error) {
      // Handle error
      showAlert(
        'error',
        error.response ? error.response.data.message : 'Something went wrong',
      );
    }
  });
}

// Select the buttons
const minusButton = document.querySelector('.minus-detail');
const plusButton = document.querySelector('.plus-detail');

if (plusButton) {
  plusButton.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      if (!productId) {
        console.error('Product ID is missing.');
        return;
      }

      // Perform the API call
      const response = await axios.patch(
        `/api/v1/carts/increase-quantity/${productId}`,
      );

      // Handle success
      showAlert('success', 'Cart successfully updated!');
    } catch (err) {
      // Handle error
      showAlert('error', 'Something went wrong');
    }
  });
}

if (minusButton) {
  minusButton.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      if (!productId) {
        console.error('Product ID is missing.');
        return;
      }

      // Perform the API call
      const response = await axios.patch(
        `/api/v1/carts/decrease-quantity/${productId}`,
      );

      // Handle success
      showAlert('success', 'Cart successfully updated!');
    } catch (err) {
      // Handle error
      showAlert('error', err.response.data.message);
    }
  });
}

const order = document.getElementById('confirmPaymentButton');

if (order) {
  order.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default action

    // Disable the button, change text to "Processing...", and adjust opacity
    order.disabled = true;
    order.textContent = 'Processing...';
    order.style.opacity = '0.5';

    // Get the value of the order notes
    const orderNote = document.getElementById('orderNote').value;

    // Get the file input element
    const paymentProofInput = document.getElementById('paymentProof');

    // Ensure a file is selected
    if (paymentProofInput.files.length === 0) {
      showAlert('error', 'Please upload a proof of payment.');
      order.disabled = false; // Re-enable the button
      order.textContent = 'I have made payment'; // Reset text content
      order.style.opacity = '1'; // Reset opacity
      return;
    }

    // Prepare the FormData object
    const formData = new FormData();
    formData.append('orderNote', orderNote);
    formData.append('paymentProof', paymentProofInput.files[0]); // Add the file to the request

    // Make the API request using Axios and handle the response
    axios
      .post('/api/v1/orders/create-order', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(function (response) {
        // Use response here
        // Check if the status is 'success'
        if (response.data.status === 'success') {
          // Show a success alert or perform any action
          showAlert('success', 'Payment confirmed successfully!');

          // Redirect to the account page after a delay
          window.setTimeout(() => {
            location.assign('/account');
          }, 3000);
        } else {
          // Handle the case where the status is not 'success'
          showAlert('error', 'Something went wrong. Please try again.');
          order.disabled = false; // Re-enable the button
          order.textContent = 'I have made payment'; // Reset text content
          order.style.opacity = '1'; // Reset opacity
          window.setTimeout(() => {
            location.assign('/cart');
          }, 3000);
        }
      })
      .catch(function (error) {
        // Handle error (e.g., show an error message)
        showAlert('error', 'An error occurred. Please try again later.');
        order.disabled = false; // Re-enable the button
        order.textContent = 'I have made payment'; // Reset text content
        order.style.opacity = '1'; // Reset opacity
        window.setTimeout(() => {
          location.assign('/cart');
        }, 3000);
      });
  });
}

const search = document.getElementById('searchForm');

if (search) {
  search.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the search query
    const query = document.getElementById('searchInput').value.trim();

    // Make the API request using Axios
    axios
      .get('/api/v1/search/search', { params: { query: query } })
      .then(function (response) {
        const products = response.data.data.products;
        let resultsHTML = '';

        if (products.length > 0) {
          products.forEach((product) => {
            resultsHTML += `
            <div class="product-item">
              <a href="/product/${product.slug}">
                <img src="${product.imageCover}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.price}</p>
              </a>
            </div>
          `;
          });
        } else {
          resultsHTML = '<p>No products found</p>';
        }

        document.getElementById('searchResults').innerHTML = resultsHTML;
      })
      .catch(function (error) {
        console.error('Error:', error);
        document.getElementById('searchResults').innerHTML =
          '<p>Error searching for products</p>';
      });
  });
}
