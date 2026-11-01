
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    documentName: {
      type: String,
      required: true,
      trim: true
    },

    originalName: {
      type: String,
      required: true
    },

    // Current storage location
    storageProvider: {
      type: String,
      enum: ["local", "cloudinary"],
      default: "local",
      required: true
    },

    // Used for local storage
    storagePath: {
      type: String,
      select: false
    },

    // Reserved for Cloudinary migration
    cloudinaryPublicId: {
      type: String,
      select: false
    },

    resourceType: {
      type: String,
      enum: ["image", "raw", "video"],
      default: "raw"
    },

    mimeType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Document", documentSchema);
