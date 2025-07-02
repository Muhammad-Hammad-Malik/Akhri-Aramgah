import React from "react";
import img1 from "../Assets/morgue.jpeg";
import img2 from "../Assets/graveyard.jpg";
import img3 from "../Assets/complaint.jpg";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  function addgraveyard() {
    navigate("/addgraveyard");
  }
  function addmorgue() {
    navigate("/addmorgue");
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="container-fluid adk">
        <div className="row g-3">
          <div className="col-md-4" onClick={addmorgue}>
            <div className="admin-dashboard-card p-4 rounded-3 text-center">
              <img
                src={img1}
                alt="Book a Morgue Cabin"
                className="dashboard-services-card-image"
              />
              <h2 className="dashboard-services-card-title">Add Morgue</h2>
              <p className="dashboard-services-card-description">
                Add a new mortuary in the Akhri Aramgah.
              </p>
            </div>
          </div>
          <div className="col-md-4" onClick={addgraveyard}>
            <div className="admin-dashboard-card p-4 rounded-3 text-center">
              <img
                src={img2}
                alt="Book a Morgue Cabin"
                className="dashboard-services-card-image"
              />
              <h2 className="dashboard-services-card-title">Add Graveyard</h2>
              <p className="dashboard-services-card-description">
                Add a new graveyard in the Akhri Aramgah.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-dashboard-card p-4 rounded-3 text-center">
              <img
                src={img3}
                alt="Book a Morgue Cabin"
                className="dashboard-services-card-image"
              />
              <h2 className="dashboard-services-card-title">
                Review Complaints
              </h2>
              <p className="dashboard-services-card-description">
                Check and review customer complaints.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
