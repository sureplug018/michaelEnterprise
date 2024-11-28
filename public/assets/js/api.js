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
  postalCode,
  postOfficeAddress,
  passportNumber,
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
        postalCode,
        postOfficeAddress,
        passportNumber,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully updated shipping address');

      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.reload();
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
  postalCode,
  postOfficeAddress,
  passportNumber,
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
        postalCode,
        postOfficeAddress,
        passportNumber,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully created delivery address');
      // Redirect
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const addCategory = async (name, superCategory) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/categories/create-category',
      data: {
        name,
        superCategory,
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

      window.setTimeout(() => {
        location.reload();
      }, 3000);
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

const addCurrency = async (code, name, symbol) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/currencies/add-currency',
      data: {
        code,
        name,
        symbol,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Currency added successfully!');
      setTimeout(function () {
        location.href = '/admin/add-currency';
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const addRate = async (
  baseCurrencyCode,
  targetCurrencyCode,
  rate,
  visibleRate,
  direction,
) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/rates/create-rate',
      data: {
        baseCurrencyCode,
        targetCurrencyCode,
        rate,
        visibleRate,
        direction,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Rate added successfully!');
      setTimeout(function () {
        location.href = '/admin/rates';
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const userRole = async (email, role) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/change-role',
      data: {
        email,
        role,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User Role Updated!');
      setTimeout(function () {
        location.reload();
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
const addCurrencyForm = document.querySelector('.add-currency-form');
const addRateForm = document.querySelector('.add-rate-form');
const userRoleForm = document.querySelector('.user-role-form');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (userDataUpdateForm) {
  userDataUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updateBtn = document.querySelector('.update-btn');
    updateBtn.style.opacity = '0.5';
    updateBtn.textContent = 'Updating...';
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    await updateUserDetail(firstName, lastName, phoneNumber);
    updateBtn.style.opacity = '1';
    updateBtn.textContent = 'Save Changes';
  });
}

if (userRoleForm) {
  userRoleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector('.update-btn');
    submitBtn.style.opacity = '0.5';
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;

    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    await userRole(email, role);

    submitBtn.style.opacity = '1';
    submitBtn.textContent = 'Update Role';
    submitBtn.disabled = false;
  });
}

if (addCurrencyForm) {
  addCurrencyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector('.add-currency-btn');
    submitBtn.style.opacity = '0.5';
    submitBtn.textContent = 'Processing...';
    const code = document.getElementById('currencyCode').value;
    const name = document.getElementById('currencyName').value;
    const symbol = document.getElementById('currencySymbol').value;
    await addCurrency(code, name, symbol);
    submitBtn.style.opacity = '1';
    submitBtn.textContent = 'Save';
  });
}

if (addRateForm) {
  addRateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = document.querySelector('.add-rate-btn');
    submitButton.style.opacity = '0.5';
    submitButton.textContent = 'Processing...';
    const baseCurrency = document.getElementById('baseCurrency').value;
    const targetCurrency = document.getElementById('targetCurrency').value;
    const rate = document.getElementById('rate').value;
    const visibleRate = document.getElementById('visibleRate').value;
    const direction = document.getElementById('direction').value;
    await addRate(baseCurrency, targetCurrency, rate, visibleRate, direction);
    submitButton.style.opacity = '1';
    submitButton.textContent = 'Save';
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
    const superCategory = document.getElementById('superCategory').value;
    await addCategory(name, superCategory);
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
    const fullName = document.getElementById('fullName').value;
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const country = document.getElementById('country').value;
    const region = document.getElementById('region').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;
    const postOfficeAddress =
      document.getElementById('postOfficeAddress').value;
    const passportNumber = document.getElementById('passportNumber').value;
    await createDeliveryAddress(
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
      postalCode,
      postOfficeAddress,
      passportNumber,
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
    const fullName = document.getElementById('fullName2').value;
    const address = document.getElementById('address2').value;
    const phoneNumber = document.getElementById('phoneNumber2').value;
    const country = document.getElementById('country2').value;
    const region = document.getElementById('region2').value;
    const city = document.getElementById('city2').value;
    const postalCode = document.getElementById('postalCode2').value;
    const postOfficeAddress =
      document.getElementById('postOfficeAddress2').value;
    const passportNumber = document.getElementById('passportNumber2').value;
    await editShippingAddress(
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
      postalCode,
      postOfficeAddress,
      passportNumber,
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

const addToWishlistButton = document.querySelector('.add-to-wishlist-single');

if (addToWishlistButton) {
  addToWishlistButton.addEventListener('click', async function (e) {
    e.preventDefault();

    // Retrieve the product ID from the button
    const productId = this.dataset.productId;

    try {
      // Change the styling and text content to indicate processing
      this.style.opacity = '0.5';
      this.querySelector('span').textContent = 'Adding...';
      this.disabled = true;

      // Perform the API call
      const response = await axios.post(
        `/api/v1/wishlists/add-to-wishlist/${productId}`,
      );

      if (response.data.status === 'success') {
        // Handle success
        showAlert('success', 'Product added to wishlist!');
        this.style.opacity = '1';
        this.querySelector('span').textContent = 'Added to Wishlist';
        this.disabled = false;
      } else {
        this.style.opacity = '1';
        this.disabled = false;
        this.querySelector('span').textContent = 'Add To Wishlist';
      }
    } catch (error) {
      // Handle error
      showAlert('error', error.response.data.message);
      this.style.opacity = '1';
      this.querySelector('span').textContent = 'Add To Wishlist';
      this.disabled = false;
      return;
    }
  });
}

// For the modal "Add to Cart" button
document.querySelectorAll('.add-to-wishlist-btn').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      // Send a POST request to the backend to add the product to the cart
      const response = await axios.post(
        `/api/v1/wishlists/add-to-wishlist/${productId}`,
      );
      if (response.data.status === 'success') {
        // Handle success message or any further actions after successful approval
        showAlert('success', 'Successfully added to wishlist!');
        button.style.opacity = '1';
        button.disabled = false;
      }
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.disabled = false;
    }
  });
});

document.querySelectorAll('.remove-cart').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      // Send a DELETE request to the backend to remove the product from the cart
      const response = await axios.delete(
        `/api/v1/carts/delete-from-cart/${productId}`,
      );

      // Handle success message or any further actions after successful removal
      showAlert('success', 'Item successfully removed from cart!');
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (error) {
      // Handle errors
      showAlert('error', error.response.data.message);
    }
  });
});

