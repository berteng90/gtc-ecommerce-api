const express = require("express");
const transactionRouter = express.Router();
const sql = require("mssql");
const connect = require("../config/sqlConfig");

transactionRouter.get("/reference", async (req, res) => {
  await connect();
  const request = new sql.Request();
  const query = request.query(
    "SELECT MAX(0000001)+1 as [SalesDocNumber] FROM Item_Invoice WHERE SalesType='Cash Sales'"
  );
  const response = (await query).recordset.map((reference) => ({
    InvoiceNumber: reference.SalesDocNumber,
  }));
  const currSalesDocNumber = response[0].InvoiceNumber.toString();
  let maxSalesDocNumber = "";

  switch (currSalesDocNumber.length) {
    case 6:
      maxSalesDocNumber = "0" + currSalesDocNumber;
      break;
    case 5:
      maxSalesDocNumber = "00" + currSalesDocNumber;
      break;
    case 4:
      maxSalesDocNumber = "000" + currSalesDocNumber;
      break;
    case 3:
      maxSalesDocNumber = "0000" + currSalesDocNumber;
      break;
    case 2:
      maxSalesDocNumber = "00000" + currSalesDocNumber;
      break;
    case 1:
      maxSalesDocNumber = "000000" + currSalesDocNumber;
      break;
  }
  res.status(200).send(maxSalesDocNumber);
});

module.exports = transactionRouter;
