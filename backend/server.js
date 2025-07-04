const app = require("./src/app.js");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("Home page");
});

app.listen(PORT, () => {
    console.log(`server is runing ${PORT}`);

})