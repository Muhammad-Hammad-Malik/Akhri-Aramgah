import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner"; // Import the loader
import "react-toastify/dist/ReactToastify.css";

export default function GraveContainer() {
  const [graves, setGraves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentGrave, setCurrentGrave] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const token = localStorage.getItem("token");
  const jwt_token = jwtDecode(token);
  const userID = jwt_token.id;

  useEffect(() => {
    if (userID) {
      axios
        .get(`http://localhost:5004/api/getGravesByUser/${userID}`)
        .then((response) => {
          const data = response.data.map((grave) => ({
            name: grave.name,
            graveyard: grave.graveyardName,
            status:
              grave.device === "no" || grave.reading > 10 ? "At Risk" : "Safe",
            moistureReading: grave.reading !== null ? grave.reading : null,
            graveID: grave.GraveID || null,
            graveyardID: grave.GraveyardID || null,
            device: grave.device,
          }));
          setGraves(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching graves:", error);
          setLoading(false);
        });
    } else {
      console.error("No userID found in local storage.");
      setLoading(false);
    }
  }, []);

  const handleOpenDialog = (grave) => {
    setCurrentGrave(grave);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCardDetails({ cardNumber: "", expiryDate: "", cvv: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !cardDetails.cardNumber ||
      !cardDetails.expiryDate ||
      !cardDetails.cvv
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const payload = {
      userID,
      GraveyardID: currentGrave.graveyardID,
      GraveID: currentGrave.graveID,
    };

    axios
      .post("http://localhost:5004/api/graveMaintenance", payload)
      .then(() => {
        toast.success(
          "Success! Your grave will be repaired if there are damages"
        );
        handleCloseDialog();
      })
      .catch((error) => {
        console.error("Error scheduling maintenance:", error);
        toast.error("Failed to schedule maintenance.");
      });
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader-container">
          <InfinitySpin width="300" color="#4fa94d" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader />
      <ToastContainer />
      <div className="container Dashboard-container">
        <div className="row Dashboard-row2">
          <div className="col-md-10">
            <div className="grave-card">
              <div className="container mt-4">
                <h2 className="graves-internal-card-title">Graves</h2>
                <div className="row">
                  {graves.map((grave, index) => (
                    <div className="col-lg-6 col-md-12 mb-4" key={index}>
                      <div className="grave-card1">
                        <div className="grave-internal-grave-column p-3">
                          <div className="mb-3">
                            <span className="grave-internal-label">Name:</span>
                            <span className="grave-internal-value">
                              {grave.name}
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="grave-internal-label">
                              Graveyard:
                            </span>
                            <span className="grave-internal-value">
                              {grave.graveyard}
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="grave-internal-label">
                              Status:
                            </span>
                            <span
                              className="grave-internal-value"
                              style={{
                                color:
                                  grave.status === "At Risk" ? "red" : "green",
                              }}
                            >
                              {grave.status}
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="grave-internal-label">
                              Moisture Reading:
                            </span>
                            {grave.device === "no" ? (
                              <button className="btn btn-sm grave-internal-button">
                                Buy Device
                              </button>
                            ) : grave.moistureReading !== null ? (
                              <span className="grave-internal-value">
                                {grave.moistureReading}%
                              </span>
                            ) : (
                              <span className="grave-internal-value">
                                No Reading Available
                              </span>
                            )}
                          </div>
                          <div className="text-start">
                            <button
                              className="btn grave-internal-btn"
                              onClick={() => handleOpenDialog(grave)}
                            >
                              Schedule Maintenance
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Box */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Schedule Maintenance
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Card Number"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Expiry Date"
            name="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="CVV"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: "#22201d",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#44403c",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#22201d",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#44403c",
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
