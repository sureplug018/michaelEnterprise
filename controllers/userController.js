const User = require('../models/userModel');

exports.changeUserRole = async (req, res) => {
  const user = req.user;
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email is required',
    });
  }

  if (!role) {
    return res.status(400).json({
      status: 'fail',
      message: 'User role is required',
    });
  }
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    checkUser.role = role;

    const updatedRole = await checkUser.save();

    return res.status(200).json({
      status: 'success',
      data: {
        updatedRole,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
