import React from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Rating, LinearProgress
} from "@mui/material";

export default function RecipeTable({ rows, onClickRow, loading }) {
  return (
    <Paper elevation={2}>
      {loading && <LinearProgress />}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Cuisine</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 160 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 140 }}>Total Time</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 140 }}>Serves</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                hover key={r.id} onClick={() => onClickRow(r)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell
                  title={r.title}
                  sx={{ maxWidth: 360, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {r.title}
                </TableCell>
                <TableCell>{r.cuisine || "—"}</TableCell>
                <TableCell>
                  {r.rating != null ? (
                    <Rating value={Number(r.rating)} precision={0.1} readOnly />
                  ) : "—"}
                </TableCell>
                <TableCell>{r.total_time ?? "—"} min</TableCell>
                <TableCell>{r.serves ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
