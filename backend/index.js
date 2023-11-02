const express = require("express");
require("dotenv").config();
const cors = require("cors");

const db = require("./config/db");

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');


app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/vendors', vendorRoutes);


app.listen(PORT, () => {
    console.log("Server running at port: ", PORT);
  });