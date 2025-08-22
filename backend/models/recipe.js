const db = require("../config/db"); 

function parseComparator(input) {
  if (!input) return null;
  // Decode any accidental encoding remnants/spaces
  const s = decodeURIComponent(String(input)).trim();
  const m = s.match(/^(>=|<=|=|>|<)\s*(\d+(?:\.\d+)?)$/);
  if (!m) return null; // return null -> ignore this filter
  return { op: m[1], val: Number(m[2]) };
}

function toNullNumber(x) { if (x==null) return null; const n=Number(x); return Number.isNaN(n)?null:n; }
function extractCaloriesNum(nutrients) {
  if (!nutrients || typeof nutrients !== "object") return null;
  const c = nutrients.calories; if (c == null) return null;
  const m = String(c).match(/[\d.]+/); return m ? Number(m[0]) : null;
}

async function findPaginated(page = 1, limit = 10) {
  const safePage = Math.max(parseInt(page) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
  const offset = (safePage - 1) * safeLimit;

  const [rows] = await db.query(
    `SELECT id, cuisine, title, rating, total_time, serves
     FROM recipes
     ORDER BY IFNULL(rating, -1e9) DESC, id ASC
     LIMIT ? OFFSET ?`,
    [safeLimit, offset]
  );
  const [[{ c }]] = await db.query(`SELECT COUNT(*) AS c FROM recipes`);
  return { page: safePage, limit: safeLimit, total: c, data: rows };
}

async function search(filters = {}) {
  const { title, cuisine, rating, total_time, calories } = filters;
  const where = []; const params = [];

  if (title) { where.push(`title LIKE ?`); params.push(`%${title}%`); }
  if (cuisine) { where.push(`cuisine = ?`); params.push(cuisine); }

  const rComp = parseComparator(rating);
  if (rComp) { where.push(`rating ${rComp.op} ?`); params.push(rComp.val); }

  const tComp = parseComparator(total_time);
  if (tComp) { where.push(`total_time ${tComp.op} ?`); params.push(tComp.val); }

  const cComp = parseComparator(calories);
  if (cComp) { where.push(`calories_num ${cComp.op} ?`); params.push(cComp.val); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await db.query(
    `SELECT id, cuisine, title, rating, total_time, serves
     FROM recipes
     ${whereSql}
     ORDER BY IFNULL(rating, -1e9) DESC, id ASC
     LIMIT 200`,
    params
  );
  return rows;
}

async function findById(id) {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;

  const [rows] = await db.query(
    `SELECT id, cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves
     FROM recipes
     WHERE id = ?`,
    [numericId]
  );
  return rows[0] || null;
}

async function bulkInsert(recipes = [], { batchSize = 1000 } = {}) {
  if (!Array.isArray(recipes) || recipes.length === 0) return 0;
  let inserted = 0;
  const sql = `
    INSERT INTO recipes
    (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves, calories_num)
    VALUES (?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?)
  `;
  for (let i = 0; i < recipes.length; i += batchSize) {
    const slice = recipes.slice(i, i + batchSize);
    const tasks = slice.map((r) => {
      const row = {
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
      return db.query(sql, [
        row.cuisine, row.title, row.rating, row.prep_time, row.cook_time, row.total_time,
        row.description, row.nutrients ? JSON.stringify(row.nutrients) : null,
        row.serves, row.calories_num,
      ]);
    });
    const results = await Promise.all(tasks);
    inserted += results.length;
  }
  return inserted;
}

module.exports = { findPaginated, search, findById, bulkInsert };
