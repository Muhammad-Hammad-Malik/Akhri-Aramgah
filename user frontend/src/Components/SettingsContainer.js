import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorModal from "./ErrorModal"; // Import your error modal component

export default function SettingsContainer() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const handleUsernameSubmit = () => {
    if (!username) {
      setLoginError("Username cannot be empty");
      setIsModalOpen(true);
    } else {
      toast.success("Username change submitted");
      setUsername(""); // Reset input
    }
  };

  const handlePhoneSubmit = () => {
    const phoneRegex = /^0\d{10}$/;
    if (!phone) {
      setLoginError("Phone number cannot be empty");
      setIsModalOpen(true);
    } else if (!phoneRegex.test(phone)) {
      setLoginError("Phone number must be in the format 0XXXXXXXXXX");
      setIsModalOpen(true);
    } else {
      toast.success("Phone number change submitted");
      setPhone(""); // Reset input
    }
  };

  const handlePasswordSubmit = () => {
    if (!password) {
      setLoginError("Password cannot be empty");
      setIsModalOpen(true);
    } else if (password.length < 8) {
      setLoginError("Password must be at least 8 characters");
      setIsModalOpen(true);
    } else {
      toast.success("Password change submitted");
      setPassword(""); // Reset input
    }
  };

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setLoginError("Email cannot be empty");
      setIsModalOpen(true);
    } else if (!emailRegex.test(email)) {
      setLoginError("Invalid email format");
      setIsModalOpen(true);
    } else {
      toast.success("Email change submitted");
      setEmail(""); // Reset input
    }
  };

  return (
    <>
      <ProfileHeader />

      <div className="container settings-container">
        <div className="row settings-row">
          {/* Change Phone Number */}
          <div className="col-lg-6 settings-col-lg-6">
            <div className="card settings-active-orders settings-card">
              <h2 className="card-title settings-card-title">
                Change Phone Number
              </h2>
              <div className="card-content settings-card-content">
                <div className="settings-input-container">
                  <input
                    type="text"
                    className="settings-input-field"
                    placeholder="Enter new phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <button
                    onClick={handlePhoneSubmit}
                    className="settings-input-button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="col-lg-6 settings-col-lg-6">
            <div className="card settings-active-orders settings-card">
              <h2 className="card-title settings-card-title">
                Change Password
              </h2>
              <div className="card-content settings-card-content">
                <div className="settings-input-container">
                  <input
                    type="password"
                    className="settings-input-field"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={handlePasswordSubmit}
                    className="settings-input-button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Username */}
          <div className="col-lg-6 settings-col-lg-6">
            <div className="card settings-active-orders settings-card">
              <h2 className="card-title settings-card-title">
                Change Username
              </h2>
              <div className="card-content settings-card-content">
                <div className="settings-input-container">
                  <input
                    type="text"
                    className="settings-input-field"
                    placeholder="Enter new username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button
                    onClick={handleUsernameSubmit}
                    className="settings-input-button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Email */}
          <div className="col-lg-6 settings-col-lg-6">
            <div className="card settings-active-orders settings-card">
              <h2 className="card-title settings-card-title">Change Email</h2>
              <div className="card-content settings-card-content">
                <div className="settings-input-container">
                  <input
                    type="email"
                    className="settings-input-field"
                    placeholder="Enter new email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    className="settings-input-button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for error messages */}
        {isModalOpen && (
          <ErrorModal message={loginError} onClose={closeModal} />
        )}

        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </div>
    </>
  );
}
