import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

interface CountdownTimerProps {
  isScrumMaster: boolean;
  handleRetroTimeChange: (newTime: number) => void;
  handleRetroRunningChange: (isRunning: boolean) => void;
  retroTime: number;
  retroTimeRunning: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  isScrumMaster,
  handleRetroRunningChange,
  handleRetroTimeChange,
  retroTime,
  retroTimeRunning,
}) => {
  const [timeLeft, setTimeLeft] = useState(retroTime);
  const [running, setRunning] = useState(retroTimeRunning);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("12");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log("CountdownTimer mounted with initial time:", retroTime, running);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setRunning(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timeLeft]);

  const handleStart = () => {
    setRunning(true);
    handleRetroRunningChange(true);
  };

  const handlePause = () => {
    setRunning(false);
    handleRetroRunningChange(false);
  };

  const handleReset = () => {
    setRunning(false);
    setTimeLeft(parseInt(inputValue) * 60 || 0);
    handleRetroRunningChange(false);
  };

  const handleTimeClick = () => {
    if (!running) {
      setEditing(true);
      setInputValue(String(Math.floor(timeLeft / 60)));
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const confirmNewTime = () => {
    const minutes = parseInt(inputValue);
    if (!isNaN(minutes) && minutes >= 0) {
      setTimeLeft(minutes * 60);
      handleRetroTimeChange(minutes * 60);
    }
    setEditing(false);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmNewTime();
    if (e.key === "Escape") setEditing(false);
  };

  useEffect(() => {
    setTimeLeft(retroTime);
    setRunning(retroTimeRunning);
  }, [retroTime, retroTimeRunning]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <IconButton
        onClick={running ? handlePause : handleStart}
        disabled={editing || !isScrumMaster}
      >
        {running ? (
          <PauseCircleOutlineIcon
            fontSize="large"
            sx={{ color: !isScrumMaster ? "none" : "#1B1B1B" }}
          />
        ) : (
          <PlayCircleOutlineIcon
            fontSize="large"
            sx={{ color: !isScrumMaster ? "none" : "#1B1B1B" }}
          />
        )}
      </IconButton>
      {editing ? (
        <TextField
          type="number"
          value={inputValue}
          onChange={handleTimeInputChange}
          onBlur={confirmNewTime}
          onKeyDown={handleTimeKeyDown}
          autoFocus
          inputProps={{ min: 0 }}
          size="small"
        />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h4"
            onClick={handleTimeClick}
            sx={{ cursor: running ? "default" : "pointer" }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>
      )}
      <IconButton onClick={handleReset} disabled={editing || !isScrumMaster}>
        <CancelOutlinedIcon
          fontSize="large"
          sx={{ color: !isScrumMaster ? "none" : "#1B1B1B" }}
        />
      </IconButton>
    </Box>
  );
};

export default CountdownTimer;
