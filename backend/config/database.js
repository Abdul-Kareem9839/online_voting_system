const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: process.env.DB_CA_CERT,
  },
});

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    await promisePool.execute("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

testConnection();

module.exports = promisePool;
