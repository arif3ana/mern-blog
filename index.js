require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const routesApp = require("./src/routes/route");
const authApp = require("./src/routes/auth");
// const upload = require("./src/middleware/imageHandler");
const AuthenticateToken = require("./src/middleware/authenticateToken");

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(upload.fields([
//     {name: "image", maxCount: 1}, 
//     {name: "img", maxCount: 10}
//   ]));


// jangan lupa mengatasi error CORS 

// Routes auth
app.use("/v1/auth/", authApp);
app.use("/v1/admin/", AuthenticateToken, routesApp);

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
