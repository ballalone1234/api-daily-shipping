require("dotenv").config();
const sql = require('mssql');

const DB_CONFIG_MSSQL = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false, 
  },
};

const DB_CONFIG_MYSQL = {
  host: process.env.DB_SERVER_147,
  user: process.env.DB_USER_147,
  password: process.env.DB_PWD_147,
  connectTimeout: 1000,
  acquireTimeout: 1000,
};

async function con_MS() {
  try {
    const pool = await sql.connect(DB_CONFIG_MSSQL);
    if (pool.connected) {
      console.log('Connected to database');
    }
    return pool;
  } catch (err) {
    console.error('Error connecting to database :', err);
    throw err;
  }
}
con_MS();
module.exports = {DB_CONFIG_MSSQL, DB_CONFIG_MYSQL};
