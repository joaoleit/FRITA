import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface DragOverlayCardProps {
  card: CardItem;
}

const DragOverlayCard: React.FC<DragOverlayCardProps> = ({ card }) => (
  <Card
    sx={{
      backgroundColor: "#fff59d",
      boxShadow: 5,
      width: 150,
      height: 150,
      padding: 0,
      margin: 0,
      borderRadius: 2,
      fontFamily: "Comic Sans MS",
      cursor: "grabbing",
      zIndex: 999,
    }}
  >
    <CardContent sx={{ padding: 1.25 }}>
      <Typography
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "16px",
          margin: 0,
          padding: "0px",
        }}
      >
        {card.content}
      </Typography>
    </CardContent>
  </Card>
);

export default DragOverlayCard;
