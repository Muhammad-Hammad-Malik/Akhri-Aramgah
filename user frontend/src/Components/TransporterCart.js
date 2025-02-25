import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import { ToastContainer, toast } from "react-toastify";
import "../Styling/TransportCart.css";

const calculateFare = (distance) => {
  const baseFare = 500; // Minimum fare
  const variableFare = distance * 50; // Pricing multiplier
  return Math.round(baseFare + variableFare); // Total fare rounded
};

const fetchAddress = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    return response.data.display_name || "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address."; // Return a default message in case of error
  }
};

export default function TransporterCart({ source, destination }) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fare, setFare] = useState(0);
  const [distance, setDistance] = useState(0);
  const [sourceAddress, setSourceAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState("");

  useEffect(() => {
    if (source && destination) {
      const fetchDistance = async () => {
        try {
          setLoading(true);
          setError("");

          // OSRM API endpoint to get distance
          const response = await axios.get(
            `http://router.project-osrm.org/route/v1/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?overview=false`
          );

          if (response.data.routes.length > 0) {
            const distancex = response.data.routes[0].distance / 1000; // Convert meters to kilometers
            setDistance(distancex);
            setFare(calculateFare(distancex));
          } else {
            setError("Unable to calculate distance.");
          }

          // Fetch addresses for source and destination
          const sourceAddr = await fetchAddress(source.lat, source.lng);
          const destAddr = await fetchAddress(destination.lat, destination.lng);
          setSourceAddress(sourceAddr);
          setDestinationAddress(destAddr);
        } catch (err) {
          console.error("Error fetching distance data:", err);
          setError("Error fetching distance data.");
        } finally {
          setLoading(false);
        }
      };

      fetchDistance();
    }
  }, [source, destination]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleExit = () => {
    navigate("/Dashboard");
  };

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv } = paymentInfo;
    const cardNumberRegex = /^[0-9]{4}$/; // Assuming a 16-digit card number
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    const cvvRegex = /^[0-9]{3}$/; // Assuming a 3-digit CVV

    if (!cardNumberRegex.test(cardNumber)) {
      setFormError("Invalid card number. Please enter a 4-digit card number.");
      return false;
    }
    if (!expiryDateRegex.test(expiryDate)) {
      setFormError("Invalid expiry date. Please use MM/YY format.");
      return false;
    }
    if (!cvvRegex.test(cvv)) {
      setFormError("Invalid CVV. Please enter a 3-digit CVV.");
      return false;
    }
    setFormError(""); // Clear previous errors if valid
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions while loading
    if (loading) return;

    setLoading(true); // Set loading state to true when the submission starts

    if (!validateCardDetails()) {
      setIsModalOpen(true);
      setLoading(false); // Set loading state to false if validation fails
      return; // Exit if validation fails
    }

    try {
      const token = localStorage.getItem("token");
      const jwt_token = jwtDecode(token);
      const userID = String(jwt_token.id);

      // Step 1: Call UserDetails API
      const userDetailsResponse = await axios.post(
        "http://localhost:5000/api/userdetails",
        { userID }
      );

      if (!userDetailsResponse.data.success) {
        setFormError("Failed to retrieve user details.");
        setIsModalOpen(true);
        setLoading(false); // Set loading state to false after operation is complete
        return;
      }

      // Get user details from response
      const { name, phone } = userDetailsResponse.data.userDetails;

      // Step 2: Prepare order data with user details
      const orderData = {
        userID,
        name,
        phone,
        sourcePin: `${source.lat},${source.lng}`,
        destinationPin: `${destination.lat},${destination.lng}`,
        sourceAddress,
        destinationAddress,
        totalDistance: distance,
        fare,
        status: "Pending", // Initial status
      };

      // Step 3: Call the second API to place the order
      const placeOrderResponse = await axios.post(
        "http://localhost:5001/api/placeOrder", // Backend API for placing the order
        orderData
      );

      if (placeOrderResponse.data.success) {
        toast.success(`Order placed successfully!`);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
      } else {
        setFormError("Failed to place the order. Please try again.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error in order submission:", error);
      setFormError("Error placing order. Please try again.");
      setIsModalOpen(true);
    } finally {
      setLoading(false); // Set loading state to false when the process ends
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError(""); // Clear error on modal close
  };

  return (
    <div className="transportpayment-container mt-5">
      <h2 className="transportpayment-title text-center mb-4">
        Transport Checkout
      </h2>
      <div className="transportpayment-card mb-4">
        <div className="transportpayment-card-body">
          <h5 className="transportpayment-card-title">Your Route</h5>
          <p>
            <strong>Source Address:</strong> {sourceAddress || "Fetching..."}
          </p>
          <p>
            <strong>Destination Address:</strong>{" "}
            {destinationAddress || "Fetching..."}
          </p>
          <p>
            <strong>Distance: {distance} Km</strong>
          </p>
          {loading ? (
            <strong>Loading distance...</strong>
          ) : error ? (
            <strong className="text-danger">{error}</strong>
          ) : (
            <strong className="mt-3">Total Fare: {Math.round(fare)} Rs</strong>
          )}
        </div>
      </div>

      <form className="transportpayment-card">
        <div className="transportpayment-card-body">
          <h5 className="transportpayment-card-title">Payment Information</h5>
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              className="transportpayment-input form-control"
              placeholder="Enter your card number"
            />
          </div>
          <div className="row mb-3">
            <div className="col">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handleInputChange}
                className="transportpayment-input form-control"
                placeholder="MM/YY"
              />
            </div>
            <div className="col">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                className="transportpayment-input form-control"
                placeholder="Enter your CVV"
              />
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn map-button" onClick={handleExit}>
              Cancel
            </button>
            <button
              className="btn map-button"
              onClick={handleSubmit}
              disabled={loading} // Disable the button if loading
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
      {isModalOpen && <ErrorModal message={formError} onClose={closeModal} />}
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
}
