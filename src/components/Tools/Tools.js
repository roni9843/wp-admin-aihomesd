import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS

// Import FontAwesome Icons
import {
  faBackspace,
  faDivide,
  faEquals,
  faMinus,
  faPlus,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Tools.css"; // Custom CSS

// Basic Calculator Component
function Calculator() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput(input + value);
  };

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch (error) {
      setInput("Error");
    }
  };

  const clear = () => {
    setInput("");
  };

  const backspace = () => {
    setInput(input.slice(0, -1));
  };

  return (
    <div className="calculator">
      <input type="text" value={input} readOnly className="calculator-input" />
      <div className="calculator-buttons">
        {/* Numbers and operations */}
        {[
          { label: "7", value: "7" },
          { label: "8", value: "8" },
          { label: "9", value: "9" },
          { label: <FontAwesomeIcon icon={faPlus} />, value: "+" }, // Addition
          { label: "4", value: "4" },
          { label: "5", value: "5" },
          { label: "6", value: "6" },
          { label: <FontAwesomeIcon icon={faMinus} />, value: "-" }, // Subtraction
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: <FontAwesomeIcon icon={faTimes} />, value: "*" }, // Multiplication
          { label: "0", value: "0" },
          { label: ".", value: "." },
          { label: <FontAwesomeIcon icon={faDivide} />, value: "/" }, // Division
        ].map((item, index) => (
          <button
            key={index}
            className="calculator-button"
            onClick={() => handleClick(item.value)}
          >
            {item.label}
          </button>
        ))}

        {/* Equals button */}
        <button className="calculator-button equals-button" onClick={calculate}>
          <FontAwesomeIcon icon={faEquals} /> {/* Equals Icon */}
        </button>

        {/* Clear and Backspace buttons */}
        <button className="calculator-button clear-button" onClick={clear}>
          <FontAwesomeIcon icon={faTrashAlt} /> {/* Clear Icon */}
        </button>
        <button
          className="calculator-button backspace-button"
          onClick={backspace}
        >
          <FontAwesomeIcon icon={faBackspace} /> {/* Backspace Icon */}
        </button>
      </div>
    </div>
  );
}

export default function Tools() {
  const [value, onChange] = useState(new Date());

  return (
    <div className="tools-container">
      <div className="tools-wrapper">
        {/* Left: Calendar */}
        <div className="calendar-wrapper">
          <Calendar onChange={onChange} value={value} />
        </div>

        {/* Right: Calculator */}
        <div className="calculator-wrapper">
          <Calculator />
        </div>
      </div>
    </div>
  );
}
