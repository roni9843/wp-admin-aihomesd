// Tools.js
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackspace,
  faDivide,
  faEquals,
  faMinus,
  faPlus,
  faTimes,
  faTrashAlt,
  faClock,
  faRuler,
  faStickyNote,
  faCalculator,
  faExpand,
  faCompress,
  faForward,
  faMapMarkerAlt,
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Typography, Button, TextField, Tooltip, Badge } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Form } from "react-bootstrap";
import { useTools } from '../Provider/ToolContext.js';
import "./Tools.css";

// Styled Components
const ToolBox = styled(Box)({
  background: '#fff',
  borderRadius: 10,
  padding: 15,
  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  border: '1px solid #1abc9c',
  width: 320,
  zIndex: 1000,
  position: 'absolute',
  cursor: 'move',
  borderTop: '4px solid #1abc9c',
});

const ToolButton = styled(Button)({
  background: 'linear-gradient(45deg, #1abc9c, #17a589)',
  color: '#fff',
  borderRadius: 8,
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #148c76, #1abc9c)',
  },
});

// Calculator Component
function Calculator({ onToggleFloat, position }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClick = (value) => !isMinimized && setInput(input + value);

  const calculate = () => {
    if (isMinimized) return;
    try {
      const result = eval(input).toString();
      setInput(result);
      setHistory([...history, `${input} = ${result}`]);
    } catch {
      setInput("Error");
    }
  };

  const clear = () => !isMinimized && setInput("");
  const backspace = () => !isMinimized && setInput(input.slice(0, -1));

  return (
    <Draggable defaultPosition={position}>
      <ToolBox className={isMinimized ? "minimized" : ""}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMinimized ? 0 : 2 }}>
          <Typography variant="h6" sx={{ color: '#1abc9c', fontWeight: 600 }}>Calculator</Typography>
          <Box>
            <Tooltip title={isMinimized ? "Expand" : "Minimize"}>
              <Button size="small" onClick={() => setIsMinimized(!isMinimized)} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={isMinimized ? faExpand : faCompress} />
              </Button>
            </Tooltip>
            <Tooltip title="Close Calculator">
              <Button size="small" onClick={onToggleFloat} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={faCalculator} />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        {!isMinimized && (
          <>
            <TextField
              value={input}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 8, background: '#e6f4f1', color: '#2d3748' } }}
            />
            <Box className="calculator-buttons">
              {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "(", "+", ")", "C", "⌫", "="].map((val, idx) => (
                <button
                  key={idx}
                  className="calculator-button"
                  style={{ display: isMinimized && ["(", "+", ")", "C", "⌫", "="].includes(val) ? 'none' : undefined }}
                  onClick={() => {
                    if (val === "C") clear();
                    else if (val === "⌫") backspace();
                    else if (val === "=") calculate();
                    else handleClick(val);
                  }}
                >
                  {val.match(/\d/) ? val : (
                    val === "/" ? <FontAwesomeIcon icon={faDivide} /> :
                    val === "*" ? <FontAwesomeIcon icon={faTimes} /> :
                    val === "-" ? <FontAwesomeIcon icon={faMinus} /> :
                    val === "+" ? <FontAwesomeIcon icon={faPlus} /> :
                    val === "=" ? <FontAwesomeIcon icon={faEquals} /> :
                    val === "." ? <span role="img" aria-label="left parenthesis">.</span> :
                    val === "(" ? <span role="img" aria-label="left parenthesis">(</span> :
                    val === ")" ? <span role="img" aria-label="left parenthesis">)</span> :
                    val === "C" ? <FontAwesomeIcon icon={faTrashAlt} /> :
                    val === "⌫" ? <FontAwesomeIcon icon={faBackspace} /> :
                    val === "=" ? <FontAwesomeIcon icon={faCalculator} /> :
                    <FontAwesomeIcon icon={val} />
                  )}
                </button>
              ))}
            </Box>
            <Box sx={{ mt: 2, maxHeight: 100, overflowY: 'auto' }}>
              <Typography variant="subtitle2" sx={{ color: '#718096' }}>History</Typography>
              {history.slice(-5).map((entry, idx) => (
                <Typography key={idx} variant="body2" sx={{ color: '#2d3748' }}>{entry}</Typography>
              ))}
            </Box>
          </>
        )}
      </ToolBox>
    </Draggable>
  );
}

// Timer Component
function Timer({ onToggleFloat, position }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  React.useEffect(() => {
    let interval;
    if (isRunning && !isMinimized) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isMinimized]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  return (
    <Draggable defaultPosition={position}>
      <ToolBox className={isMinimized ? "minimized" : ""}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMinimized ? 0 : 2 }}>
          <Typography variant="h6" sx={{ color: '#1abc9c', fontWeight: 600 }}>Timer</Typography>
          <Box>
            <Tooltip title={isMinimized ? "Expand" : "Minimize"}>
              <Button size="small" onClick={() => setIsMinimized(!isMinimized)} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={isMinimized ? faExpand : faCompress} />
              </Button>
            </Tooltip>
            <Tooltip title="Close Timer">
              <Button size="small" onClick={onToggleFloat} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={faClock} />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        {!isMinimized && (
          <>
            <Typography variant="h4" sx={{ color: '#1abc9c', mb: 2 }}>{formatTime(time)}</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ToolButton onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? "Pause" : "Start"}
              </ToolButton>
              <ToolButton onClick={() => { setTime(0); setIsRunning(false); }}>Reset</ToolButton>
            </Box>
          </>
        )}
      </ToolBox>
    </Draggable>
  );
}

