const app = require("./src/app.js");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Welcome to the AI Code Reviewer API Server");
});

app.listen(PORT, () => {
    console.log(`server is runing ${PORT}`);

})