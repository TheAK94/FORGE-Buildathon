
import { useState } from "react";
import { createServiceRequest } from "../services/serviceRequestService";

const NewRequest = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please describe the service you need.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await createServiceRequest(message);
      setResult(data.request);
      setMessage("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content request-page">
      <div className="request-header">
        <span className="request-eyebrow">
          <i className="bi bi-stars"></i> AI-POWERED ASSISTANCE
        </span>

        <h1>What do you need help with?</h1>

        <p>
          Describe the government service you need.
          FORGE will understand your request and guide you through it.
        </p>
      </div>

      <form className="request-form" onSubmit={handleSubmit}>
        <label htmlFor="request-message">
          Describe your requirement
        </label>

        <textarea
          id="request-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: I want to apply for an income certificate in Uttar Pradesh..."
          rows={5}
          maxLength={2000}
          disabled={loading}
        />

        <div className="request-form-footer">
          <small>{message.length}/2000 characters</small>

          <button
            type="submit"
            className="request-submit"
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                Analysing...
              </>
            ) : (
              <>
                Analyse request
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}

      {result && (
        <section className="analysis-result">
          <div className="analysis-title">
            <i className="bi bi-check-circle-fill"></i>
            <h2>Request analysed</h2>
          </div>

          <div className="analysis-card">
            <small>IDENTIFIED SERVICE</small>
            <h3>{result.identifiedService || "Not identified"}</h3>

            <small>STATE</small>
            <p>{result.state || "Not specified"}</p>

            <small>FORGE'S ANALYSIS</small>
            <p>{result.agentResponse}</p>

            {result.missingInformation?.length > 0 && (
              <>
                <small>FOLLOW-UP QUESTIONS</small>
                <ul>
                  {result.missingInformation.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="request-status">
              Status: {result.status.replaceAll("_", " ")}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default NewRequest;