// Unit Converter Component
function UnitConverter({ onToggleFloat, position }) {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("m");
  const [result, setResult] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const units = { cm: 0.01, m: 1, km: 1000, inch: 0.0254 };

  const convert = () => {
    if (isMinimized) return;
    const valueInMeters = parseFloat(value) * units[fromUnit];
    const convertedValue = valueInMeters / units[toUnit];
    setResult(convertedValue.toFixed(2));
  };

  return (
    <Draggable defaultPosition={position}>
      <ToolBox className={isMinimized ? "minimized" : ""}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMinimized ? 0 : 2 }}>
          <Typography variant="h6" sx={{ color: '#1abc9c', fontWeight: 600 }}>Unit Converter</Typography>
          <Box>
            <Tooltip title={isMinimized ? "Expand" : "Minimize"}>
              <Button size="small" onClick={() => setIsMinimized(!isMinimized)} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={isMinimized ? faExpand : faCompress} />
              </Button>
            </Tooltip>
            <Tooltip title="Close Converter">
              <Button size="small" onClick={onToggleFloat} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={faRuler} />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        {!isMinimized && (
          <>
            <TextField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="number"
              label="Value"
              variant="outlined"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 8, background: '#e6f4f1', color: '#2d3748' } }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Form.Select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="unit-select">
                {Object.keys(units).map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </Form.Select>
              <Typography sx={{ alignSelf: 'center', color: '#2d3748' }}>to</Typography>
              <Form.Select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="unit-select">
                {Object.keys(units).map(unit => <option key={unit} value={unit}>{unit}</option>)}
              </Form.Select>
            </Box>
            <ToolButton onClick={convert}>Convert</ToolButton>
            {result && <Typography sx={{ mt: 2, color: '#1abc9c' }}>Result: {result} {toUnit}</Typography>}
          </>
        )}
      </ToolBox>
    </Draggable>
  );
}

// Notes Component
function Notes({ onToggleFloat, position }) {
  const [note, setNote] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Draggable defaultPosition={position}>
      <ToolBox className={isMinimized ? "minimized" : ""}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isMinimized ? 0 : 2 }}>
          <Typography variant="h6" sx={{ color: '#1abc9c', fontWeight: 600 }}>Quick Notes</Typography>
          <Box>
            <Tooltip title={isMinimized ? "Expand" : "Minimize"}>
              <Button size="small" onClick={() => setIsMinimized(!isMinimized)} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={isMinimized ? faExpand : faCompress} />
              </Button>
            </Tooltip>
            <Tooltip title="Close Notes">
              <Button size="small" onClick={onToggleFloat} sx={{ color: '#1abc9c' }}>
                <FontAwesomeIcon icon={faStickyNote} />
              </Button>
            </Tooltip>
          </Box>
        </Box>
        {!isMinimized && (
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Jot down your notes..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 8, background: '#e6f4f1', color: '#2d3748' } }}
          />
        )}
      </ToolBox>
    </Draggable>
  );
}

export default function Tools() {
  const { floatingTools, toggleFloat } = useTools();
  const activeToolCount = Object.values(floatingTools).filter(Boolean).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e6f4f1", p: 4, fontFamily: "'Poppins', sans-serif" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#2d3748', fontWeight: 700 }}>
          Utility Toolbox
        </Typography>
      </Box>

      <Box className="tools-grid">
        <Badge badgeContent={activeToolCount} color="error" overlap="rectangular">
          <ToolButton onClick={() => toggleFloat('calculator')}>
            <FontAwesomeIcon icon={faCalculator} className="me-2" /> Calculator
          </ToolButton>
        </Badge>
        <Badge badgeContent={activeToolCount} color="error" overlap="rectangular">
          <ToolButton onClick={() => toggleFloat('timer')}>
            <FontAwesomeIcon icon={faClock} className="me-2" /> Timer
          </ToolButton>
        </Badge>
        <Badge badgeContent={activeToolCount} color="error" overlap="rectangular">
          <ToolButton onClick={() => toggleFloat('converter')}>
            <FontAwesomeIcon icon={faRuler} className="me-2" /> Converter
          </ToolButton>
        </Badge>
        <Badge badgeContent={activeToolCount} color="error" overlap="rectangular">
          <ToolButton onClick={() => toggleFloat('notes')}>
            <FontAwesomeIcon icon={faStickyNote} className="me-2" /> Notes
          </ToolButton>
        </Badge>
      </Box>

      {/* Floating Tools */}
      {floatingTools.calculator && <Calculator onToggleFloat={() => toggleFloat('calculator')} position={{ x: 50, y: 50 }} />}
      {floatingTools.timer && <Timer onToggleFloat={() => toggleFloat('timer')} position={{ x: 400, y: 50 }} />}
      {floatingTools.converter && <UnitConverter onToggleFloat={() => toggleFloat('converter')} position={{ x: 50, y: 400 }} />}
      {floatingTools.notes && <Notes onToggleFloat={() => toggleFloat('notes')} position={{ x: 400, y: 400 }} />}
    </Box>
  );
}