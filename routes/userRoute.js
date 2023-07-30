const express = require("express");
const userRouter = express.Router();
const sql = require("mssql");
const connect = require("../config/sqlConfig");

userRouter.post("/login/facebook", async (req, res) => {
  const { accessToken } = req.body; // Assuming you are sending the access token from the React Native app in the request body

  try {
    // Step 1: Verify the access token with Facebook's API
    const facebookAppId = "1241536593391322";
    const facebookAppSecret = "2159ba25dca8e9e17afa93e411703318";
    const appAccessTokenResponse = await fetch.get(
      `https://graph.facebook.com/oauth/access_token?client_id=1241536593391322&client_secret=2159ba25dca8e9e17afa93e411703318&grant_type=client_credentials`
    );
    const appAccessToken = appAccessTokenResponse.data.access_token;

    const debugTokenResponse = await fetch.get(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`
    );
    const isValidToken = debugTokenResponse.data.data.is_valid;

    if (!isValidToken) {
      return res.status(400).json({ error: "Invalid access token" });
    }

    // Step 2: Exchange the short-lived token for a long-lived token
    const exchangeTokenResponse = await fetch.get(
      `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${facebookAppId}&client_secret=${facebookAppSecret}&fb_exchange_token=${accessToken}`
    );
    const longLivedAccessToken = exchangeTokenResponse.data.access_token;

    // Step 3: Fetch user information from Facebook's Graph API
    const userResponse = await fetch.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${longLivedAccessToken}`
    );
    const userData = userResponse.data;

    // At this point, you have the user's information (id, name, email, etc.) in the 'userData' variable
    // You can use this data to create or update the user in your database and return relevant information to the React Native app

    return res.json(userData);
  } catch (error) {
    console.error("Error logging in with Facebook:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred during Facebook login" });
  }
});

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
