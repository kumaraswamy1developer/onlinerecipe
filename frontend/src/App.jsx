import React, { useEffect, useMemo, useState } from "react";
import {
  Container, Paper, Stack, Typography, Divider, Pagination,
  FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";

import FiltersRow from "./components/FiltersRow";
import RecipeTable from "./components/RecipeTable";
import RecipeDrawer from "./components/RecipeDrawer";
import { getRecipes, searchRecipes, getRecipeById } from "./api";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({});
  const [searchMode, setSearchMode] = useState(false);

  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchPage = async (p = page, l = limit) => {
    setLoading(true);
    try {
      const res = await getRecipes({ page: p, limit: l });
      setRecipes(res.data || []);
      setTotal(res.total || 0);
    } catch {
      setRecipes([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await searchRecipes(filters);
      setRecipes(res.data || []);
      setTotal((res.data || []).length);
      setSearchMode(true);
      setPage(1);
    } catch {
      setRecipes([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setFilters({});
    setSearchMode(false);
    setPage(1);
    await fetchPage(1, limit);
  };

  useEffect(() => {
    if (!searchMode) fetchPage(page, limit);
  }, [page, limit, searchMode]);

  const onClickRow = async (row) => {
    try {
      const full = await getRecipeById(row.id);
      setSelected(full);
      setDrawerOpen(true);
    } catch {
      setSelected(null);
      setDrawerOpen(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Recipes</Typography>

      {/* Filters Card */}
      <Paper elevation={2} sx={{ p: 2.5, mb: 2 }}>
        <FiltersRow filters={filters} setFilters={setFilters} onSearch={runSearch} />
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
          <Button variant="contained" onClick={runSearch} disableElevation>Search</Button>
          <Button variant="outlined" onClick={clearSearch} disabled={!searchMode}>Clear Search</Button>
          <Divider flexItem orientation="vertical" sx={{ mx: 1.5 }} />
          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel>Results per page</InputLabel>
            <Select
              label="Results per page"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[15, 20, 25, 30, 40, 50].map((n) => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
            {loading ? "Loading…" : searchMode ? `${recipes.length} result(s)` : `${total} total`}
          </Typography>
        </Stack>
      </Paper>

      {/* Table / Empty states */}
      {recipes.length > 0 ? (
        <RecipeTable rows={recipes} onClickRow={onClickRow} loading={loading} />
      ) : (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
          {loading ? "Loading…" : searchMode ? "No results found." : "No data available."}
        </Paper>
      )}

      {/* Pagination (only in paginated mode) */}
      {!searchMode && recipes.length > 0 && (
        <Stack alignItems="flex-end" sx={{ py: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, val) => setPage(val)}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      )}

      <RecipeDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} recipe={selected} />
    </Container>
  );
}
