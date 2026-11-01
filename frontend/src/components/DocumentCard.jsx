
const DocumentCard = ({ document, onDelete, onDownload }) => {
  const icons = {
    identity: "bi-person-vcard",
    address: "bi-geo-alt",
    income: "bi-cash-stack",
    caste: "bi-file-earmark-text",
    residence: "bi-house",
    education: "bi-mortarboard",
    other: "bi-file-earmark"
  };

  return (
    <div className="document-card">
      <div className="document-card-top">
        <div className="document-icon">
          <i className={`bi ${icons[document.documentType] || icons.other}`}></i>
        </div>

        <div className="document-actions">
          <button
            className="document-action-btn"
            title="Download document"
            onClick={() => onDownload(document)}
          >
            <i className="bi bi-download"></i>
          </button>

          <button
            className="document-action-btn delete-btn"
            title="Delete document"
            onClick={() => onDelete(document._id)}
          >
            <i className="bi bi-trash3"></i>
          </button>
        </div>
      </div>

      <h6>{document.documentName}</h6>

      <p className="document-filename">
        {document.originalName}
      </p>

      <div className="document-card-bottom">
        <span className="document-category">
          {document.documentType}
        </span>

        <small>
          {new Date(document.createdAt).toLocaleDateString()}
        </small>
      </div>
    </div>
  );
};

export default DocumentCard;
