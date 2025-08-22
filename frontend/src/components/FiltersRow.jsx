import React from "react";

import {
  Grid, Stack, TextField, MenuItem, FormControl, Select, InputLabel, Typography
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatshotIcon from "@mui/icons-material/Whatshot";

export default function FiltersRow({ filters, setFilters, onSearch }) {
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));
  const fireOnEnter = (e) => e.key === "Enter" && onSearch();

  // A small helper to render "operator + value" groups with a header label
  const OperatorNumber = ({
    label,
    opKey,
    valKey,
    placeholder,
    startIcon,
    defaultOp = ">=",
  }) => (
    <Stack spacing={0.75}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", pl: 0.25 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1}>
        <FormControl size="small" sx={{ minWidth: 92 }}>
          <InputLabel>Operator</InputLabel>
          <Select
            label="Operator"
            value={filters[opKey] || defaultOp}
            onChange={(e) => setFilters((f) => ({ ...f, [opKey]: e.target.value }))}
          >
            <MenuItem value=">=">≥</MenuItem>
            <MenuItem value="<=">≤</MenuItem>
            <MenuItem value="=">=</MenuItem>
            <MenuItem value=">">&gt;</MenuItem>
            <MenuItem value="<">&lt;</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="number"
          placeholder={placeholder}
          value={filters[valKey] || ""}
          onChange={set(valKey)}
          onKeyDown={fireOnEnter}
          InputProps={{
            startAdornment: startIcon,
            inputProps: { min: 0, step: "any" },
          }}
          sx={{ width: 160 }}
        />
      </Stack>
    </Stack>
  );

  return (
    <Grid container spacing={2}>
      {/* Title */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          size="small"
          label="Title contains"
          placeholder="e.g. pasta, pie"
          value={filters.title || ""}
          onChange={set("title")}
          onKeyDown={fireOnEnter}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "text.disabled" }} /> }}
        />
      </Grid>

      {/* Cuisine */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          size="small"
          label="Cuisine (exact)"
          placeholder="e.g. American"
          value={filters.cuisine || ""}
          onChange={set("cuisine")}
          onKeyDown={fireOnEnter}
          InputProps={{ startAdornment: <PublicIcon sx={{ mr: 1, color: "text.disabled" }} /> }}
        />
      </Grid>

      {/* Rating group */}
      <Grid item xs={12} md={4}>
        <OperatorNumber
          label="Rating"
          opKey="ratingOp"
          valKey="ratingVal"
          placeholder="e.g. 4.5"
          startIcon={<StarIcon sx={{ mr: 1, color: "text.disabled" }} />}
          defaultOp=">="
        />
      </Grid>

      {/* Total time group */}
      <Grid item xs={12} md={6}>
        <OperatorNumber
          label="Total time (min)"
          opKey="totalOp"
          valKey="totalVal"
          placeholder="e.g. 30"
          startIcon={<AccessTimeIcon sx={{ mr: 1, color: "text.disabled" }} />}
          defaultOp="<="
        />
      </Grid>

      {/* Calories group */}
      <Grid item xs={12} md={6}>
        <OperatorNumber
          label="Calories (kcal)"
          opKey="calOp"
          valKey="calVal"
          placeholder="e.g. 400"
          startIcon={<WhatshotIcon sx={{ mr: 1, color: "text.disabled" }} />}
          defaultOp="<="
        />
      </Grid>
    </Grid>
  );
}
