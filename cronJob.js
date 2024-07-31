/*const mongoose = require('mongoose');*/
const cron = require("node-cron");
const User = require("./models/userModel");

// Function to delete unconfirmed users after a specific time
async function deleteUnconfirmedUsers() {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const unconfirmedUsers = await User.find({
      confirmed: false,
      createdAt: { $lte: tenMinutesAgo },
    });

    for (const user of unconfirmedUsers) {
      await User.deleteOne({ _id: user._id });
      console.log(`Deleted unconfirmed user with ID: ${user._id}`);
    }
  } catch (error) {
    console.error("Error deleting unconfirmed users:", error);
  }
}

// Schedule the cron job to run every 10 minutes
module.exports = function () {
  // Schedule the cron job to run every 10 minutes
  cron.schedule("* * * * *", () => {
    deleteUnconfirmedUsers();
  });
};
