import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { CardItem } from "./types";

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
      padding: 1,
      borderRadius: 2,
      fontFamily: "Comic Sans MS",
      cursor: "grabbing",
      zIndex: 999,
    }}
  >
    <CardContent>
      <Typography>{card.content}</Typography>
    </CardContent>
  </Card>
);

export default DragOverlayCard;
