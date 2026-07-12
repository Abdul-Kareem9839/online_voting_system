const db = require("./database");

const createTables = async () => {
  const statements = [
    `CREATE TABLE IF NOT EXISTS admin (
      admin_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS elections (
      election_id INT AUTO_INCREMENT PRIMARY KEY,
      election_name VARCHAR(255) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      election_type VARCHAR(50) NOT NULL,
      admin_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS constituencies (
      constituency_id INT AUTO_INCREMENT PRIMARY KEY,
      election_id INT NOT NULL,
      constituency_name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS candidates (
      candidate_id INT AUTO_INCREMENT PRIMARY KEY,
      constituency_id INT NOT NULL,
      candidate_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS voters (
      voter_id INT AUTO_INCREMENT PRIMARY KEY,
      voter_name VARCHAR(255) NULL,
      email VARCHAR(255) NOT NULL,
      voter_id_number VARCHAR(255) NOT NULL,
      election_id INT NULL,
      constituency_id INT NULL,
      face_registered BOOLEAN DEFAULT FALSE,
      face_embedding TEXT NULL,
      is_registered BOOLEAN DEFAULT FALSE,
      has_voted BOOLEAN DEFAULT FALSE,
      registered_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS votes (
      vote_id INT AUTO_INCREMENT PRIMARY KEY,
      voter_id INT NOT NULL,
      election_id INT NOT NULL,
      candidate_id INT NOT NULL,
      constituency_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS election_results (
      result_id INT AUTO_INCREMENT PRIMARY KEY,
      election_id INT NOT NULL,
      constituency_id INT NOT NULL,
      winner_candidate_id INT NOT NULL,
      total_eligible_voters INT NOT NULL,
      total_votes_cast INT NOT NULL,
      winning_margin DECIMAL(10,2) NOT NULL,
      declared_by_admin_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const statement of statements) {
    await db.query(statement);
  }
};

const seedDefaultAdmin = async () => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM admin");

    if (rows[0].count > 0) {
      return;
    }

    const username = process.env.ADMIN_USERNAME || "admin";
    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    await db.query(
      "INSERT INTO admin (username, email, password) VALUES (?, ?, ?)",
      [username, email, password],
    );

    console.log("Default admin account created.");
  } catch (error) {
    console.error("Failed to seed default admin:", error.message);
  }
};

const initializeDatabase = async () => {
  try {
    await createTables();
    await seedDefaultAdmin();
    console.log("Database schema initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
};

module.exports = { initializeDatabase };
