const express = require("express");
const productRouter = express.Router();
const sql = require("mssql");
const connect = require("../config/sqlConfig");

//Fetch Product categories
productRouter.get("/categories", async (req, res) => {
  try {
    await connect();
    const request = new sql.Request();
    const query = await request.query("SELECT * FROM API_Item_Categories");
    const response = query.recordset.map((category) => ({
      ID: category.ID,
      Category: category.Category,
      CategoryImagePath: category.ImagePath,
      CategoryCode: category.CategoryCode,
      CategoryImage: category.Img,
    }));
    res.send(response).status(200);
    sql.close();
  } catch (err) {
    console.log(err);
  }
});

//Fetch Featured Products
productRouter.get("/featured", async (req, res) => {
  try {
    await connect();
    const request = new sql.Request();
    const query = request.query(
      "SELECT API_Item_FeaturedProducts.ItemID, Name, Description,Price, Image FROM API_Item_FeaturedProducts INNER JOIN API_Item_InventoryMaster ON API_Item_InventoryMaster.ItemID=API_Item_FeaturedProducts.ItemID"
    );
    const response = (await query).recordset.map((item) => ({
      ID: item.ItemID,
      ItemName: item.Name,
      ItemDescription: item.Description,
      ItemPrice: item.Price,
      ItemImage: item.Image,
    }));
    res.send(response).status(200);
    sql.close();
  } catch (err) {
    console.log(err);
  }
});

//Fetch Deals of the day
productRouter.use("/deals", async (req, res) => {
  await connect();
  const request = new sql.Request();
  const query = request.query(
    "SELECT API_Item_DealsOfTheDay.ItemID, Name, Description,SpecialPrice, Image FROM API_Item_DealsOfTheDay  INNER JOIN API_Item_InventoryMaster ON API_Item_InventoryMaster.ItemID=API_Item_DealsOfTheDay.ItemID"
  );
  const response = (await query).recordset.map((item) => ({
    ID: item.ItemID,
    ItemName: item.Name,
    ItemDescription: item.Description,
    ItemSpecialPrice: item.SpecialPrice,
    ItemImage: item.Image,
  }));
  res.send(response).status(200);
  sql.close();
});

//Fetch Products based on Category
productRouter.get("/categorycode/:categorycode", async (req, res) => {
  await connect();
  const { categorycode } = req.params;
  const request = new sql.Request();
  request.input("category", sql.VarChar, categorycode);
  const query = request.query(
    "SELECT * FROM API_Item_InventoryMaster WHERE CategoryCode = @category"
  );
  const data = (await query).recordset.map((item) => ({
    ID: item.itemID,
    ItemName: item.Name,
    ItemDescription: item.Description,
    ItemPrice: item.Price,
    ItemImage: item.Image,
  }));
  res.send(data).status(200);
  sql.close();
});

//Fetch Products based on Product Name
productRouter.get("/name/:name", async (req, res) => {
  await connect();
  const { name } = req.params;
  const request = new sql.Request();
  request.input("name", sql.VarChar, name);
  const query = request.query(
    "SELECT * FROM API_Item_InventoryMaster WHERE Name LIKE '%' + @name + '%'"
  );
  const data = (await query).recordset.map((item) => ({
    ID: item.itemID,
    ItemName: item.Name,
    ItemDescription: item.Description,
    ItemPrice: item.Price,
    ItemImage: item.Image,
  }));
  res.status(200).send(data);
  sql.close();
});

module.exports = productRouter;
