require("dotenv").config();
const express = require("express");
const authApp = require("../src/routes/auth");
const adminApp = require("../src/routes/admin");
const userApp = require("../src/routes/user");
const Path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AuthenticateToken = require("../src/middleware/authenticateToken");

const app = express();
const port = process.env.APP_PORT;

const corsOptions = {
  origin: process.env.ORIGIN_FRONTEND_URL,
  credentials: true,
  exposedHeaders: ['Authorization', 'Cookie'],
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/uploads", express.static(Path.join(__dirname, "uploads")));
app.use(cors(corsOptions));


app.use(cookieParser());
// Routes auth
app.use("/v1/auth/", authApp);
// Routes Admin
app.use("/v1/user/", AuthenticateToken, adminApp);
// Routes User
app.use('/foods', userApp);

// Default error handler
app.use((err, req, res, next) => {
    if (err) {
        res.status(err.status || 500).json({
          msg: err.message || 'Internal Server Error', data: err.data || null
        });
      } else {
        next();
      }
})

app.listen(port, () => console.log(`listen in ${port}`));
