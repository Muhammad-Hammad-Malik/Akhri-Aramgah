import React, { useState } from "react";
import MapComponent from "../Components/MapLocation";
import CreateMorgue from "../Components/CreateMorgue";

const AddMorgue = () => {
    const [step, setStep] = useState(1);
    const [sourceLocation, setSourceLocation] = useState("");

    const handlePositionReceived = (location) => {
        setSourceLocation(location); // Store the source location
    };

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1); // Move to the next step
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
            {/* Step 3: Create Graveyard */}
            {step === 2 && (
                <CreateMorgue
                    source={sourceLocation}
                />
            )}
        </div>
    );
};

export default AddMorgue;
