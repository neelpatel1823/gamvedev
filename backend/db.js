const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'team_game_db';

let pool = null;

async function ensureMySqlServerRunning() {
  try {
    const testConn = await mysql.createConnection({ ...dbConfig, connectTimeout: 2000 });
    await testConn.end();
    return;
  } catch (_) {
    const baseDir = path.resolve(__dirname, '../mysql84/PFiles64/MySQL/MySQL Server 8.4');
    const mysqldPath = path.join(baseDir, 'bin', 'mysqld.exe');
    const dataDir = path.resolve(__dirname, '../mysql_data');

    if (fs.existsSync(mysqldPath) && fs.existsSync(dataDir)) {
      const child = spawn(
        mysqldPath,
        [
          '--no-defaults',
          `--basedir=${baseDir}`,
          `--datadir=${dataDir}`,
          `--port=${dbConfig.port}`,
          '--bind-address=127.0.0.1',
        ],
        {
          detached: true,
          stdio: 'ignore',
          windowsHide: true,
        }
      );
      child.unref();

      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 500));
        try {
          const checkConn = await mysql.createConnection({ ...dbConfig, connectTimeout: 1500 });
          await checkConn.end();
          return;
        } catch (_) {}
      }
    }
  }
}

async function initDatabase() {
  await ensureMySqlServerRunning();

  const connection = await mysql.createConnection(dbConfig);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.end();

  pool = mysql.createPool({
    ...dbConfig,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teams (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS games (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      genre VARCHAR(100) DEFAULT 'General',
      platform VARCHAR(100) DEFAULT 'PC',
      release_date DATE NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  console.log(`MySQL Database "${dbName}" connected.`);
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

module.exports = {
  initDatabase,
  getPool,
};
