import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./database/db.js";
import path from "path";
import http from 'http';
import { fileURLToPath } from "url";
import { Server } from 'socket.io';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import companyRouter from "./routes/company.route.js";
import branchRouter from "./routes/branch.route.js";
import employeeRouter from "./routes/employee.route.js";
import rolePermissionRouter from "./routes/rolePermission.route.js";
import areaRouter from "./routes/area.route.js";
import tableRouter from "./routes/table.route.js";
import foodCategoryRouter from "./routes/foodCategory.route.js";
import foodMenuRouter from "./routes/foodMenu.route.js";
import cartRouter from "./routes/cart.route.js";
import chefRouter from "./routes/chef.route.js";
import waiterRouter from "./routes/waiter.route.js";
import deliveryPartnerRouter from "./routes/deliveryPartner.route.js";
import customerRouter from "./routes/customer.route.js";
import supplierRouter from "./routes/supplier.route.js";
import ingredientUnitRouter from "./routes/ingredientUnit.route.js";
import ingredientCategoryRouter from "./routes/ingredientCategory.route.js";
import ingredientRouter from "./routes/ingredient.route.js";
import cuisineRouter from "./routes/cuisine.route.js";
import foodComboRouter from "./routes/foodCombo.route.js";
import modifierRouter from "./routes/modifier.route.js";
import floorRouter from "./routes/floor.route.js";
import kitchenRouter from "./routes/kitchen.route.js";
import orderRouter from "./routes/order.route.js";
import kotRouter from "./routes/kot.route.js";
import billingRouter from "./routes/billing.route.js";
import inventoryRouter from "./routes/inventory.route.js";
import inventoryStockRouter from "./routes/inventoryStock.route.js";
import purchaseRouter from "./routes/purchase.route.js";
import purchaseItemRouter from "./routes/purchaseItem.route.js";
import branchStockRouter from "./routes/branchStock.route.js";
import paymentRouter from "./routes/payment.route.js";
import reportRouter from "./routes/report.route.js";
import stockAdjustmentRouter from "./routes/stockAdjustment.route.js";
import couponRouter from "./routes/coupon.route.js";
import veriationRouter from "./routes/veriation.route.js";
import addOnRouter from "./routes/addOn.route.js";
import sendNotificationRouter from "./routes/sendNotification.route.js";
import addFundRouter from "./routes/addFund.route.js";

const app = express();
dotenv.config();
const PORT = 7000;

/*****************MIDDLEWARES*****************/

app.use(cors());
// app.use(bodyParser.json())
// app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/", express.static(__dirname + "/public"));
app.use("/socket", express.static(__dirname + "/socket"));
app.use(cookieParser());

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*"
  }
});

io.on('connection', (socket) => {
  console.log('A company connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Company disconnected');
  });
});

/*******************ROUTES******************/
app.use("/company", companyRouter);
app.use("/branch", branchRouter);
app.use("/employee", employeeRouter);
app.use("/rolePermission", rolePermissionRouter);
app.use("/area", areaRouter);
app.use("/table", tableRouter);
app.use("/foodCategory", foodCategoryRouter);
app.use("/foodMenu", foodMenuRouter);
app.use("/cart", cartRouter);
app.use("/chef", chefRouter);
app.use("/waiter", waiterRouter);
app.use("/deliveryPartner", deliveryPartnerRouter);
app.use("/customer", customerRouter);
app.use("/supplier", supplierRouter);
app.use("/ingredientUnit", ingredientUnitRouter);
app.use("/ingredientCategory", ingredientCategoryRouter);
app.use("/ingredient", ingredientRouter);
app.use("/cuisine", cuisineRouter);
app.use("/foodCombo", foodComboRouter);
app.use("/modifier", modifierRouter);
app.use("/floor", floorRouter);
app.use("/kitchen", kitchenRouter);
app.use("/order", orderRouter);
app.use("/kot", kotRouter);
app.use("/billing", billingRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventoryStock", inventoryStockRouter);
app.use("/purchase", purchaseRouter);
app.use("/purchaseItem", purchaseItemRouter);
app.use("/branchStock", branchStockRouter);
app.use("/payment", paymentRouter);
app.use("/report", reportRouter);
app.use("/stockAdjustment", stockAdjustmentRouter);
app.use("/coupon", couponRouter);
app.use("/veriation", veriationRouter);
app.use("/addOn", addOnRouter);
app.use("/sendNotification", sendNotificationRouter);
app.use("/addFund", addFundRouter);

/***************************************/

const MONGO_URI = process.env.MONGO_URI;

dbConnection(MONGO_URI);

server.listen(PORT, (err) => {
  if (err) {
    console.log(`Error while listening on PORT: ${PORT}`);
  } else {
    console.log(`Server is listening on PORT: ${PORT}`);
  }
});
