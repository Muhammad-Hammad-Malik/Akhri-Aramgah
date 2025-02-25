import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify styles
import "../Styling/CreateGraveyard.css"; // Import custom CSS

const CreateGraveyard = ({ adjustedRows, adjustedCols, source }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gorkanName: "",
    password: "",
    confirmPassword: "",
    customID: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.name) newErrors.name = "Graveyard name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.gorkanName) newErrors.gorkanName = "Gorkan name is required.";
    if (!formData.customID) newErrors.customID = "Custom ID is required.";

    return newErrors;
  };

  const handleCreate = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true); // Set loading state to true when the request starts

      const totalGraves = adjustedRows * adjustedCols;
      const payload = {
        name: formData.name,
        description: formData.description,
        totalGraves,
        totalRows: adjustedRows,
        totalCols: adjustedCols,
        sourcePin: source,
        gorkanName: formData.gorkanName,
        password: formData.password,
        customID: formData.customID,
      };

      try {
        const response = await fetch(
          "http://localhost:5005/api/graveyard/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create graveyard. Please try again.");
        }

        const data = await response.json();
        toast.success("Graveyard created successfully!");
        console.log("API Response:", data);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (error) {
        toast.error(error.message || "Error creating graveyard.");
        console.error("API Error:", error);
      } finally {
        setLoading(false); // Set loading state to false after the request completes
      }
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card add-grave-card shadow-sm">
            <div className="card-body add-grave-body">
              <h5 className="card-title text-center mb-4 custom-heading">
                Create Graveyard
              </h5>

              {/* Graveyard Name */}
              <div className="mb-3">
                <label className="form-label">Graveyard Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <div className="text-danger add-grave-error">
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
                {errors.description && (
                  <div className="text-danger add-grave-error">
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Gorkan Name */}
              <div className="mb-3">
                <label className="form-label">Gorkan Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="gorkanName"
                  value={formData.gorkanName}
                  onChange={handleInputChange}
                />
                {errors.gorkanName && (
                  <div className="text-danger add-grave-error">
                    {errors.gorkanName}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Graveyard Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <div className="text-danger add-grave-error">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <div className="text-danger add-grave-error">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Custom ID */}
              <div className="mb-3">
                <label className="form-label">Custom ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="customID"
                  value={formData.customID}
                  onChange={handleInputChange}
                />
                {errors.customID && (
                  <div className="text-danger add-grave-error">
                    {errors.customID}
                  </div>
                )}
              </div>

              {/* Total Graves */}
              <div className="mb-3">
                <label className="form-label">Total Graves</label>
                <input
                  type="text"
                  className="form-control"
                  value={adjustedRows * adjustedCols}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between button-div">
            <button className="btn map-button" onClick={handleCancel}>
              Cancel
            </button>
            <button
              className="btn map-button"
              onClick={handleCreate}
              disabled={loading} // Disable the submit button when loading
            >
              {loading ? "Creating..." : "Submit"} {/* Change button text */}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default CreateGraveyard;
