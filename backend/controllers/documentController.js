
const Document = require("../models/Document");
const fs = require("fs/promises");

// Upload document
exports.uploadDocument = async (req, res) => {
  let uploadedFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a document."
      });
    }

    const { documentName } = req.body;

    if (!documentName?.trim()) {
      await fs.unlink(req.file.path).catch(() => {});
      uploadedFilePath = null;

      return res.status(400).json({
        message: "Document name is required."
      });
    }

    const document = await Document.create({
      user: req.user._id,
      documentName: documentName.trim(),
      originalName: req.file.originalname,
      storageProvider: "local",
      storagePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      resourceType: req.file.mimetype === "application/pdf"
        ? "raw"
        : "image"
    });

    uploadedFilePath = null;

    res.status(201).json({
      message: "Document uploaded successfully.",
      document
    });

  } catch (error) {
    console.error("Upload error:", error);

    if (uploadedFilePath) {
      await fs.unlink(uploadedFilePath).catch(() => {});
    }

    res.status(500).json({
      message: "Document upload failed."
    });
  }
};

// Get logged-in user's documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 });

    res.status(200).json(documents);

  } catch (error) {
    console.error("Fetch documents error:", error);

    res.status(500).json({
      message: "Failed to fetch documents."
    });
  }
};

// Download user's document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select("+storagePath");

    if (!document) {
      return res.status(404).json({
        message: "Document not found."
      });
    }

    if (document.storageProvider !== "local") {
      return res.status(400).json({
        message: "Unsupported storage provider."
      });
    }

    res.download(document.storagePath, document.originalName);

  } catch (error) {
    console.error("Download error:", error);

    res.status(500).json({
      message: "Download failed."
    });
  }
};

// Delete user's document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select("+storagePath");

    if (!document) {
      return res.status(404).json({
        message: "Document not found."
      });
    }

    if (document.storageProvider !== "local") {
      return res.status(400).json({
        message: "Unsupported storage provider."
      });
    }

    await document.deleteOne();

    try {
      await fs.unlink(document.storagePath);
    } catch (fileError) {
      console.error("File deletion error:", fileError.message);
    }

    res.status(200).json({
      message: "Document deleted successfully."
    });

  } catch (error) {
    console.error("Delete error:", error);

    res.status(500).json({
      message: "Failed to delete document."
    });
  }
};
