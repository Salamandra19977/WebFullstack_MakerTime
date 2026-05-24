require("dotenv").config();

const mysql = require("mysql2/promise");

async function migrate() {

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    console.log("Connected to MySQL");

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    console.log("Database created or already exists");

    await connection.query(
        `USE ${process.env.DB_NAME}`
    );

    await connection.query(`
        CREATE TABLE IF NOT EXISTS tracks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            artist VARCHAR(255) NOT NULL,
            genre VARCHAR(100) NOT NULL,
            audio_path VARCHAR(255) NOT NULL,
            cover_path VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Table 'tracks' ready");

    await connection.end();

    console.log("Migration completed");
}

migrate().catch((err) => {
    console.error("Migration error:", err);
});