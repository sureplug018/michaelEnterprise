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

const makePayment = async (formData) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/transactions/create-transaction',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Transaction successful!');
      // Redirect
      window.setTimeout(() => {
        location.assign('/exchange/history');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
    // Ensure the button is reset after an error
    const submitBtn = document.querySelector('.make-payment');
    submitBtn.style.opacity = '1';
    submitBtn.textContent = 'Submit';
  }
};

// Function to add to beneficiary
const addToBeneficiary = async (accountName, bankName, accountNumber) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/beneficiaries/create-beneficiary',
      data: {
        accountName,
        bankName,
        accountNumber,
      },
    });
    // if (res.data.status === 'success') {
    //   showAlert('success', 'Beneficiary added successfully!');
    // } else {
    //   showAlert('error', 'Failed to add beneficiary.');
    // }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};

const updateUserDetailsExchange = async (firstName, lastName, phoneNumber) => {
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
        location.assign('/exchange/account');
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
        location.assign('/exchange/account');
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

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

const paymentForm = document.querySelector('.exchange-form');

const updateUserDetailsExchangeForm = document.querySelector(
  '.update-user-data-forms',
);
const userPasswordUpdateForm = document.querySelector(
  '.user-password-update-form',
);
const logoutUserBtn = document.querySelector('.signOut-user-btn');


///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

if (paymentForm) {
  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.querySelector('.make-payment');
    submitBtn.style.opacity = '0.5';
    submitBtn.textContent = 'Processing...';

    // Get the file input element
    const paymentProofInput = document.getElementById('paymentProof');

    // Ensure a file is selected
    if (paymentProofInput.files.length === 0) {
      showAlert('error', 'Please upload a proof of payment.');
      // Re-enable the button
      submitBtn.style.opacity = '1'; // Reset opacity
      submitBtn.textContent = 'Submit'; // Reset text content
      return;
    }

    const formData = new FormData();
    formData.append(
      'senderName',
      document.getElementById('senderFullName').value,
    );
    formData.append(
      'senderPhoneNumber',
      document.getElementById('phoneNumber').value,
    );
    formData.append('bankName', document.getElementById('bankName').value);
    formData.append(
      'accountName',
      document.getElementById('accountName').value,
    );
    formData.append(
      'accountNumber',
      document.getElementById('accountNumber').value,
    );
    formData.append(
      'amountSent',
      document.getElementById('amountToSend').value.split(' ').pop(),
    );
    formData.append(
      'amountToReceive',
      document.getElementById('amountToReceive').value.split(' ').pop(),
    );
    formData.append(
      'baseCurrency',
      document.getElementById('amountToSend').value.split(' ')[0],
    );
    formData.append(
      'targetCurrency',
      document.getElementById('amountToReceive').value.split(' ')[0],
    );
    formData.append('paymentProof', paymentProofInput.files[0]);
    formData.append(
      'rate',
      document.getElementById('rate').value.split(' ')[1],
    );

    // Make the payment
    await makePayment(formData);

    if (document.getElementById('checkbox').checked) {
      const accountName = document.getElementById('accountName').value;
      const bankName = document.getElementById('bankName').value;
      const accountNumber = document.getElementById('accountNumber').value;
      await addToBeneficiary(accountName, bankName, accountNumber);
    }

    // Reset the button after request completion
    submitBtn.style.opacity = '1';
    submitBtn.textContent = 'Submit';
  });
}

if (updateUserDetailsExchangeForm) {
  updateUserDetailsExchangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const updateBtn = document.querySelector('.update-btn');
    updateBtn.style.opacity = '0.5';
    updateBtn.textContent = 'Updating...';
    const firstName = document.getElementById('firstNames').value;
    const lastName = document.getElementById('lastNames').value;
    const phoneNumber = document.getElementById('phoneNumbers').value;
    await updateUserDetailsExchange(firstName, lastName, phoneNumber);
    updateBtn.style.opacity = '1';
    updateBtn.textContent = 'Save Changes';
  });
}

if (logoutUserBtn) {
  logoutUserBtn.addEventListener('click', logoutUser);
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
    button.textContent = 'Update Password';
  });
}

document.querySelectorAll('.edit-beneficiary-modal').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const beneficiaryId = this.dataset.beneficiaryId;
    const editButton = document.querySelector('.update-beneficiary-btn');
    editButton.addEventListener('click', async () => {
      editButton.style.opacity = '0.5';
      editButton.textContent = 'Updating...';
      const beneficiary = {
        accountName: document.getElementById('accountNames').value,
        bankName: document.getElementById('bankNames').value,
        accountNumber: document.getElementById('accountNumbers').value,
      };
      try {
        const response = await axios.patch(
          `/api/v1/beneficiaries/edit-beneficiary/${beneficiaryId}`,
          beneficiary,
        );
        if (response.data.status === 'success') {
          showAlert('success', 'Beneficiary updated!');
          window.setTimeout(() => {
            location.assign('/exchange/beneficiaries');
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

document.querySelectorAll('.delete-beneficiary-modal').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const beneficiaryId = this.dataset.beneficiaryId;
    const editButton = document.querySelector('.delete-beneficiary-btn');
    editButton.addEventListener('click', async () => {
      editButton.style.opacity = '0.5';
      editButton.textContent = 'Deleting...';
      try {
        const response = await axios.delete(
          `/api/v1/beneficiaries/delete-beneficiary/${beneficiaryId}`,
        );
        if (response.data.status === 'success') {
          showAlert('success', 'Beneficiary deleted!');
          window.setTimeout(() => {
            location.assign('/exchange/beneficiaries');
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        editButton.style.opacity = '1';
        editButton.textContent = 'yes, delete';
      }
    });
  });
});
