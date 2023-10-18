const express = require("express");
const app = express();
const port = 3000;

const routesApp = require("./src/routes/route");
const authApp = require("./src/routes/auth");

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// const AuthenticateToken = require("./src/middleware/authenticateToken");


// jangan lupa mengatasi error CORS 

// Routes auth
app.use("/v1/auth/", authApp);
app.use("/v1/admin/", routesApp);

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
