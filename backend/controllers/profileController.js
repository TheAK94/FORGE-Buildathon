
const Profile = require("../models/Profile");

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.user._id
    });

    if (!profile) {
      profile = await Profile.create({
        user: req.user._id
      });
    }

    res.status(200).json(profile);

  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile."
    });
  }
};

// Update logged-in user's profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "personal",
      "address",
      "family",
      "occupation",
      "annualIncome",
      "education"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: updates,
        $setOnInsert: { user: req.user._id }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: "Profile updated successfully.",
      profile
    });

  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile."
    });
  }
};
