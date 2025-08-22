require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "recipesdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("[db] Connected to MySQL");
  } catch (err) {
    console.error("[db] Connection failed:", err.message);
  }
})();

module.exports = pool;  
