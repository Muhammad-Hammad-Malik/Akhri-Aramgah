import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../src/Styling/Dashboard.css";
import "../src/Styling/Map.css";
import Dashboard from "./Screens/Dashboard";

import AddGraveyard from "./Screens/AddGraveyard";
import AddMorgue from "./Screens/AddMorgue";
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/addgraveyard" element={<AddGraveyard />} />
        <Route exact path="/addmorgue" element={<AddMorgue />} />
      </Routes>
    </Router>
  );
}

export default App;
