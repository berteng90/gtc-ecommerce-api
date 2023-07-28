const express = require("express");
const transactionRouter = express.Router();
const sql = require("mssql");
const connect = require("../config/sqlConfig");

transactionRouter.get("/reference", async (req, res) => {
  await connect();
  const request = new sql.Request();
  const query = request.query(
    "SELECT 'I' + CAST(MAX(CAST(RIGHT(ReferenceNumber, 6) AS INT)) + 1 AS VARCHAR(7)) as [referenceNumber] FROM Item_SalesOrder"
  );
  const response = (await query).recordset.map((reference) => ({
    orderNumber: reference.referenceNumber,
  }));
  res.status(200).send(response);
  sql.close();
});

transactionRouter.get("/checkout", async (req, res) => {
  res.status(200).send("Hello World");
});

module.exports = transactionRouter;
