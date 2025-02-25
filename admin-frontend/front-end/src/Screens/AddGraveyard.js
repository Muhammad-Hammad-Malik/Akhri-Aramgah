import React, { useState } from "react";
import MapComponent from "../Components/MapLocation";
import GraveyardMap from "../Components/GraveyardMap";
import CreateGraveyard from "../Components/CreateGraveyard";

const AddGraveyard = () => {
  const [step, setStep] = useState(1);
  const [sourceLocation, setSourceLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [adjustedRows, setAdjustedRows] = useState(0);
  const [adjustedCols, setAdjustedCols] = useState(0);

  const handlePositionReceived = (location) => {
    setSourceLocation(location); // Store the source location
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1); // Move to the next step
  };

  const handleGraveyardDataSubmit = (rows, cols) => {
    setAdjustedRows(rows); // Set the adjusted rows
    setAdjustedCols(cols); // Set the adjusted columns
    setStep(3); // Move to the third step
  };

  const handleCancel = () => {
    setStep(1); // Reset to step 1 (can navigate to dashboard if needed)
  };

  return (
    <div className="container mt-4">
      {/* Step 1: Map Location */}
      {step === 1 && (
        <MapComponent
          message="Select Location for Graveyard"
          onPositionSet={handlePositionReceived}
          onNext={handleNext}
        />
      )}

      {/* Step 2: Graveyard Map */}
      {step === 2 && <GraveyardMap onDataSubmit={handleGraveyardDataSubmit} />}

      {/* Step 3: Create Graveyard */}
      {step === 3 && (
        <CreateGraveyard
          source={sourceLocation}
          destination={destinationLocation}
          adjustedRows={adjustedRows}
          adjustedCols={adjustedCols}
        />
      )}
    </div>
  );
};

export default AddGraveyard;