// For the modal "Add to Cart" button
document.querySelectorAll('.remove-from-wishlist').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      // Send a POST request to the backend to remove the product from the wishlist
      const response = await axios.delete(
        `/api/v1/wishlists/delete-from-wishlist/${productId}`,
      );
      // Handle success message
      showAlert('success', 'Successfully removed from wishlist!');
      button.closest('.product-box-contain').style.display = 'none';
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.disabled = false;
    }
  });
});

// For the modal "Add to Cart" button
document.querySelectorAll('.add-to-cart-from-wishlist').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      // Send a POST request to the backend to remove the product from the wishlist
      const response = await axios.post(
        `/api/v1/wishlists/add-to-cart-from-wishlist/${productId}`,
      );
      if (response.data.status === 'success') {
        // Handle success message
        showAlert('success', 'Successfully added to cart!');
        button.closest('.product-box-contain').style.display = 'none';
      }
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.disabled = false;
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
        document.getElementById(productId).value += 1;
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

// For the modal "Add to Cart" button
document.querySelectorAll('.increase-item-qty').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      // Send a POST request to the backend to add the product to the cart
      const response = await axios.patch(
        `/api/v1/carts/increase-quantity/${productId}`,
      );
      if (response.data.status === 'success') {
        // Handle success message or any further actions after successful approval
        showAlert('success', 'Cart successfully updated!');
        button.style.opacity = '1';
        button.disabled = false;
        document.getElementById(productId).value =
          parseInt(document.getElementById(productId).value, 10) + 1;
        document.querySelector('.floating-cart').removeAttribute('hidden');
      }
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.disabled = false;
    }
  });
});

