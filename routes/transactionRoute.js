const express = require("express");
const transactionRouter = express.Router();
const sql = require("mssql");
const connect = require("../config/sqlConfig");

transactionRouter.get("/reference", async (req, res) => {
  await connect();
  const request = new sql.Request();
  const query = request.query(
    "SELECT MAX(SalesDocNumber)+1 as [SalesDocNumber] FROM Item_Invoice WHERE SalesType='Cash Sales'"
  );
  const response = (await query).recordset.map((reference) => ({
    InvoiceNumber: reference.SalesDocNumber,
  }));
  const currSalesDocNumber = response[0].InvoiceNumber.toString();

  switch (currSalesDocNumber.length) {
    case 6:
      response[0].InvoiceNumber = "0" + currSalesDocNumber;
      break;
    case 5:
      response[0].InvoiceNumber = "00" + currSalesDocNumber;
      break;
    case 4:
      response[0].InvoiceNumber = "000" + currSalesDocNumber;
      break;
    case 3:
      response[0].InvoiceNumber = "0000" + currSalesDocNumber;
      break;
    case 2:
      response[0].InvoiceNumber = "00000" + currSalesDocNumber;
      break;
    case 1:
      response[0].InvoiceNumber = "000000" + currSalesDocNumber;
      break;
  }
  res.status(200).send(response);
});

module.exports = transactionRouter;
