require("dotenv").config();
const express = require("express");
const authApp = require("./src/routes/auth");
const adminApp = require("./src/routes/admin");
const userApp = require("./src/routes/user");
const cookieParser = require("cookie-parser");
const AuthenticateToken = require("./src/middleware/authenticateToken");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// handle error CORS 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", '*');
  res.setHeader("Access-Control-Allow-Origin", 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader("Access-Control-Allow-Origin", 'Content-Type, Authorization');
  next();
})

// Routes auth
app.use("/v1/auth/", authApp);
// Routes Admin
app.use("/v1/admin/", AuthenticateToken, adminApp);
// Routes User
app.use('/user', userApp);

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

app.listen(port, () => console.log(`listen in http://localhost:${port}`));
