const ShippingAddress = require('../models/shippingAddressModel');

exports.createShippingAddress = async (req, res) => {
  const user = req.user.id;

  const requiredFields = [
    'fullName',
    'address',
    'phoneNumber',
    'country',
    'region',
    'city',
    'postalCode',
    'postOfficeAddress',
    'passportNumber',
  ];

  // Validate request body
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ status: 'fail', message: `${field} is required` });
    }
  }
  try {
    // check if user already has a shipping address
    const checkAddress = await ShippingAddress.findOne({ user });
    if (checkAddress) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already has a shipping address',
      });
    }
    const {
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
      postalCode,
      postOfficeAddress,
      passportNumber,
    } = req.body;

    // // Normalize the country input to uppercase
    // const normalizedCountry = country.trim().toUpperCase();

    // // Define allowed countries
    // const allowedCountries = ['NIGERIA', 'RUSSIA'];

    // // Validate the country input
    // if (!allowedCountries.includes(normalizedCountry)) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'Please input either Nigeria or Russia.',
    //   });
    // }

    const newShippingAddress = await ShippingAddress.create({
      user,
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
      postalCode,
      postOfficeAddress,
      passportNumber,
    });

    res.status(201).json({
      status: 'success',
      message: 'Shipping address added',
      data: {
        newShippingAddress,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.editShippingAddress = async (req, res) => {
  const user = req.user.id;
  // const { addressId } = req.params;

  const requiredFields = [
    'fullName',
    'address',
    'phoneNumber',
    'country',
    'region',
    'city',
    'postalCode',
    'postOfficeAddress',
    'passportNumber',
  ];

  // Validate request body
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ status: 'fail', message: `${field} is required` });
    }
  }
  try {
    const {
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
      postalCode,
      postOfficeAddress,
      passportNumber,
    } = req.body;

    // // Normalize the country input to uppercase
    // const normalizedCountry = country.trim().toUpperCase();

    // // Define allowed countries
    // const allowedCountries = ['NIGERIA', 'RUSSIA'];

    // // Validate the country input
    // if (!allowedCountries.includes(normalizedCountry)) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'Invalid country. Please select either Nigeria or Russia.',
    //   });
    // }

    const shippingAddress = await ShippingAddress.findOne({ user });

    if (!shippingAddress) {
      return res.status(404).json({
        status: 'fail',
        message: 'Address not found',
      });
    }

    shippingAddress.fullName = fullName;
    shippingAddress.address = address;
    shippingAddress.phoneNumber = phoneNumber;
    shippingAddress.country = country;
    shippingAddress.region = region;
    shippingAddress.city = city;
    shippingAddress.postalCode = postalCode;
    shippingAddress.postOfficeAddress = postOfficeAddress;
    shippingAddress.passportNumber = passportNumber;

    await shippingAddress.save();

    res.status(201).json({
      status: 'success',
      message: 'Shipping address successfully updated',
      data: {
        shippingAddress,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
