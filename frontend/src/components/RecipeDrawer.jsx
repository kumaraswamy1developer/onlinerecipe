import React from "react";
import {
  Drawer, Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableRow, TableCell
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function RecipeDrawer({ open, onClose, recipe }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: "100%", sm: 500 } } }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>{recipe?.title}</Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Cuisine: {recipe?.cuisine || "—"}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
          {recipe?.description || "No description."}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Total Time</Typography>
            <Typography variant="body1">{recipe?.total_time ?? "—"} min</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Serves</Typography>
            <Typography variant="body1">{recipe?.serves ?? "—"}</Typography>
          </Box>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Prep & Cook Times</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Prep Time</Typography>
                <Typography variant="body1">{recipe?.prep_time ?? "—"} min</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Cook Time</Typography>
                <Typography variant="body1">{recipe?.cook_time ?? "—"} min</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Nutrients</Typography>
        <Table size="small">
          <TableBody>
            {[
              "calories",
              "carbohydrateContent",
              "cholesterolContent",
              "fiberContent",
              "proteinContent",
              "saturatedFatContent",
              "sodiumContent",
              "sugarContent",
              "fatContent",
            ].map((k) => (
              <TableRow key={k}>
                <TableCell sx={{ textTransform: "capitalize" }}>{k.replace("Content", "")}</TableCell>
                <TableCell>{recipe?.nutrients?.[k] ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Drawer>
  );
}
