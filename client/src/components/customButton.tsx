import React from "react";
import { Button, Typography } from "@mui/material";
import { grey, teal } from "@mui/material/colors";

const CustomButton = ({
  text,
  handleClick,
  disabled = false,
  children,
}: {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClick: (e: any) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Button
      startIcon={children}
      style={{
        backgroundColor: disabled ? grey[400] : teal["A700"],
        textTransform: "none",
        padding: "10px 10px",
        borderRadius: "5px",
      }}
      onClick={handleClick}
      disabled={disabled}
      fullWidth
    >
      <Typography variant="body1" color="white">
        {text}
      </Typography>
    </Button>
  );
};

export default CustomButton;
