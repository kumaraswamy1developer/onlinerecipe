const path = require("path");
const db = require("../config/db"); 
const { parseRecipesFromFile } = require("../utils/parseRecipes");

async function ensureSchema() {
  
  await db.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      cuisine VARCHAR(100),
      title VARCHAR(255),
      rating DOUBLE,
      prep_time INT,
      cook_time INT,
      total_time INT,
      description TEXT,
      nutrients JSON,
      serves VARCHAR(50),
      calories_num DECIMAL(10,2) NULL,
      INDEX idx_title (title),
      INDEX idx_cuisine (cuisine),
      INDEX idx_rating (rating),
      INDEX idx_calories_num (calories_num)
    )
  `);
}

async function insertBatch(rows) {
  if (!rows.length) return 0;

 
  const placeholders = rows.map(() => "(?,?,?,?,?,?,?,?,?,?)").join(",");
  const values = [];
  rows.forEach((r) => {
    values.push(
      r.cuisine,
      r.title,
      r.rating,
      r.prep_time,
      r.cook_time,
      r.total_time,
      r.description,
      r.nutrients ? JSON.stringify(r.nutrients) : null,
      r.serves,
      r.calories_num
    );
  });

  const sql = `
    INSERT INTO recipes
      (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves, calories_num)
    VALUES ${placeholders}
  `;

  const [result] = await db.query(sql, values);
  return result.affectedRows || rows.length;
}

async function main() {
  try {
    const jsonPath = path.resolve(__dirname, "US_recipes.json");

    
    const { rows, stats } = parseRecipesFromFile(jsonPath);
    console.log("Parsed stats:", stats);

   
    await ensureSchema();

    
    const BATCH = 800;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += BATCH) {
      const slice = rows.slice(i, i + BATCH);
     
      await db.query("START TRANSACTION");
      try {
        const n = await insertBatch(slice);
        inserted += n;
        await db.query("COMMIT");
      } catch (e) {
        await db.query("ROLLBACK");
        throw e;
      }
      console.log(`Inserted ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
    }

    console.log(`✅ Done. Inserted ${inserted} rows.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

main();
