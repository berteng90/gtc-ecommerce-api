const sql = require("mssql");
const dotenv = require("dotenv").config();
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: "localhost",
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const connect = async () => {
  try {
    await sql.connect(sqlConfig);
    console.log("Connected to SQL Server database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connect;
