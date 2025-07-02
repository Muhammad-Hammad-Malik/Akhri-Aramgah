import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify styles
import "../Styling/CreateGraveyard.css"; // Import custom CSS

const CreateMorgue = ({ source }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerName: "",
    password: "",
    confirmPassword: "",
    customID: "",
    cabins: 0,
    cabinsinrow: 0,
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

    if (!formData.name) newErrors.name = "Morgue name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.managerName)
      newErrors.managerName = "Manager name is required.";
    if (!formData.customID) newErrors.customID = "Custom ID is required.";
    if (!formData.cabins) newErrors.cabins = "Number of cabins is required.";
    if (!formData.cabinsinrow)
      newErrors.cabinsinrow = "Number of cabins in row is required.";
    if (!formData.cabinsinrow > formData.cabins)
      newErrors.cabinsinrow =
        "Number of cabins in row cannot be greater than total cabins.";

    return newErrors;
  };

  const handleCreate = async () => {
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true); // Set loading state to true when the request starts

      const payload = {
        name: formData.name,
        description: formData.description,
        totalCabins: formData.cabins,
        totalCabinsinRows: formData.cabinsinrow,
        source: source,
        managerName: formData.managerName,
        password: formData.password,
        customID: formData.customID,
      };
      console.log(payload);

      try {
        const response = await fetch(
          "http://localhost:5005/api/morgue/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create Morgue. Please try again.");
        }

        const data = await response.json();
        toast.success("Morgue created successfully!");
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
    } else {
      toast.error("Please fill in all the required fields.");
      console.log(Object.keys(formErrors).length);
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
                <label className="form-label">Morgue Name</label>
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
                <label className="form-label">Manager Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                />
                {errors.managerName && (
                  <div className="text-danger add-grave-error">
                    {errors.managerName}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Morgue Password</label>
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

              {/* Total Cabins */}
              <div className="mb-3">
                <label className="form-label">Total Cabins</label>
                <input
                  type="number"
                  className="form-control"
                  name="cabins"
                  value={formData.cabins}
                  onChange={handleInputChange}
                />
                {errors.cabins && (
                  <div className="text-danger add-grave-error">
                    {errors.cabins}
                  </div>
                )}
              </div>
              {/* Total Cabins in Row */}
              <div className="mb-3">
                <label className="form-label">Cabins in a row</label>
                <input
                  type="number"
                  className="form-control"
                  name="cabinsinrow"
                  value={formData.cabinsinrow}
                  onChange={handleInputChange}
                />
                {errors.cabinsinrow && (
                  <div className="text-danger add-grave-error">
                    {errors.cabinsinrow}
                  </div>
                )}
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

export default CreateMorgue;
