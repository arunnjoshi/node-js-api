require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


//routes files
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
//middelwares

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//app routes

app.use("/api", authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);

// port number of app

const portNumber = process.env.PORTNUMBER || 8000;

// connect to the database

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => console.log("db connected")).catch((err) => console.log(err))

//starting server

app.listen(portNumber, () => {
    console.log(`app is running on portnumber ${portNumber}`);
});