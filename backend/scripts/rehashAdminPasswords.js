const bcrypt = require("bcrypt");
const db = require("../config/database");
require("dotenv").config();

async function rehashPasswords() {
  try {
    console.log("Starting password rehash...");

    // Get all admins
    const [admins] = await db.query("SELECT admin_id, password FROM admin");

    for (const admin of admins) {
      // Check if already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (admin.password.startsWith("$2")) {
        console.log(`Admin ${admin.admin_id}: Already hashed, skipping`);
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      // Update the database
      await db.query("UPDATE admin SET password = ? WHERE admin_id = ?", [
        hashedPassword,
        admin.admin_id,
      ]);

      console.log(`Admin ${admin.admin_id}: Password rehashed successfully`);
    }

    console.log("Password rehash complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during rehashing:", error);
    process.exit(1);
  }
}

rehashPasswords();
