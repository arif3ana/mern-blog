const express = require("express");
const app = express();
const port = 3000;

const routesApp = require("./src/routes/auth");
const authApp = require("./src/routes/auth");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// jangan lupa mengatasi error CORS 
// auth
app.use("/v1/auth/", authApp);
app.use("/v1/admin/", routesApp);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message, data});
})

app.listen(port, () => console.log(`server listen in http://localhost:${port}`));
