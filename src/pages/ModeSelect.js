import { useState } from "react";

function ModeSelect({ setMode }) {
  const [selectedMode, setSelectedMode] = useState("all"); // ✅ default = all

  const handleSelect = () => {
    setMode(selectedMode);
  };

  return (
    <div>
      <h2>Select Mode</h2>

      <select
        value={selectedMode}
        onChange={(e) => setSelectedMode(e.target.value)}
      >
        <option value="all">All</option> {/* ✅ Added */}
        <option value="study">Study</option>
        <option value="devotional">Devotional</option>
        <option value="kids">Kids</option>
        <option value="comedy">Comedy</option>
        <option value="fashion">Fashion</option>
        <option value="food">Food</option>
        <option value="travel">Travel</option>
      </select>

      <br /><br />
      <button onClick={handleSelect}>Continue</button>
    </div>
  );
}

export default ModeSelect;