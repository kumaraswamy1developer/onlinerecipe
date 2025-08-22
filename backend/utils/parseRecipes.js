const fs = require("fs");
const path = require("path");


function sanitizeRawJson(raw) {
  return raw
    // : NaN  -> : null
    .replace(/:\s*NaN\b/g, ": null")
    // : "NaN" / "nan" -> : null
    .replace(/:\s*"(?:NaN|nan)"\b/gi, ": null");
}


function toNullNumber(x) {
  if (x === null || x === undefined || x === "") return null;
  const n = Number(x);
  return Number.isNaN(n) ? null : n;
}


function extractCaloriesNum(nutrients) {
  if (!nutrients || typeof nutrients !== "object") return null;
  const c = nutrients.calories;
  if (c == null) return null;
  const m = String(c).match(/[\d.]+/);
  return m ? Number(m[0]) : null;
}


function normalizeRecipe(r) {
  return {
    cuisine: r.cuisine ?? null,
    title: r.title ?? null,
    rating: toNullNumber(r.rating),
    prep_time: toNullNumber(r.prep_time),
    cook_time: toNullNumber(r.cook_time),
    total_time: toNullNumber(r.total_time),
    description: r.description ?? null,
    nutrients: r.nutrients ?? null,          
    serves: r.serves ?? null,               
    calories_num: extractCaloriesNum(r.nutrients ?? null),
  };
}


function parseRecipesFromFile(filePath, { writeCleanedCopy = false } = {}) {
  const abs = path.resolve(filePath);
  const raw = fs.readFileSync(abs, "utf-8");
  const sanitized = sanitizeRawJson(raw);

  let data = JSON.parse(sanitized);
  const list = Array.isArray(data) ? data : Object.values(data);
  const rows = list.map(normalizeRecipe);

  const stats = {
    total: rows.length,
    nullified: {
      rating: rows.filter(x => x.rating === null).length,
      prep_time: rows.filter(x => x.prep_time === null).length,
      cook_time: rows.filter(x => x.cook_time === null).length,
      total_time: rows.filter(x => x.total_time === null).length,
    },
    withCaloriesNum: rows.filter(x => x.calories_num != null).length,
  };

  let cleanedPath;
  if (writeCleanedCopy) {
    cleanedPath = path.join(path.dirname(abs), path.basename(abs, ".json") + "_clean.json");
    fs.writeFileSync(cleanedPath, sanitized, "utf-8");
  }

  return { rows, stats, cleanedPath };
}

module.exports = {
  sanitizeRawJson,
  toNullNumber,
  extractCaloriesNum,
  normalizeRecipe,
  parseRecipesFromFile,
};
