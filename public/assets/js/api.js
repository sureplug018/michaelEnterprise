////////////////////////////////////////
// alerts
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const loginForm = document.querySelector('.form-login');
const signupForm = document.querySelector('.form-signup');
const forgotPasswordButton = document.querySelector('.form-forgot-password');
const resetPasswordButton = document.querySelector('.form-reset-password');
const adminLoginForm = document.querySelector('.admin-form-login');
const shippingAddressForm = document.querySelector('.shipping-address-form');
const userDataUpdateForm = document.querySelector('.update-user-data-form');
const addProductsForm = document.querySelector('.add-product-form');

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

document.querySelectorAll('.add-to-cart-btn').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.querySelector('.btn-text').textContent = 'Processing';

      // Send a PUT request to the backend to add the product to the cart
      const response = await axios.post(
        `/api/v1/carts/add-to-cart/${productId}`,
      );

      // Handle success message or any further actions after successful approval
      showAlert('success', 'Cart successfully updated!');
      button.style.opacity = '1';
      button.querySelector('.btn-text').textContent = 'Add To Cart';

      // Close the modal after the successful API call
      document.querySelector('.product-details-popup-wrapper').style.display =
        'none';
    } catch (error) {
      // Handle errors
      button.style.opacity = '1';
      button.querySelector('.btn-text').textContent = 'Add To Cart';
      showAlert('error', error.response.data.message);
    }
  });
});

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

// When the "Quick View" button is clicked
document.querySelectorAll('.product-details-popup-btn').forEach((button) => {
  button.addEventListener('click', function () {
    // Get the product ID from the clicked item
    const productId = this.closest('.single-shopping-card-one').querySelector(
      '.add-to-cart-btn',
    ).dataset.productId;

    console.log('first', productId);

    // Update the modal's Add to Cart button with the correct product ID
    const modalAddToCartButton = document.querySelector(
      '.modal-add-to-cart-btn',
    );
    modalAddToCartButton.dataset.productId = productId;
  });
});

// For the modal "Add to Cart" button
document.querySelectorAll('.modal-add-to-cart-btn').forEach((button) => {
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

      // Close the modal after the successful API call
      document.querySelector('.product-details-popup-wrapper').style.display =
        'none';
    } catch (error) {
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.querySelector('.btn-text').textContent = 'Add To Cart';
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
