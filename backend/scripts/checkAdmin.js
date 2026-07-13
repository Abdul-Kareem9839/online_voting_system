require("dotenv").config();
const mysql = require("mysql2");

const poolConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

const pool = mysql.createPool(poolConfig);
const promisePool = pool.promise();

async function checkAdmin() {
  try {
    const [rows] = await promisePool.query("SELECT * FROM admin");
    console.log("\n=== ADMINS IN DATABASE ===");
    console.log(rows);

    if (rows.length === 0) {
      console.log("\n⚠️ NO ADMIN FOUND - Database is empty!");
    } else {
      console.log("\n✅ Admin(s) found - Check credentials above");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkAdmin();
