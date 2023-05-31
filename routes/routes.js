const express = require("express");
const dotenv = require("dotenv").config();
const router = express.Router();
const connect = require("../config/sqlConfig");
const sql = require("mssql");

connect();
/* Get Item Details */
router.get("/", async (req, res) => {
  try {
    const result = await sql.query("SELECT * From Item_InventoryMaster");
    const items = result.recordset.map((row) => ({
      ItemID: row.ItemId,
      ItemDescription: row.ItemDescription,
    }));

    res.send(items); // Send the extracted data to the client
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving data from database");
  }
});

/* Get User Transactions */
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await sql.query(
      `SELECT * From Item_Invoice Where Subsidiaryid=${id}`
    );
    const items = result.recordset.map((row) => ({
      transactionNum: row.SalesDocNumber,
      transactionDate: row.TransactionDate,
      customName: row.CustomerName,
    }));
    res.send(items);
  } catch (err) {
    console.log(err);
  }
});

router.get("/ref/:id", async (req, res) => {
  const maxAdjustmentRef = await sql.query(
    `SELECT MAX(SalesDocNumber) as 'SalesDocNumber' From Item_Invoice Where SalesType like '%Adjust%'`
  );
  const refNum = maxAdjustmentRef.recordset.map((row) => row.SalesDocNumber);
  res.send(refNum);
});

module.exports = router;
