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
    const { fullName, address, phoneNumber, country, region, city } = req.body;
    const newShippingAddress = await ShippingAddress.create({
      user,
      fullName,
      address,
      phoneNumber,
      country,
      region,
      city,
    });

    res.status(201).json({
      status: 'success',
      message: 'SHipping address added',
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
  const { addressId } = req.params;

  const requiredFields = [
    'fullName',
    'address',
    'phoneNumber',
    'country',
    'region',
    'city',
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
    const { fullName, address, phoneNumber, country, region, city } = req.body;

    const shippingAddress = await ShippingAddress.findOneAndUpdate(
      { _id: addressId, user },
      {
        user,
        fullName,
        address,
        phoneNumber,
        country,
        region,
        city,
      },
      { new: true, runValidators: true },
    );

    if (!shippingAddress) {
      return res.status(404).json({
        status: 'fail',
        message: 'Address not found',
      });
    }

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
