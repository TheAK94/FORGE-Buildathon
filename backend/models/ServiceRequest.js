
const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    userMessage: {
      type: String,
      required: true,
      trim: true
    },

    identifiedService: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "pending",
        "analysing",
        "awaiting_information",
        "ready",
        "in_progress",
        "completed",
        "failed"
      ],
      default: "pending"
    },

    agentResponse: {
      type: String,
      default: ""
    },

    missingInformation: {
      type: [String],
      default: []
    },

    requiredInformation: {
      type: [String],
      default: []
    },

    requiredDocuments: {
      type: [String],
      default: []
    },

    availableInformation: {
      type: [String],
      default: []
    },

    availableDocuments: {
      type: [String],
      default: []
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);
