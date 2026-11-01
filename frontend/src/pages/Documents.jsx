
import { useEffect, useState } from "react";
import DocumentCard from "../components/DocumentCard";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument
} from "../services/documentService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [message, setMessage] = useState("");

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch {
      setMessage("Unable to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !documentName.trim()) {
      setMessage("Please select a file and enter a name.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentName", documentName.trim());

    try {
      setUploading(true);
      setMessage("");

      await uploadDocument(formData);

      setFile(null);
      setDocumentName("");

      const fileInput = document.getElementById("document-file");
      if (fileInput) fileInput.value = "";

      await fetchDocuments();

      setMessage("Document uploaded successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await deleteDocument(id);

      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== id)
      );

      setMessage("Document deleted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete document."
      );
    }
  };

  const handleDownload = async (doc) => {
    try {
      const blob = await downloadDocument(doc._id);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = doc.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setMessage("Download failed.");
    }
  };

  return (
    <main className="main-content">

      <div className="page-header">
        <div>
          <span className="eyebrow">PERSONAL VAULT</span>
          <h2>Document Vault</h2>
          <p>Manage your important documents securely.</p>
        </div>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="document-stats">
        <div>
          <span>Total Documents</span>
          <h3>{documents.length}</h3>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">

        <div className="section-heading">
          <div className="section-icon">
            <i className="bi bi-cloud-arrow-up"></i>
          </div>
          <h5>Upload Document</h5>
        </div>

        <form onSubmit={handleUpload}>

          <div className="mb-3">
            <label className="form-label">Document Name</label>
            <input
              type="text"
              className="form-control"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g. Aadhaar Card"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Choose File</label>
            <input
              id="document-file"
              type="file"
              className="form-control"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0] || null)}
              required
            />
            <small className="text-muted">
              Supported formats: PDF, JPG and PNG (Max 10 MB)
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Uploading...
              </>
            ) : (
              <>
                <i className="bi bi-cloud-upload me-2"></i>
                Upload Document
              </>
            )}
          </button>

        </form>
      </div>

      {/* Documents List */}
      <div className="documents-list-section">

        <div className="documents-heading">
          <div>
            <h5>My Documents</h5>
            <p>{documents.length} documents stored</p>
          </div>
        </div>

        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-folder2-open"></i>
            <h5>No documents found</h5>
            <p>Upload your first document to get started.</p>
          </div>
        ) : (
          <div className="document-grid">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}

      </div>

    </main>
  );
};

export default Documents;
