
const ServiceRequest = require("../models/ServiceRequest");
const axios = require("axios");

exports.createRequest = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Please describe the service you need."
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        message: "Request must be under 2000 characters."
      });
    }

    // First save the request in MongoDB
    const request = await ServiceRequest.create({
      user: req.user._id,
      userMessage: message.trim(),
      status: "analysing"
    });

    try {
      // Send the request to the Python AI agent
      const aiResponse = await axios.post(
        `${process.env.AI_AGENT_URL}/analyze`,
        { message: message.trim() },
        { timeout: 60000 }
      );

      const analysis = aiResponse.data.analysis;

      // Save AI analysis
      request.identifiedService = analysis.identified_service;
      request.state = analysis.state;
      request.agentResponse = analysis.description;
      request.missingInformation = analysis.follow_up_questions;

      request.status = analysis.follow_up_questions.length > 0
        ? "awaiting_information"
        : "ready";

      await request.save();

      return res.status(201).json({
        message: "Service request analysed successfully.",
        request
      });

    } catch (aiError) {
      console.error("AI agent error:", aiError.message);

      request.status = "failed";
      await request.save();

      return res.status(502).json({
        message: "Your request was saved, but AI analysis failed.",
        requestId: request._id
      });
    }

  } catch (error) {
    console.error("Create request error:", error);

    res.status(500).json({
      message: "Failed to create service request."
    });
  }
};


exports.getRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({ requests });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service requests."
    });
  }
};


exports.getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!request) {
      return res.status(404).json({
        message: "Service request not found."
      });
    }

    res.status(200).json({ request });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service request."
    });
  }
};
