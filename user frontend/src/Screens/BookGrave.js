import React, { useState } from "react";
import GraveyardChooser from "../Components/GraveyardChooser";
import GraveyardMap from "../Components/GraveyardMap";
import GraveCart from "../Components/GraveCart"; // Import GraveCart component

const BookGrave = () => {
  const [selectedGraveyard, setSelectedGraveyard] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [selectedGrave, setSelectedGrave] = useState(null); // Track the selected grave

  // Handle step 1: Select Graveyard
  const handleNextGraveyard = (graveyardId) => {
    setSelectedGraveyard(graveyardId);
    setCurrentStep(2); // Move to Step 2 (Graveyard Map)
  };

  // Handle step 2: Select Grave
  const handleNextMap = (graveId) => {
    setSelectedGrave(graveId);
    setCurrentStep(3); // Move to Step 3 (GraveCart)
  };

  return (
    <div>
      {currentStep === 1 && <GraveyardChooser onNext={handleNextGraveyard} />}
      {currentStep === 2 && (
        <GraveyardMap GraveyardID={selectedGraveyard} onNext={handleNextMap} />
      )}
      {currentStep === 3 && (
        <GraveCart GraveyardID={selectedGraveyard} GraveID={selectedGrave} />
      )}
    </div>
  );
};

export default BookGrave;
