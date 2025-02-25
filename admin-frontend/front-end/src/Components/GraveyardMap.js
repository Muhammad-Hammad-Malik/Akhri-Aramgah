import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate for routing
import "../Styling/Graveyard.css";

const GraveyardMap = ({ onDataSubmit }) => {
  const [dimensions, setDimensions] = useState({ length: "", width: "" });
  const [graveyardGrid, setGraveyardGrid] = useState([]);
  const [adjustedRows, setAdjustedRows] = useState(0);
  const [adjustedCols, setAdjustedCols] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const calculateGraveyard = () => {
    const { length, width } = dimensions;

    if (!length || !width || length <= 0 || width <= 0) {
      alert("Please enter valid dimensions for the graveyard.");
      return;
    }

    const graveHeight = 2; // Each grave is 2 meters tall
    const graveWidth = 1; // Each grave is 1 meter wide
    const walkwayFrequency = 4; // Add walkway after every 4 graves
    const walkwayWidth = 1; // Walkway width in meters

    // Calculate rows and columns of graves
    const totalRows = Math.floor(length / graveHeight);
    const totalCols = Math.floor(width / graveWidth);

    // Calculate the number of walkways
    const walkwayRows = Math.floor(totalRows / walkwayFrequency);
    const walkwayCols = Math.floor(totalCols / walkwayFrequency);

    // Adjust total rows and columns after including walkways
    const adjustedRows1 = totalRows - walkwayRows;
    const adjustedCols2 = totalCols - walkwayCols;
    setAdjustedCols(adjustedCols2);
    setAdjustedRows(adjustedRows1);

    // Generate graveyard grid
    const grid = Array.from({ length: totalRows }, (_, rowIndex) =>
      Array.from({ length: totalCols }, (_, colIndex) => {
        // Every 5th row or column is a walkway
        if ((rowIndex + 1) % 5 === 0 || (colIndex + 1) % 5 === 0) {
          return "walkway";
        }

        // Otherwise, it's a grave
        return "grave";
      })
    );

    setGraveyardGrid(grid);

    // Pass the adjusted rows and columns to the parent
  };

  const handleNext = () => {
    if (graveyardGrid.length === 0) {
      alert("Wrong: You need to generate the grid first.");
      return;
    }
    if (onDataSubmit) {
      onDataSubmit(adjustedRows, adjustedCols);
      return;
    }
    // Navigate to the dashboard if next is clicked
  };

  const handleCancel = () => {
    // Implement cancel behavior as needed
    navigate("/dashboard");
  };

  return (
    <div className="container mt-4 mapper-container">
      <div className="row">
        {/* Input Section */}
        <div className="col-md-6">
          <div className="p-4 rounded-3 admin-dashboard1-card">
            <h5 className="custom-heading">Enter Graveyard Dimensions</h5>
            <div className="mb-3">
              <label htmlFor="length" className="form-label">
                Length (m)
              </label>
              <input
                type="number"
                id="length"
                className="form-control"
                value={dimensions.length}
                onChange={(e) =>
                  setDimensions({ ...dimensions, length: e.target.value })
                }
                placeholder="Enter length of plot"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="width" className="form-label">
                Width (m)
              </label>
              <input
                type="number"
                id="width"
                className="form-control"
                value={dimensions.width}
                onChange={(e) =>
                  setDimensions({ ...dimensions, width: e.target.value })
                }
                placeholder="Enter width of plot"
              />
            </div>
            <button
              className="btn btn-dark admin-dashboard-btn"
              onClick={calculateGraveyard}
            >
              Generate
            </button>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-dark admin-dashboard-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn  btn-dark admin-dashboard-btn"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Map Display Section */}
        <div className="col-md-6">
          <div className="p-4 rounded-3 admin-dashboard1-card scrollable-card">
            <h5 className="custom-heading">Graveyard Map</h5>
            {graveyardGrid.length > 0 ? (
              <div className="graveyard-grid">
                {graveyardGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className="graveyard-row">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        className={`grave-icon ${
                          cell === "walkway" ? "walkway" : ""
                        }`}
                      >
                        {cell === "grave" ? "🪦" : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">
                Enter dimensions to generate the map.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraveyardMap;
