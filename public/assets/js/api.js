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
        location.assign('/admin/categories');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const supportFaq = async (email, subject, message) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/supports/send-support',
      data: {
        email,
        subject,
        message,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Message sent successfully!');

      // window.setTimeout(() => {
      //   location.assign('/faq');
      // }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateUserPassword = async (
  passwordCurrent,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');

      window.setTimeout(() => {
        location.assign('/account');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateAdminPassword = async (
  passwordCurrent,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');

      window.setTimeout(() => {
        location.assign('/admin/profile');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateAdminData = async (firstName, lastName, phoneNumber) => {
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
        location.assign('/admin/profile');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logoutUser = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      setTimeout(function () {
        location.href = '/';
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createReview = async (review, rating, productId) => {
  try {
    const res = await axios({
      method: 'post',
      url: `/api/v1/reviews/create-review/${productId}`,
      data: {
        review,
        rating,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Thanks for your feedback!');

      window.setTimeout(() => {
        location.assign('/account');
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
const supportFormFaq = document.querySelector('.support-form-faq');
const userPasswordUpdateForm = document.querySelector(
  '.user-password-update-form',
);
const updateAdminPasswordForm = document.querySelector('.admin-password-form');
const adminProfileForm = document.querySelector('.admin-profile-form');
const logoutUserBtn = document.querySelector('.signOut-user-btn');
const logoutUserBtn1 = document.querySelector('.signOut-user-btn1');
const logoutUserBtn2 = document.querySelector('.signOut-user-btn2');
const reviewForm = document.querySelector('.review-form');

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

if (logoutUserBtn) {
  logoutUserBtn.addEventListener('click', logoutUser);
}

if (logoutUserBtn1) {
  logoutUserBtn1.addEventListener('click', logoutUser);
}

if (logoutUserBtn2) {
  logoutUserBtn2.addEventListener('click', function (event) {
    event.preventDefault(); // Prevents the default action
    logoutUser(); // Call your logout logic
  });
}

if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const reviewBtn = document.querySelector('.review-btn');
    reviewBtn.style.opacity = '0.5';
    reviewBtn.textContent = 'Sending...';
    const review = document.getElementById('review').value;
    const rating = parseInt(document.getElementById('rating').value, 10);
    const urlParams = window.location.pathname.split('/').pop();
    await createReview(review, rating, urlParams);
    reviewBtn.style.opacity = '1';
    reviewBtn.textContent = 'Submit Review';
  });
}

if (userPasswordUpdateForm) {
  userPasswordUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.update-user-password-btn');
    button.style.opacity = '0.5';
    button.textContent = 'Saving...';
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await updateUserPassword(passwordCurrent, password, passwordConfirm);
    button.style.opacity = '1';
    button.textContent = 'Save Changes';
  });
}

if (adminProfileForm) {
  adminProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.admin-profile-btn');
    button.style.opacity = '0.5';
    button.textContent = 'Saving...';
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    await updateAdminData(firstName, lastName, phoneNumber);
    button.style.opacity = '1';
    button.textContent = 'Save Changes';
  });
}

if (updateAdminPasswordForm) {
  updateAdminPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.admin-password-btn');
    button.style.opacity = '0.5';
    button.textContent = 'Saving...';
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await updateAdminPassword(passwordCurrent, password, passwordConfirm);
    button.style.opacity = '1';
    button.textContent = 'Save Changes';
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

if (supportFormFaq) {
  supportFormFaq.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.support-faq-btn');

    button.style.opacity = '0.5';
    button.textContent = 'Sending...';
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    await supportFaq(email, subject, message);
    button.style.opacity = '1';
    button.textContent = 'Send Message';
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
    const deliveryMethod = document.getElementById('deliveryMethod').value;

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
    formData.append('deliveryMethod', deliveryMethod);
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
        }
      })
      .catch(function (error) {
        // Handle error (e.g., show an error message)
        showAlert('error', err.response.data.message);
        order.disabled = false; // Re-enable the button
        order.textContent = 'I have made payment'; // Reset text content
        order.style.opacity = '1'; // Reset opacity
        window.setTimeout(() => {
          location.assign('/cart');
        }, 3000);
      });
  });
}

document.querySelectorAll('.reply-support-modal').forEach((button) => {
  button.addEventListener('click', function () {
    const supportId = this.dataset.supportId;

    const submitButton = document.querySelector('.reply-support-btn');

    submitButton.addEventListener('click', async () => {
      submitButton.style.opacity = '0.5';
      submitButton.textContent = 'Sending...';

      const reply = {
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
      };

      try {
        const response = await axios.post(
          `/api/v1/supports/reply-support/${supportId}`,
          reply,
        );
        if (response.data.status === 'success') {
          showAlert('success', 'Reply Sent!');
          // Redirect to the plans page after a delay
          window.setTimeout(() => {
            location.assign('/admin/supports');
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        submitButton.style.opacity = '1';
        submitButton.textContent = 'Send Reply';
      }
    });
  });
});

document.querySelectorAll('.edit-product-stock-modal').forEach((button) => {
  button.addEventListener('click', function () {
    const productId = this.dataset.productId;
    const editButton = document.querySelector('.update-product-stock-btn');
    editButton.addEventListener('click', async () => {
      editButton.style.opacity = '0.5';
      editButton.textContent = 'Updating...';
      const productStock = {
        productStock: document.getElementById('productStock').value,
      };
      try {
        const response = await axios.patch(
          `/api/v1/products/increase-product-stock/${productId}`,
          productStock,
        );
        if (response.data.status === 'success') {
          showAlert('success', 'Product quantity increased!');
          window.setTimeout(() => {
            location.assign('/admin/out-of-stock');
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        editButton.style.opacity = '1';
        editButton.textContent = 'Send Reply';
      }
    });
  });
});

document.querySelectorAll('.edit-order-status-modal').forEach((button) => {
  button.addEventListener('click', function () {
    const orderId = this.dataset.orderId;
    const confirmButton = document.querySelector('.confirm-order-btn');
    const shipButton = document.querySelector('.ship-order-btn');
    const deliverButton = document.querySelector('.deliver-order-btn');
    const cancelButton = document.querySelector('.cancel-order-btn');
    if (confirmButton) {
      confirmButton.addEventListener('click', async () => {
        confirmButton.style.opacity = '0.5';
        confirmButton.textContent = 'Confirming...';
        try {
          const response = await axios.patch(
            `/api/v1/orders/confirm-order/${orderId}`,
          );
          if (response.data.status === 'success') {
            showAlert('success', 'Order Confirmed and email sent to user!');
            confirmButton.style.opacity = '1';
            confirmButton.textContent = 'Confirm';
            window.setTimeout(() => {
              location.assign('/admin/orders');
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          confirmButton.style.opacity = '1';
          confirmButton.textContent = 'Confirm';
          window.setTimeout(() => {
            location.assign('/admin/orders');
          }, 3000);
        }
      });
    }
    if (shipButton) {
      shipButton.addEventListener('click', async () => {
        const url = document.getElementById('trackingId').value.trim();
        shipButton.style.opacity = '0.5';
        shipButton.textContent = 'Shipping...';
        try {
          const response = await axios.patch(
            `/api/v1/orders/ship-order/${orderId}`,
            { url }, // Include tracking ID in the request body
          );
          if (response.data.status === 'success') {
            showAlert('success', 'Order Shipped And Email Sent!');
            confirmButton.style.opacity = '1';
            confirmButton.textContent = 'Shipped';
            window.setTimeout(() => {
              location.assign('/admin/orders');
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          shipButton.style.opacity = '1';
          shipButton.textContent = 'Shipped';
          window.setTimeout(() => {
            location.assign('/admin/orders');
          }, 3000);
        }
      });
    }
    if (deliverButton) {
      deliverButton.addEventListener('click', async () => {
        deliverButton.style.opacity = '0.5';
        deliverButton.textContent = 'Delivering...';
        try {
          const response = await axios.patch(
            `/api/v1/orders/deliver-order/${orderId}`,
          );
          if (response.data.status === 'success') {
            showAlert('success', 'Order Delivered!');
            confirmButton.style.opacity = '1';
            confirmButton.textContent = 'Delivered';
            window.setTimeout(() => {
              location.assign('/admin/orders');
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          deliverButton.style.opacity = '1';
          deliverButton.textContent = 'Delivered';
          window.setTimeout(() => {
            location.assign('/admin/orders');
          }, 3000);
        }
      });
    }
    if (cancelButton) {
      cancelButton.addEventListener('click', async () => {
        cancelButton.style.opacity = '0.5';
        cancelButton.textContent = 'Cancelling...';
        try {
          const response = await axios.patch(
            `/api/v1/orders/cancel-order/${orderId}`,
          );
          if (response.data.status === 'success') {
            showAlert('success', 'Order Cancelled and email sent to user!');
            confirmButton.style.opacity = '1';
            confirmButton.textContent = 'Cancelled';
            window.setTimeout(() => {
              location.assign('/admin/orders');
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          cancelButton.style.opacity = '1';
          cancelButton.textContent = 'Cancelled';
          window.setTimeout(() => {
            location.assign('/admin/orders');
          }, 3000);
        }
      });
    }
  });
});

document.querySelectorAll('.send-mail-modal').forEach((button) => {
  button.addEventListener('click', function () {
    const userId = this.dataset.userId;

    const submitButton = document.querySelector('.send-mail-btn');

    submitButton.addEventListener('click', async () => {
      submitButton.style.opacity = '0.5';
      submitButton.textContent = 'Sending...';

      const reply = {
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
      };

      try {
        const response = await axios.post(
          `/api/v1/supports/send-mail/${userId}`,
          reply,
        );
        if (response.data.status === 'success') {
          showAlert('success', 'Mail Sent!');
          // Redirect to the plans page after a delay
          window.setTimeout(() => {
            location.assign('/admin/users');
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        submitButton.style.opacity = '1';
        submitButton.textContent = 'Send Mail';
      }
    });
  });
});

document.querySelectorAll('.edit-afro-modal-toggler').forEach((button) => {
  button.addEventListener('click', function () {
    const productId = this.dataset.productId;

    const submitButton = document.querySelector('.update-afro-product-btn');

    submitButton.addEventListener('click', async () => {
      submitButton.style.opacity = '0.5';
      submitButton.textContent = 'Updating...';
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
        'productStock',
        document.getElementById('productStock').value,
      );

      // Append image data
      const imageCover = document.getElementById('imageCover').files[0];
      const images = document.getElementById('images').files;

      if (imageCover) {
        formData.append('imageCover', imageCover);
      }

      // Append multiple images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append('images', images[i]);
        }
      }

      try {
        const response = await axios.patch(
          `/api/v1/products/edit-product/${productId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        if (response.data.status === 'success') {
          showAlert('success', 'Product Updated Successfully!');

          window.setTimeout(() => {
            location.assign('/admin/afro-shop');
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        submitButton.style.opacity = '1';
        submitButton.textContent = 'Update Product';
      }
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////         CATEGORY FOR FRONTEND AFRO SHOP            ////////////////////////////
function myFunction() {
  const x = document.getElementById('categorySelect').value;
  const url = x ? `/afro-shop?category=${x}` : '/afro-shop';
  window.location.href = url;
  if (x === 'all') {
    window.location.href = '/afro-shop?category=all';
  }
}

// Function to update the dropdown based on the URL
function updateDropdownBasedOnURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  if (category) {
    const selectElement = document.getElementById('categorySelect');
    const optionToSelect = Array.from(selectElement.options).find(
      (option) => option.value === category,
    );

    if (optionToSelect) {
      selectElement.value = category;
      optionToSelect.textContent = optionToSelect.textContent;
    }
  }
}

// Call this function when the page loads to set the correct dropdown value
updateDropdownBasedOnURL();

const currentPage = parseInt(document.getElementById('currentPage').innerText);
const totalPages = parseInt(document.getElementById('totalPages').textContent);

function updateURL(direction) {
  const currentUrl = new URL(window.location.href);
  let page = parseInt(currentUrl.searchParams.get('page')) || 1;

  if (direction === 'next' && page < totalPages) {
    page += 1;
  } else if (direction === 'prev' && page > 1) {
    page -= 1;
  } else {
    // Update button disabled state
    updateButtonStates(page);
    return; // Exit the function if the button should be disabled
  }

  currentUrl.searchParams.set('page', page);
  window.location.href = currentUrl.toString();
}

function updateButtonStates(page) {
  const prevBtn = document.getElementById('previous-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!prevBtn || !nextBtn) {
    console.error('Pagination buttons not found.');
    return;
  }

  if (page <= 1) {
    prevBtn.setAttribute('aria-disabled', 'true');
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.removeAttribute('aria-disabled');
    prevBtn.classList.remove('disabled');
  }

  if (page >= totalPages) {
    nextBtn.setAttribute('aria-disabled', 'true');
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.removeAttribute('aria-disabled');
    nextBtn.classList.remove('disabled');
  }
}

// Initialize button states on page load
updateButtonStates(currentPage);

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////          CATEGORY FOR ADMIN AFRO SHOP           ///////////////////////
// Function to handle category selection and redirection
// Function to handle category selection and redirection
function adminCategory() {
  const selectedCategory = document.getElementById(
    'categorySelectAdminAfroShop',
  ).value;
  const url = selectedCategory
    ? `/admin/afro-shop?category=${selectedCategory}`
    : '/admin/afro-shop';
  window.location.href = url;

  if (selectedCategory === 'all') {
    window.location.href = '/admin/afro-shop?category=all';
  }
}

// Function to update the dropdown based on the URL
function updateDropdownBasedOnURLAdminAfro() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  if (category) {
    const selectElement = document.getElementById(
      'categorySelectAdminAfroShop',
    );
    const optionToSelect = Array.from(selectElement.options).find(
      (option) => option.value === category,
    );

    if (optionToSelect) {
      selectElement.value = category;
      optionToSelect.textContent = optionToSelect.textContent;
    }
  }
}

// Function to update pagination buttons state based on the current page
function updateButtonStatesAdminAfro(currentPage, totalPages) {
  const prevBtn = document.getElementById('previous-btn-afro-shop');
  const nextBtn = document.getElementById('next-btn-afro-shop');

  if (!prevBtn || !nextBtn) {
    console.error('Pagination buttons not found.');
    return;
  }

  if (currentPage <= 1) {
    prevBtn.setAttribute('aria-disabled', 'true');
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.removeAttribute('aria-disabled');
    prevBtn.classList.remove('disabled');
  }

  if (currentPage >= totalPages) {
    nextBtn.setAttribute('aria-disabled', 'true');
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.removeAttribute('aria-disabled');
    nextBtn.classList.remove('disabled');
  }
}

// Function to update the URL based on pagination
function updateURLAdminAfro(direction) {
  const currentUrl = new URL(window.location.href);
  let page = parseInt(currentUrl.searchParams.get('page')) || 1;
  const totalPages = parseInt(
    document.getElementById('totalPagesAdminAfro').textContent,
  );

  if (direction === 'next' && page < totalPages) {
    page += 1;
  } else if (direction === 'prev' && page > 1) {
    page -= 1;
  } else {
    updateButtonStatesAdminAfro(page, totalPages);
    return;
  }

  currentUrl.searchParams.set('page', page);
  window.location.href = currentUrl.toString();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  // Update dropdown based on URL on load
  updateDropdownBasedOnURLAdminAfro();

  // Get current page and total pages
  const currentPage = parseInt(
    document.getElementById('currentPageAdminAfro').textContent,
  );
  const totalPages = parseInt(
    document.getElementById('totalPagesAdminAfro').textContent,
  );

  // Initialize button states
  updateButtonStatesAdminAfro(currentPage, totalPages);
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////    order status filter and pagination       ///////////////////////

function orderStatus() {
  const orderStatus = document.getElementById('ordersAdmin').value;
  const url = orderStatus
    ? `/admin/orders?status=${orderStatus}`
    : '/admin/orders';
  window.location.href = url;
}

// Function to update the dropdown based on the URL
function updateOrderDropdownBasedOnURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');

  if (status) {
    const selectElement = document.getElementById('ordersAdmin');
    const optionToSelect = Array.from(selectElement.options).find(
      (option) => option.value === status,
    );

    if (optionToSelect) {
      selectElement.value = status;
      optionToSelect.textContent = optionToSelect.textContent;
    }
  }
}

// Function to update pagination buttons state based on the current page
function updateButtonStatesOrders(currentPage, totalPages) {
  const prevBtn = document.getElementById('previous-btn-orders');
  const nextBtn = document.getElementById('next-btn-orders');

  if (!prevBtn || !nextBtn) {
    console.error('Pagination buttons not found.');
    return;
  }

  if (currentPage <= 1) {
    prevBtn.setAttribute('aria-disabled', 'true');
    prevBtn.classList.add('disabled');
  } else {
    prevBtn.removeAttribute('aria-disabled');
    prevBtn.classList.remove('disabled');
  }

  if (currentPage >= totalPages) {
    nextBtn.setAttribute('aria-disabled', 'true');
    nextBtn.classList.add('disabled');
  } else {
    nextBtn.removeAttribute('aria-disabled');
    nextBtn.classList.remove('disabled');
  }
}

// Function to update the URL based on pagination
function updateURLOrders(direction) {
  const currentUrl = new URL(window.location.href);
  let page = parseInt(currentUrl.searchParams.get('page')) || 1;
  const totalPages = parseInt(
    document.getElementById('totalPagesOrders').textContent,
  );

  if (direction === 'next' && page < totalPages) {
    page += 1;
  } else if (direction === 'prev' && page > 1) {
    page -= 1;
  } else {
    updateButtonStatesOrders(page, totalPages);
    return;
  }

  currentUrl.searchParams.set('page', page);
  window.location.href = currentUrl.toString();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  // Update dropdown based on URL on load
  updateOrderDropdownBasedOnURL();

  // Get current page and total pages
  const currentPage = parseInt(
    document.getElementById('currentPageOrders').textContent,
  );
  const totalPages = parseInt(
    document.getElementById('totalPagesOrders').textContent,
  );

  // Initialize button states
  updateButtonStatesOrders(currentPage, totalPages);
});

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////      SEARCH FUNCTION       //////////////////////