// For the modal "Add to Cart" button
document.querySelectorAll('.decrease-itm-qty').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      // Send a POST request to the backend to add the product to the cart
      const response = await axios.patch(
        `/api/v1/carts/decrease-quantity/${productId}`,
      );
      if (response.data.status === 'success') {
        // Handle success message or any further actions after successful approval
        showAlert('success', 'Cart successfully updated!');
        button.style.opacity = '1';
        button.disabled = false;
        document.getElementById(productId).value =
          parseInt(document.getElementById(productId).value, 10) - 1;
        if (parseFloat(document.getElementById(productId).value) === 0) {
          document.querySelector('.floating-cart').setAttribute('hidden', '');
        }
      }
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert('error', error.response.data.message);
      button.style.opacity = '1';
      button.disabled = false;
    }
  });
});

document.querySelectorAll('.plus-cart').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      const response = await axios.patch(
        `/api/v1/carts/increase-quantity/${productId}`,
      );
      if (response.data.status === 'success') {
        showAlert('success', 'Cart successfully updated!');
        button.style.opacity = '1';
        window.setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (err) {
      // Handle errors
      showAlert('error', err.response.data.message);
      button.style.opacity = '1';
      button.disabled = true;
    }
  });
});

document.querySelectorAll('.minus-cart').forEach((button) => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();
    const productId = this.dataset.productId;

    try {
      button.style.opacity = '0.5';
      button.disabled = true;

      const response = await axios.patch(
        `/api/v1/carts/decrease-quantity/${productId}`,
      );
      if (response.data.status === 'success') {
        showAlert('success', 'Cart successfully updated!');
        button.style.opacity = '1';
        window.setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (err) {
      // Handle errors
      showAlert('error', err.response.data.message);
      button.style.opacity = '1';
      button.disabled = true;
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

        document.getElementById(productId).value =
          parseInt(document.getElementById(productId).value, 10) + 1;

        const minusButton = document.querySelector('.minus-cart-btn-single');
        minusButton.style.display = 'block';
        document.querySelector('.floating-cart').removeAttribute('hidden');
      } else {
        // Handle error
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
          singleMinus.style.display = 'none';

          const floatingCart = document.querySelector('.floating-cart');
          if (floatingCart) floatingCart.setAttribute('hidden', true);
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
      showAlert('error', err.response.data.message);
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
  order.addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent the default action

    // Disable the button, change text to "Processing...", and adjust opacity
    order.disabled = true;
    order.textContent = 'Processing...';
    order.style.opacity = '0.5';

    // Get the value of the order notes and delivery method
    const orderNote = document.getElementById('orderNote').value;
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    const fullName = document.getElementById('fullNames').value;
    const address = document.getElementById('addresses').value;
    const phoneNumber = document.getElementById('phoneNumbers').value;
    const entrance = document.getElementById('entrance').value;
    const entranceCode = document.getElementById('entranceCode').value;
    const floor = document.getElementById('floor').value;
    const roomNumber = document.getElementById('roomNumber').value;

    // Get the file input element
    const paymentProofInput = document.getElementById('paymentProof');

    // Ensure a file is selected
    if (paymentProofInput.files.length === 0) {
      showAlert('error', 'Please upload a proof of payment.');
      order.disabled = false; // Re-enable the button
      order.textContent = 'Confirm'; // Reset text content
      order.style.opacity = '1'; // Reset opacity
      return;
    }

    // Prepare the FormData object
    const formData = new FormData();
    formData.append('orderNote', orderNote);
    formData.append('deliveryMethod', deliveryMethod);
    formData.append('fullName', fullName);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    formData.append('entrance', entrance);
    formData.append('entranceCode', entranceCode);
    formData.append('floor', floor);
    formData.append('roomNumber', roomNumber);
    formData.append('paymentProof', paymentProofInput.files[0]); // Add the file to the request

    try {
      // Make the API request using Axios and await the response
      const response = await axios.post(
        '/api/v1/orders/create-order',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Use response here
      if (response.data.status === 'success') {
        // Show a success alert or perform any action
        showAlert('success', 'Order successful!');

        // Redirect to the account page after a delay
        window.setTimeout(() => {
          location.assign('/account');
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      // Handle error (e.g., show an error message)
      showAlert('error', err.response.data.message);
      order.disabled = false; // Re-enable the button
      order.textContent = 'I have made payment'; // Reset text content
      order.style.opacity = '1'; // Reset opacity
      // window.setTimeout(() => {
      //   location.reload();
      // }, 3000);
    }
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

document
  .querySelectorAll('.edit-transaction-status-modal')
  .forEach((button) => {
    button.addEventListener('click', function () {
      const transactionId = this.dataset.transactionId;
      const paymentProofInput = document.getElementById('sentProof');
      const confirmBtn = document.querySelector('.confirm-transaction-btn');
      const cancelBtn = document.querySelector('.cancel-transaction-btn');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          confirmBtn.style.opacity = '0.5';
          confirmBtn.textContent = 'Processing...';
          confirmBtn.disabled = true;
          // Ensure a file is selected
          if (paymentProofInput.files.length === 0) {
            showAlert('error', 'Please upload a proof of payment.');
            confirmBtn.disabled = false; // Re-enable the button
            confirmBtn.textContent = 'Confirm'; // Reset text content
            confirmBtn.style.opacity = '1'; // Reset opacity
            return;
          }
          // Prepare the FormData object
          const formData = new FormData();
          formData.append('paymentProof', paymentProofInput.files[0]); // Add the file to the request
          try {
            const response = await axios.patch(
              `/api/v1/transactions/confirm-transaction/${transactionId}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );
            if (response.data.status === 'success') {
              // Show a success alert or perform any action
              showAlert('success', 'successful!');

              // Redirect to the account page after a delay
              window.setTimeout(() => {
                location.reload();
              }, 3000);
            }
          } catch (err) {
            showAlert('error', err.response.data.message);
            confirmBtn.disabled = false; // Re-enable the button
            confirmBtn.textContent = 'Confirm'; // Reset text content
            confirmBtn.style.opacity = '1'; // Reset opacity
          }
        });
      }
      if (cancelBtn) {
        cancelBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          cancelBtn.disabled = true;
          cancelBtn.style.opacity = '0.5';
          cancelBtn.textContent = 'Processing...';
          try {
            const response = await axios.patch(
              `/api/v1/transactions/decline-transaction/${transactionId}`,
            );
            if (response.data.status === 'success') {
              // Show a success alert or perform any action
              showAlert('success', 'successful!');

              // Redirect to the account page after a delay
              window.setTimeout(() => {
                location.reload();
              }, 3000);
            }
          } catch (err) {
            console.log(err);
            showAlert('error', err.response.data.message);
            cancelBtn.disabled = false;
            cancelBtn.style.opacity = '1';
            cancelBtn.textContent = 'Cancel';
          }
        });
      }
    });
  });

document.querySelectorAll('.edit-rate-modal').forEach((button) => {
  button.addEventListener('click', function () {
    const rateId = this.dataset.rateId;
    const editButton = document.querySelector('.edit-rate-btn');
    editButton.addEventListener('click', async (e) => {
      e.preventDefault();
      editButton.style.opacity = '0.5';
      editButton.textContent = 'Processing...';
      const rate = {
        newRate: document.getElementById('rate').value,
        visibleRate: document.getElementById('visibleRate').value,
        direction: document.getElementById('direction').value,
      };
      try {
        const res = await axios.patch(
          `/api/v1/rates/edit-rate/${rateId}`,
          rate,
        );
        if (res.data.status === 'success') {
          showAlert('success', 'Rate updated successfully!');
          window.setTimeout(() => {
            location.assign('/admin/rates');
          }, 3000);
        }
      } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
        editButton.style.opacity = '1';
        editButton.textContent = 'Update Rate';
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
              location.reload();
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          confirmButton.style.opacity = '1';
          confirmButton.textContent = 'Confirm';
          window.setTimeout(() => {
            location.reload();
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
              location.reload();
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          shipButton.style.opacity = '1';
          shipButton.textContent = 'Shipped';
          window.setTimeout(() => {
            location.reload();
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
              location.reload();
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          deliverButton.style.opacity = '1';
          deliverButton.textContent = 'Delivered';
          window.setTimeout(() => {
            location.reload();
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
              location.reload();
            }, 3000);
          }
        } catch (err) {
          showAlert('error', err.response.data.message);
          cancelButton.style.opacity = '1';
          cancelButton.textContent = 'Cancelled';
          window.setTimeout(() => {
            location.reload();
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

      const availability = document.getElementById('availability').value;

      if (availability) {
        formData.append('availability', availability);
      }

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

document.querySelectorAll('.edit-currency-modal').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const currencyId = this.dataset.currencyId;
    const editButton = document.querySelector('.edit-currency-btn');
    editButton.addEventListener('click', async () => {
      editButton.style.opacity = '0.5';
      editButton.textContent = 'Updating...';
      const currency = {
        code: document.getElementById('currencyCode').value,
        name: document.getElementById('currencyName').value,
        symbol: document.getElementById('currencySymbol').value,
        status: document.getElementById('status').value,
      };
      try {
        const response = await axios.patch(
          `/api/v1/currencies/edit-currency/${currencyId}`,
          currency,
        );
        if (response.data.status === 'success') {
          showAlert('success', 'currency updated!');
          window.setTimeout(() => {
            location.assign('/admin/currencies');
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        editButton.style.opacity = '1';
        editButton.textContent = 'Save Changes';
      }
    });
  });
});

///////////////////////////    changing bank in the order modal     /////////////////////////////////////

// Get the select element
const bankList = document.getElementById('bankList');

let bankName = '';
let accountName = '';
let accountNumber = '';

// Add a change event listener
if (bankList) {
  bankList.addEventListener('change', function () {
    // Get the selected option
    const selectedOption = bankList.options[bankList.selectedIndex];

    // Get the attributes from the selected option
    bankName = selectedOption.getAttribute('data-bank-name');
    accountName = selectedOption.getAttribute('data-account-name');
    accountNumber = selectedOption.getAttribute('data-account-number');

    // // Example: Update the modal or UI with these details
    // document.getElementById('modalBankName').innerText = bankName || 'N/A';
    // document.getElementById('modalAccountName').innerText = accountName || 'N/A';
    // document.getElementById('modalAccountNumber').innerText = accountNumber || 'N/A';
  });
}

// Function to open the modal and set the amount
function openModal(grandTotal) {
  if (!bankName || !accountName || !accountNumber) {
    showAlert('error', 'Please select a bank before placing the order.');
    return;
  }
  // Set the amount in the modal
  const grandTotalAmount = document.getElementById('modalAmount');
  if (grandTotalAmount) {
    grandTotalAmount.innerText = grandTotal;
  }

  // document.querySelector(
  //   '#checkoutConfirmModal .fa-building-columns + p',
  // ).innerText = `Bank: ${bankName}`;
  document.getElementById('accountName').innerText = accountName;
  document.getElementById('accountNumber').innerText = accountNumber;
  document.getElementById('bankName').innerText = bankName;
  // Display the modal
  document.getElementById('checkoutConfirmModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
  document.getElementById('checkoutConfirmModal').style.display = 'none';
}

// Add event listener to the "Place Order" button
const confirmCheckoutButton = document.getElementById('confirmCheckoutButton');
if (confirmCheckoutButton) {
  confirmCheckoutButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default action

    // Get the total amount from the page
    const grandTotal = document.querySelector('.price').innerText.slice(1); // Assuming it's prefixed with '$'

    // Get the selected bank details from the button's dataset
    const bankName = this.dataset.bankName;
    const accountName = this.dataset.accountName;
    const accountNumber = this.dataset.accountNumber;

    // Open the modal and pass the total amount
    openModal(grandTotal, bankName, accountName, accountNumber);
  });
}

// Get the close button inside the modal
const checkoutButton = document.querySelector('#checkoutConfirmModal .close');

// Add event listener to the close button inside the modal
if (checkoutButton) {
  checkoutButton.addEventListener('click', function () {
    closeModal();
  });
}

function copyText(elementId) {
  // Get the text from the specified element
  var textToCopy = document.getElementById(elementId).innerText;

  // Create a temporary textarea element to hold the text
  var tempTextArea = document.createElement('textarea');
  tempTextArea.value = textToCopy;
  document.body.appendChild(tempTextArea);

  // Select the text in the textarea and copy it to the clipboard
  tempTextArea.select();
  document.execCommand('copy');

  // Remove the temporary textarea from the DOM
  document.body.removeChild(tempTextArea);

  // Optionally, show an alert or notification to indicate that the text was copied
  showAlert('success', 'Copied: ' + textToCopy);
}

document.addEventListener('DOMContentLoaded', function () {
  // Get the query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);

  // Get the value for category from the query parameters, defaulting to 'all'
  const selectedCategory = (urlParams.get('category') || 'all').toLowerCase();

  // Get the dropdown element
  const categorySelect = document.getElementById('selectCategory');

  // Set the selected value for the category dropdown
  Array.from(categorySelect.options).forEach((option) => {
    // Normalize the option value for comparison
    const normalizedOptionValue = option.value.toLowerCase(); // e.g., 'food-stuffs'
    if (normalizedOptionValue === selectedCategory) {
      option.selected = true; // Select the matching option
    }
  });

  // Listen for changes in the dropdown
  categorySelect.addEventListener('change', function () {
    // Replace spaces with dashes to match URL parameter format
    const newCategory = categorySelect.value; // The value is already in dash format
    urlParams.set('category', newCategory);
    urlParams.delete('page'); // Remove page and limit if they exist
    urlParams.delete('limit');
    window.location.search = urlParams.toString(); // Reload with updated parameters
  });
});

const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

const currentPage = parseFloat(
  document.querySelector('.currentPage').textContent,
);
const limit = parseFloat(document.querySelector('.pageLimit').textContent);
const totalPages = parseFloat(
  document.querySelector('.totalPages').textContent,
);

// Update button visibility
prevPageBtn.style.display = currentPage === 1 ? 'none' : 'inline-block';
nextPageBtn.style.display =
  currentPage === totalPages ? 'none' : 'inline-block';

if (nextPageBtn) {
  nextPageBtn.addEventListener('click', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nextPage = parseFloat(currentPage + 1);
    urlParams.set('page', nextPage); // Update or add the 'page' parameter
    urlParams.set('limit', limit); // Update or add the 'limit' parameter

    // Only navigate if we're not on the last page
    if (currentPage < totalPages) {
      window.location.search = urlParams.toString(); // Update the URL with the new query string
    }
  });
}

if (prevPageBtn) {
  prevPageBtn.addEventListener('click', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const prevPage = parseFloat(currentPage - 1);
    urlParams.set('page', prevPage); // Update or add the 'page' parameter
    urlParams.set('limit', limit); // Update or add the 'limit' parameter

    // Only navigate if we're not on the last page
    if (currentPage !== 0) {
      window.location.search = urlParams.toString(); // Update the URL with the new query string
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////          CATEGORY FOR ADMIN AFRO SHOP           ///////////////////////
// Function to handle category selection and redirection
// Function to handle category selection and redirection
function adminCategory() {
  const selectedCategory = document.getElementById(
    'categorySelectAdminAfroShop',
  ).value;
  const currentSuperCategory = document.getElementById(
    'currentSuperCategory',
  ).textContent;
  const url = selectedCategory
    ? `/admin/${currentSuperCategory}?category=${selectedCategory}`
    : `/admin/${currentSuperCategory}`;
  window.location.href = url;

  if (selectedCategory === 'all') {
    window.location.href = `/admin/${currentSuperCategory}?category=all`;
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

// Find suggestions on input event
const searchInputField = document.querySelector('.suggestions');

if (searchInputField) {
  searchInputField.addEventListener('input', async function (e) {
    e.preventDefault();
    const query = searchInputField.value;

    if (query.length > 0) {
      const suggestions = document.querySelectorAll('.list-of-suggestions');
      suggestions.forEach((input) => {
        input.style.display = 'block';
      });

      // Make sure there is something to search for
      try {
        // Correctly format the query parameter with '='
        const res = await fetch(
          `/api/v1/products/find?name=${encodeURIComponent(query)}`,
        );

        // Check if the response is okay (status 200-299)
        if (res.ok) {
          const data = await res.json();
          console.log(data);

          const suggestions = document.querySelectorAll('.list-of-suggestions');

          suggestions.forEach((input) => {
            input.innerHTML = '';
            data.data.products.forEach((product) => {
              const li = document.createElement('li');
              // Set inline styles
              li.style.padding = '5px'; // Add some padding
              li.style.backgroundColor = '#fff'; // Light background color
              li.style.cursor = 'pointer'; // Change cursor to pointer
              li.style.transition = 'background-color 0.3s'; // Transition for hover effect
              li.style.display = 'block';
              li.style.width = '100%';
              li.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

              // Add hover effect using mouse events
              li.addEventListener('mouseover', () => {
                li.style.backgroundColor = '#e0e0e0'; // Darker on hover
              });

              li.addEventListener('mouseout', () => {
                li.style.backgroundColor = '#f9f9f9'; // Revert on mouse out
              });

              li.textContent = product.name;
              input.appendChild(li);

              // Define a custom slugify function
              function slugify(text) {
                return text
                  .toString()
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, '-') // Replace spaces with -
                  .replace(/[^\w\-\.]+/g, '') // Remove all non-word chars except dot
                  .replace(/\-\-+/g, '-'); // Replace multiple - with single -
              }

              // Apply slugify to the list item's textContent
              li.addEventListener('click', () => {
                const slug = slugify(li.textContent);
                window.location.href = `/search?search=${slug}`; // Redirect to the product link with slug
              });
            });
          });

          // You can call a function to display suggestions here
          // displaySuggestions(data);
        } else {
          console.error('Error fetching suggestions:', res.statusText);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    } else {
      // Optionally clear suggestions if input is empty
      const suggestions = document.querySelectorAll('.list-of-suggestions');
      suggestions.forEach((input) => {
        input.style.display = 'none';
      });
    }
  });
}

const searchBtn = document.querySelectorAll('.search-btn');
const searchInputs = document.querySelectorAll('.suggestions');

if (searchBtn && searchInputs) {
  // Handle search button clicks
  searchBtn.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      handleSearch();
    });
  });

  // Handle pressing the 'Enter' key in the search input
  searchInputs.forEach((input) => {
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && input.value.trim().length > 0) {
        e.preventDefault();
        handleSearch();
      }
    });
  });
}

// Search handling logic
function handleSearch() {
  searchInputs.forEach((input) => {
    const query = input.value.trim();
    if (query.length > 0) {
      // Define a custom slugify function
      function slugify(text) {
        return text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/[^\w\-\.]+/g, '') // Remove all non-word chars except dot
          .replace(/\-\-+/g, '-'); // Replace multiple - with single -
      }

      const slug = slugify(query);
      window.location.href = `/search?search=${slug}`; // Redirect to the product link with slug
    }
  });
}
