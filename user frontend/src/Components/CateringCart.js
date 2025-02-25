import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import ErrorModal from "./ErrorModal";
import "../Styling/TransportCart.css";

const fetchAddress = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    return response.data.display_name || "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address.";
  }
};

const calculateFare = () => {
  return 100; // Assume a flat fare of 100 Rs
};

export default function CateringCart({ source, orderDetails, price }) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceAddress, setSourceAddress] = useState("");
  const [fare, setFare] = useState(price);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState("");

  useEffect(() => {
    if (source) {
      const getAddress = async () => {
        try {
          setLoading(true); // Set loading true when fetching the address
          const address = await fetchAddress(source.lat, source.lng);
          setSourceAddress(address);
        } catch (err) {
          console.error("Error fetching address for source:", err);
          setError("Error fetching address.");
        } finally {
          setLoading(false); // Set loading false after fetching the address
        }
      };

      getAddress();
    }
  }, [source]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleExit = () => {
    navigate("/Dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions while loading
    if (loading) return;

    setLoading(true); // Set loading state to true when the submission starts

    try {
      const token = localStorage.getItem("token");
      const jwt_token = jwtDecode(token);
      const userID = String(jwt_token.id);

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

      const { name, phone } = userDetailsResponse.data.userDetails;

      const orderData = {
        userID,
        name,
        phone,
        sourcePin: `${source.lat},${source.lng}`,
        sourceAddress,
        fare,
        orderDetails: orderDetails,
        paymentInfo,
        status: "Pending",
      };

      const placeOrderResponse = await axios.post(
        "http://localhost:5002/api/placeOrder",
        orderData
      );

      if (placeOrderResponse.data.success) {
        toast.success(`Order placed successfully!`);
        setTimeout(() => {
          navigate("/Dashboard");
        }, 1000);
        setPaymentInfo({ cardNumber: "", expiryDate: "", cvv: "" });
      } else {
        setFormError("Failed to place the order. Please try again.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setFormError(String(error));
      setIsModalOpen(true);
    } finally {
      setLoading(false); // Set loading state to false when the process ends
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  return (
    <div className="catererpayment-container mt-5">
      <h2 className="transportpayment-title text-center mb-4">
        Catering Checkout
      </h2>

      <div className="transportpayment-card mb-4">
        <div className="transportpayment-card-body">
          <h5 className="transportpayment-card-title">Order Details</h5>
          <p>
            <strong>Source Address: </strong> {sourceAddress || "Fetching..."}
          </p>
          <p>
            <strong>Items: </strong> {orderDetails}
          </p>
          <p>
            <strong>Price: </strong> {fare} Rs
          </p>
        </div>
      </div>

      <form className="transportpayment-card" onSubmit={handleSubmit}>
        <div className="transportpayment-card-body">
          <h5 className="transportpayment-card-title">Payment Information</h5>

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            className="form-control mt-2"
            value={paymentInfo.cardNumber}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            className="form-control mt-2"
            value={paymentInfo.expiryDate}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            className="form-control mt-2"
            value={paymentInfo.cvv}
            onChange={handleInputChange}
          />

          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn map-button"
              onClick={handleExit}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn map-button"
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>

      {isModalOpen && <ErrorModal message={formError} onClose={closeModal} />}
      <ToastContainer position="top-right" autoClose={500} />
    </div>
  );
}
