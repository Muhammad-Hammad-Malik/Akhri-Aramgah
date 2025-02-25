import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const GraveCart = ({ GraveyardID, GraveID }) => {
  const navigate = useNavigate();
  const [deceasedName, setDeceasedName] = useState("");
  const [cnic, setCnic] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [causeOfDeath, setCauseOfDeath] = useState("");
  const [moistureDevice, setMoistureDevice] = useState(false);
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [price, setPrice] = useState(5000); // Default price
  const [loading, setLoading] = useState(false); // To track loading state
  const token = localStorage.getItem("token");
  const jwt_token = jwtDecode(token);
  const userID = jwt_token.id; // Assuming userID is in the token payload

  const causes = [
    "Heart Attack",
    "Cancer",
    "Stroke",
    "Accident",
    "Lung Disease",
    "Diabetes",
    "Kidney Failure",
    "Pneumonia",
    "COVID-19",
    "Old Age",
    "Other",
  ];

  const handleSubmit = async () => {
    if (loading) return; // If already loading, don't allow another submission

    // Validate CNIC
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicPattern.test(cnic)) {
      toast.error("Invalid CNIC format. Use xxxxx-xxxxxxx-x.");
      return;
    }

    // Check for missing fields
    if (!deceasedName || !dateOfDeath || !causeOfDeath) {
      toast.error("Please fill all the fields.");
      return;
    }

    setLoading(true); // Start loading when the submit button is clicked

    const data = {
      userID,
      GraveyardID,
      GraveID,
      deceasedName,
      cnic,
      dateOfDeath,
      causeOfDeath,
      moistureDevice,
    };

    try {
      const response = await fetch("http://localhost:5004/api/bookGrave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Grave booking successful!");
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
      } else {
        toast.error("Booking failed.");
      }
    } catch (error) {
      console.error("Error booking grave:", error);
      toast.error("Error booking grave.");
    } finally {
      setLoading(false); // Stop loading when the request is done
    }
  };

  const handleCheckboxChange = (e) => {
    setMoistureDevice(e.target.checked);
    setPrice(e.target.checked ? 8000 : 5000); // Adjust price based on checkbox
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={5000} />

      <div
        className="card shadow-lg grave-book-card"
        style={{
          width: "70vw",
          height: "70vh",
          overflow: "hidden",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 className="text-center fw-bold">Grave Order</h3>
        <div
          className="container overflow-auto"
          style={{ flex: 1, maxHeight: "calc(100% - 80px)" }}
        >
          {/* Form Inputs */}
          <div className="mb-3">
            <label htmlFor="deceasedName" className="form-label">
              Deceased Name
            </label>
            <input
              type="text"
              className="form-control"
              id="deceasedName"
              value={deceasedName}
              onChange={(e) => setDeceasedName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cnic" className="form-label">
              CNIC Number (xxxxx-xxxxxxx-x)
            </label>
            <input
              type="text"
              className="form-control"
              id="cnic"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              maxLength="15"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dateOfDeath" className="form-label">
              Date of Death
            </label>
            <input
              type="date"
              className="form-control"
              id="dateOfDeath"
              value={dateOfDeath}
              onChange={(e) => setDateOfDeath(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="causeOfDeath" className="form-label">
              Cause of Death
            </label>
            <select
              className="form-select"
              id="causeOfDeath"
              value={causeOfDeath}
              onChange={(e) => setCauseOfDeath(e.target.value)}
            >
              <option value="">Select Cause of Death</option>
              {causes.map((cause, index) => (
                <option key={index} value={cause}>
                  {cause}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="moistureDevice"
                checked={moistureDevice}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="moistureDevice">
                Moisture Device
              </label>
            </div>

            {/* Explanatory Section */}
            <div
              className="mt-2 p-3"
              style={{
                backgroundColor: "#fffbe6", // Light yellow background
                borderRadius: "8px",
                // Smaller width for the section
                fontSize: "0.9rem", // Slightly smaller text
                textAlign: "center",
              }}
            >
              <p className="mb-0">
                Our IoT-based moisture monitoring device continuously tracks the
                grave's moisture levels. It will notify you promptly if there’s
                a risk of damage due to excessive moisture, enabling you to take
                preventive measures and maintain the grave's condition.
              </p>
            </div>
          </div>

          <div className="mb-3">
            <h5>Price: {price}</h5>
          </div>

          {/* Credit Card Details */}
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">
              Card Number
            </label>
            <input
              type="text"
              className="form-control"
              id="cardNumber"
              value={creditCardDetails.cardNumber}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  cardNumber: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label htmlFor="expiryDate" className="form-label">
              Expiry Date
            </label>
            <input
              type="month"
              className="form-control"
              id="expiryDate"
              value={creditCardDetails.expiryDate}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  expiryDate: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cvv" className="form-label">
              CVV
            </label>
            <input
              type="text"
              className="form-control"
              id="cvv"
              value={creditCardDetails.cvv}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  cvv: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn map-button"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Cancel
          </button>
          <button
            className="btn map-button"
            onClick={handleSubmit}
            disabled={loading} // Disable button if loading
          >
            {loading ? "Submitting..." : "Submit"} {/* Show loading text */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraveCart;
