import React, { useState } from "react";
import profile from "../Assets/profile.png";
import complaint from "../Assets/complaint.png";
import ProfileHeader from "./ProfileHeader";

export default function DashboardComplaints() {
  const [complaints] = useState([
    {
      complaintId: "123456",
      datePlaced: "2024-10-13",
      status: "Pending",
      dateResolved: "NA",
      verdict:
        "We will get back to you soon after we have investigated the issue and taken apt action. We thank you for your patience",
    },
    {
      complaintId: "654321",
      datePlaced: "2024-10-14",
      status: "Resolved",
      dateResolved: "2024-10-15",
      verdict:
        "The gorkan has been fined a substantial ammount and has been warned for the last time. We aplogize for the inconvenience and hope to improve our standards.",
    },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Function to open the modal with selected complaint details
  const handleDetailsClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedComplaint(null);
  };

  return (
    <>
      <ProfileHeader></ProfileHeader>

      <div
        className={`container Dashboard-container ${
          selectedComplaint ? "blurred" : ""
        }`}
      >
        <div className="row Dashboard-row2">
          <div className="col-md-8">
            <div className="complaint-card">
              <div className="complaint-card-content">
                <h2 className="complaints-card-title">Register a Complaint</h2>
                <p className="complaint-card-description">
                  Submit a Complaint to the admin panel in case of any problem.
                  Akhri Aramgah features smart AI and NLP features to streamline
                  the process of complaint resolution.
                </p>
                <button className="btn complaint-card-button">
                  Submit Complaint
                </button>
              </div>
              <div className="complaint-card-image-container">
                <img
                  src={complaint}
                  alt="Service Image"
                  className="complaint-card-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaints list */}
      <div
        className={`container Dashboard-container ${
          selectedComplaint ? "blurred" : ""
        }`}
      >
        <div className="row Dashboard-row2">
          <div className="col-md-10">
            <div className="complaint-card">
              <div className="container mt-4">
                <h2 className="complaints-internal-card-title">Complaints</h2>
                {complaints.length === 0 ? (
                  <p>No complaints made</p>
                ) : (
                  <div className="row">
                    {complaints.map((complaint) => (
                      <div
                        className="col-lg-6 col-md-12 mb-4"
                        key={complaint.complaintId}
                      >
                        <div className="complaint-card1">
                          <div className="complaint-internal-complaint-column p-3">
                            <div className="mb-3">
                              <span className="complaint-internal-label">
                                Complaint ID:
                              </span>
                              <span className="complaint-internal-value">
                                {complaint.complaintId}
                              </span>
                            </div>
                            <div className="mb-3">
                              <span className="complaint-internal-label">
                                Date:
                              </span>
                              <span className="complaint-internal-value">
                                {complaint.datePlaced}
                              </span>
                            </div>
                            <div className="mb-3">
                              <span className="complaint-internal-label">
                                Status:
                              </span>
                              <span className="complaint-internal-value complaint-internal-status">
                                {complaint.status}
                              </span>
                            </div>
                            <div className="text-start">
                              <button
                                className="btn complaint-internal-btn"
                                onClick={() => handleDetailsClick(complaint)}
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup for Complaint Details */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-heading">Details</h3>
            <p>
              <strong>Complaint ID:</strong> {selectedComplaint.complaintId}
            </p>
            <p>
              <strong>Date Placed:</strong> {selectedComplaint.datePlaced}
            </p>
            <p>
              <strong>Status:</strong> {selectedComplaint.status}
            </p>

            <p>
              <strong>Date Resolved:</strong> {selectedComplaint.dateResolved}
            </p>
            <p>
              <strong>Verdict:</strong> {selectedComplaint.verdict}
            </p>
            <div className="modal-button-div">
              <button className="btn modal-button" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
