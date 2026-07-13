const mysql = require("mysql2");
require("dotenv").config();

const parseDatabaseUrl = (databaseUrl) => {
  try {
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname?.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    const sslMode =
      url.searchParams.get("ssl-mode") || url.searchParams.get("sslMode");

    if (process.env.DB_CA_CERT) {
      config.ssl = { ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n") };
    } else if (sslMode && sslMode.toLowerCase() !== "disabled") {
      config.ssl = { rejectUnauthorized: false };
    }

    return config;
  } catch (err) {
    console.error("Invalid DATABASE_URL:", err.message);
    return null;
  }
};

const poolConfig = process.env.DATABASE_URL
  ? parseDatabaseUrl(process.env.DATABASE_URL) || {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "online_voting_system",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_CA_CERT
        ? { ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n") }
        : undefined,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "online_voting_system",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.DB_CA_CERT
        ? { ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n") }
        : undefined,
    };

const pool = mysql.createPool(poolConfig);
const promisePool = pool.promise();

const testConnection = async () => {
  try {
    await promisePool.execute("SELECT 1");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

testConnection();

module.exports = promisePool;
module.exports.rawPool = pool;
