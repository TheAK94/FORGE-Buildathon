
const ServiceRequest = require("../models/ServiceRequest");
const Profile = require("../models/Profile");
const Document = require("../models/Document");
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

    // 1. Fetch user's profile and documents
    const [profile, documents] = await Promise.all([
      Profile.findOne({ user: req.user._id }),

      Document.find({ user: req.user._id })
        .select("documentName originalName mimeType")
    ]);

    // 2. Build profile availability context
    const profileContext = {
      personalDetailsAvailable: Boolean(
        profile?.personal?.fullName
      ),

      dateOfBirthAvailable: Boolean(
        profile?.personal?.dateOfBirth
      ),

      genderAvailable: Boolean(
        profile?.personal?.gender
      ),

      phoneAvailable: Boolean(
        profile?.personal?.phone
      ),

      emailAvailable: Boolean(
        profile?.personal?.email
      ),

      addressAvailable: Boolean(
        profile?.address?.house ||
        profile?.address?.street ||
        profile?.address?.village ||
        profile?.address?.district ||
        profile?.address?.pincode
      ),

      incomeAvailable: profile?.annualIncome != null,

      educationAvailable: Boolean(profile?.education),

      familyDetailsAvailable: Boolean(
        profile?.family?.fatherName ||
        profile?.family?.motherName
      )
    };

    // 3. Build document metadata context
    const documentContext = documents.map((doc) => ({
      name: doc.documentName,
      originalName: doc.originalName,
      mimeType: doc.mimeType
    }));

    // 4. Save request in MongoDB
    const request = await ServiceRequest.create({
      user: req.user._id,
      userMessage: message.trim(),
      status: "analysing"
    });

    try {
      // 5. Send request and vault context to Python
      const aiResponse = await axios.post(
        `${process.env.AI_AGENT_URL}/analyze`,
        {
          message: message.trim(),

          context: {
            profile: profileContext,
            documents: documentContext
          }
        },
        { timeout: 60000 }
      );

      const analysis = aiResponse.data.analysis;

      // 6. Save AI analysis
      request.identifiedService = analysis.identified_service;
      request.state = analysis.state;
      request.agentResponse = analysis.description;

      request.requiredInformation =
        analysis.required_information || [];

      request.requiredDocuments =
        analysis.required_documents || [];

      request.missingInformation =
        analysis.follow_up_questions || [];

      request.confidence = analysis.confidence ?? 0;

      request.status = request.missingInformation.length > 0
        ? "awaiting_information"
        : "ready";

      await request.save();

      return res.status(201).json({
        message: "Service request analysed successfully.",
        request
      });

    } catch (aiError) {
      console.error("AI agent error:", {
        message: aiError.message,
        status: aiError.response?.status,
        response: aiError.response?.data
      });

      request.status = "failed";
      await request.save();

      return res.status(502).json({
        message: "Your request was saved, but AI analysis failed.",
        requestId: request._id
      });
    }

  } catch (error) {
    console.error("Create request error:", error);

    return res.status(500).json({
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
    console.error("Get requests error:", error);

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
    console.error("Get request error:", error);

    res.status(500).json({
      message: "Failed to fetch service request."
    });
  }
};
