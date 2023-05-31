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
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    const result = await sql.query`select * from Item_Invoice`;
    console.dir(result);
  } catch (err) {
    console.log(err);
  }
};
connect();
