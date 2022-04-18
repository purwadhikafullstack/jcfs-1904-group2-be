require("dotenv").config();
const mysql2 = require("mysql2");

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 50,
});

pool.getConnection((err, conn) => {
  if (err) {
    conn.release();
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log(`Successfully connected to the database (id ${conn.threadId})`);
  conn.release();
});

module.exports = pool;
