import React from "react";
import { useState } from "react";
import profile from "../Assets/profile.png";
export default function ProfileHeader() {
  const name = useState("Hammad Malik");
  return (
    <>
      <div className="container Dashboard-container">
        <div className="user-profile">
          <img src={profile} alt="User Profile" />
          <span className="user-name">{name}</span>
        </div>
      </div>
    </>
  );
}
