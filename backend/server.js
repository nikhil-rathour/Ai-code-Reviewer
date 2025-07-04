const app = require("./src/app.js");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`server is runing ${PORT}`);

})