const express = require("express");
const userRouter = express.Router();
const sql = require("mssql");
const connect = require("../config/sqlConfig");

/* Fetch User Information */
userRouter.get("/user/:id", async (req, res) => {
  try {
    await connect();
    const id = req.params.id;
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const query = await request.query(
      `SELECT SubFullName, SubVertical FROM GLSubsidiary Where RecordNo=@id`
    );
    const info = query.recordset.map((user) => ({
      fullName: user.SubFullName,
      cardNo: user.SubVertical,
    }));
    res.send(info).status(200);
    sql.close();
  } catch (err) {}
});

/* Fetch All User Transactions */
userRouter.get("/transactions/:id", async (req, res) => {
  try {
    await connect();
    const id = req.params.id;
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const query =
      await request.query(`SELECT CAST(TransDate as Date) as [TransactionDate], Invoice as [ReferenceNumber],InvAmount as [Amount],PtsEarned as [PointsEarned], 
    CASE WHEN Loyalty_Ledger.MerchantId=15 THEN 'GTC DON CARLOS' WHEN Loyalty_Ledger.MerchantId=16 THEN 'GTC MARAMAG' WHEN Loyalty_Ledger.MerchantId=17 THEN 'GTC QUEZON' 
    WHEN Loyalty_Ledger.MerchantId=18 THEN 'GTC TABLON' WHEN Loyalty_Ledger.MerchantID=18 THEN 'GTC WAO' 
    WHEN Loyalty_Ledger.MerchantId=31 THEN 'GTC KADINGILAN' WHEN Loyalty_Ledger.MerchantId=42 THEN 'GTC KIBAWE' END as [Branch] FROM Loyalty_Ledger
    
    INNER JOIN Loyalty_Accounts ON Loyalty_Accounts.IDNum=Loyalty_Ledger.Accounts
    INNER JOIN GlSubsidiary ON GlSubsidiary.RecordNo=Loyalty_Accounts.Gl_id
    where RecordNo=@id
    order by TransDate ASC`);
    const data = query.recordset.map((transaction) => ({
      Date: transaction.TransactionDate,
      ReferenceNo: transaction.ReferenceNumber,
      Amount: transaction.Amount,
      "Points Earned": transaction.PointsEarned,
      Branch: transaction.Branch,
    }));
    res.send(data).status(200);
    sql.close();
  } catch (err) {
    console.log(err);
  }
});

//Fetch User Account
userRouter.get("/login", async (req, res) => {
  const { username, password } = req.params;
});

module.exports = userRouter;
